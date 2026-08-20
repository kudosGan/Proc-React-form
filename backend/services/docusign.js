/**
 * DocuSign e-signature service
 * ─────────────────────────────
 * JWT-authenticates as the configured DocuSign user, then sends the
 * generated procurement PDF as an envelope to the Section 32 Manager
 * for signature. Requires a one-time consent grant (see README) and
 * the DOCUSIGN_* vars in backend/.env.
 */

import fs from 'fs'
import docusign from 'docusign-esign'

const JWT_LIFETIME_SECONDS = 3600

export const isDocuSignConfigured = () => {
  const { DOCUSIGN_INTEGRATION_KEY, DOCUSIGN_USER_ID, DOCUSIGN_ACCOUNT_ID, DOCUSIGN_PRIVATE_KEY_PATH } = process.env
  return !!(
    DOCUSIGN_INTEGRATION_KEY &&
    DOCUSIGN_USER_ID &&
    DOCUSIGN_ACCOUNT_ID &&
    DOCUSIGN_PRIVATE_KEY_PATH &&
    fs.existsSync(DOCUSIGN_PRIVATE_KEY_PATH)
  )
}

const authenticate = async () => {
  const {
    DOCUSIGN_INTEGRATION_KEY,
    DOCUSIGN_USER_ID,
    DOCUSIGN_BASE_PATH,
    DOCUSIGN_PRIVATE_KEY_PATH,
  } = process.env

  const apiClient  = new docusign.ApiClient()
  const authServer = (DOCUSIGN_BASE_PATH || '').includes('demo')
    ? 'account-d.docusign.com'
    : 'account.docusign.com'

  apiClient.setOAuthBasePath(authServer)

  const privateKey = fs.readFileSync(DOCUSIGN_PRIVATE_KEY_PATH)

  const { body } = await apiClient.requestJWTUserToken(
    DOCUSIGN_INTEGRATION_KEY,
    DOCUSIGN_USER_ID,
    ['signature', 'impersonation'],
    privateKey,
    JWT_LIFETIME_SECONDS
  )

  apiClient.setBasePath(DOCUSIGN_BASE_PATH)
  apiClient.addDefaultHeader('Authorization', `Bearer ${body.access_token}`)

  return apiClient
}

// ─────────────────────────────────────────────────────────────
// SEND FOR SIGNATURE
// Single signer (Section 32 Manager), SignHere tab anchored to
// the hidden "section32signhere" marker printed near the
// signature block in PrintPage.jsx.
// ─────────────────────────────────────────────────────────────
export const sendForSignature = async (pdfBuffer, { signerEmail, signerName, fiscalYear }) => {
  if (!signerEmail) {
    throw new Error('DocuSign: signerEmail (Section 32 Manager email) is required')
  }

  const apiClient  = await authenticate()
  const envelopesApi = new docusign.EnvelopesApi(apiClient)

  const document = new docusign.Document.constructFromObject({
    documentBase64: pdfBuffer.toString('base64'),
    name          : `ESC-${fiscalYear}-PENDING.pdf`,
    fileExtension : 'pdf',
    documentId    : '1',
  })

  const signer = docusign.Signer.constructFromObject({
    email       : signerEmail,
    name        : signerName || 'Section 32 Manager',
    recipientId : '1',
    routingOrder: '1',
    tabs: {
      signHereTabs: [
        docusign.SignHere.constructFromObject({
          anchorString      : 'section32signhere',
          anchorUnits       : 'pixels',
          anchorXOffset     : '0',
          anchorYOffset     : '-10',
          anchorIgnoreIfNotPresent: 'false',
        }),
      ],
    },
  })

  const envelopeDefinition = docusign.EnvelopeDefinition.constructFromObject({
    emailSubject: `Action Required: Section 32 e-Signature — Procurement Request ESC-${fiscalYear}`,
    documents   : [document],
    recipients  : { signers: [signer] },
    status      : 'sent',
  })

  const results = await envelopesApi.createEnvelope(process.env.DOCUSIGN_ACCOUNT_ID, {
    envelopeDefinition,
  })

  return { envelopeId: results.envelopeId, status: results.status }
}
