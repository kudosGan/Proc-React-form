const SIGNATURE_METHODS = [
  { value: 'docusign', label: 'DocuSign (e-signature)' },
  { value: 'mykey',    label: 'MyKey / Entrust (manual)' },
  { value: 'email',    label: 'Email PDF only' },
]

function FormFooter({
  currentPage,
  totalPages,
  onNext,
  onBack,
  onSubmit,
  submitDisabled,
  submitLabel,
  signatureMethod,
  onSignatureMethodChange,
}) {

  return (

    <div className="form-footer">

      <div className="footer-left">
        AAFC/AAC A9565
      </div>

      <div className="footer-center">

        {currentPage === totalPages && (
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginRight: 16, fontSize: 12 }}>
            <span style={{ fontWeight: 600 }}>Signature method:</span>
            {SIGNATURE_METHODS.map(({ value, label }) => (
              <label key={value} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="signatureMethod"
                  value={value}
                  checked={signatureMethod === value}
                  onChange={() => onSignatureMethodChange?.(value)}
                />
                {label}
              </label>
            ))}
          </div>
        )}

        {currentPage > 1 && (
          <button onClick={onBack}>
            Back
          </button>
        )}

        {currentPage < totalPages && (
          <button onClick={onNext}>
            Next
          </button>
        )}

        {currentPage === totalPages && (
          <button
            onClick={onSubmit}
            disabled={submitDisabled}
            style={{
              backgroundColor: submitDisabled ? '#9e9e9e' : '#2b579a',
              cursor         : submitDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            {submitLabel || 'Submit'}
          </button>
        )}

      </div>

      <div className="footer-right">
        <img
          src="/canada-wordmark.png"
          alt="Canada"
          className="footer-canada-logo"
        />
      </div>

    </div>

  )
}

export default FormFooter