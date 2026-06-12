# AAFC Procurement Request Form
### A9565-E · React + Express · Copilot Agent · Power Automate

---

## What this does

A browser-based version of the AAFC Procurement Request Form A9565-E with:

- **4-page React form** — mirrors the government PDF exactly
- **AI Copilot side panel** — fill fields by typing naturally (Azure OpenAI, connect later)
- **PDF fill on submit** — `node-pdftk` fills the XFA government PDF
- **Power Automate integration** — one HTTP trigger handles everything:
  - Creates SharePoint list item with unique `ESC-2627-NNN` ID
  - Emails filled PDF to GD inbox for MyKey signing
  - Posts Teams notification
  - On signed PDF received → saves to SPO Documents → Teams confirms

---

## Prerequisites

### 1. Install pdftk (required for PDF filling)

**Windows**
Download and install from: https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/
Make sure `pdftk` is on your PATH (open Command Prompt → type `pdftk --version`)

**Mac**
```bash
brew install pdftk-java
```

**Ubuntu / WSL**
```bash
sudo apt-get install pdftk
```

**Azure App Service (when deploying)**
Add to your startup script:
```bash
apt-get install -y pdftk
```

### 2. Node.js 18+
Download from https://nodejs.org

---

## Project structure

```
procurement-app/
├── frontend/               ← React app (Vite)
│   ├── src/
│   │   ├── pages/          ← Page1–Page4 (your original form)
│   │   ├── components/     ← Your original components
│   │   ├── copilot/        ← NEW: CopilotPanel + agent logic
│   │   │   ├── CopilotPanel.jsx
│   │   │   ├── useAgentLoop.js
│   │   │   ├── agentMemory.js
│   │   │   ├── fieldMap.js
│   │   │   └── copilot.css
│   │   ├── App.jsx         ← Updated: submit handler + copilot wired in
│   │   └── styles/
│   ├── public/pdf/         ← A9565-E.pdf (already here)
│   └── .env.example
│
├── backend/                ← Express API
│   ├── routes/
│   │   ├── submit.js       ← Fills PDF + fires PA webhook
│   │   └── agent.js        ← AI agent chat + RL feedback
│   ├── pdf/                ← PUT A9565-E.pdf HERE TOO
│   ├── memory/             ← Agent RL memory (auto-created)
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## Quick start (local dev)

### Step 1 — Copy the PDF to the backend
```bash
cp frontend/public/pdf/A9565-E.pdf backend/pdf/A9565-E.pdf
```

### Step 2 — Set up backend
```bash
cd backend
cp .env.example .env
# Edit .env — add your POWER_AUTOMATE_URL and SIGNATORY_EMAIL
npm install
npm run dev
```

Backend starts on http://localhost:3001
Check http://localhost:3001/api/health to confirm it's running.

### Step 3 — Set up frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend starts on http://localhost:5173

---

## Power Automate setup

### Your PA flow receives this payload on submit:

```json
{
  "fiscalYear": "2627",
  "idPrefix": "ESC",
  "idFormat": "ESC-2627-NNN",
  "pdfBase64": "JVBERi0x...",
  "fileName": "ESC-2627-PENDING.pdf",
  "emailTo": "procurement-gd@agr.gc.ca",
  "emailSubject": "Procurement Request ESC-2627 — John Smith — Action Required: MyKey Signature",
  "emailBody": "...",
  "clientName": "John Smith",
  "clientBranch": "Corporate Management Branch",
  "requiresServices": true,
  "servicesStartDate": "2026-06-01",
  "totalEstimatedCost": 45000,
  "status": "Pending Signature",
  "submittedAt": "2026-05-19T14:32:00.000Z",
  "teamsMessageNew": "📋 New Procurement Request...",
  "teamsMessageSigned": "✅ Signed Document Received..."
}
```

### Recommended PA flow structure:

```
[HTTP trigger — When a HTTP request is received]
          ↓
[Initialize Variable — SubmissionID (string)]
          ↓
[Parallel Branch]
    ┌──────────────────────────────────────┐
    │ BRANCH A: SPO + Teams (new request)  │
    │  1. Get items from SPO list          │
    │     Sort by ID desc, top 1           │
    │  2. Compose next number              │
    │     pad(lastNumber + 1, 3, '0')      │
    │  3. Set SubmissionID variable        │
    │     = ESC-[fiscalYear]-[number]      │
    │  4. Create item in SPO list          │
    │     Title = SubmissionID             │
    │     + all other columns from payload │
    │  5. Post Teams message               │
    │     = triggerBody()?['teamsMessageNew']│
    │     (replace [ID] with SubmissionID) │
    └──────────────────────────────────────┘
    ┌──────────────────────────────────────┐
    │ BRANCH B: Email PDF to signatory     │
    │  1. Send an email (V2)               │
    │     To   = triggerBody()?['emailTo'] │
    │     Subj = triggerBody()?['emailSubject']│
    │     Body = triggerBody()?['emailBody']│
    │     Attachments:                     │
    │       Name    = SubmissionID + .pdf  │
    │       Content = triggerBody()?['pdfBase64']│
    └──────────────────────────────────────┘
          ↓
[When signed PDF email received]
  (Use "When a new email arrives" trigger
   filtering on subject containing "ESC-")
          ↓
[Save attachment to SPO Documents]
  File name = SubmissionID + .pdf
          ↓
[Update SPO list item]
  Status = "Signed"
          ↓
[Post Teams message]
  = triggerBody()?['teamsMessageSigned']
```

---

## Connecting Azure OpenAI (Copilot agent)

### Step 1 — Create Azure OpenAI resource
1. Go to portal.azure.com
2. Create → Azure OpenAI
3. Region: Canada East (closest to AAFC)
4. Deploy a model: choose `gpt-4o`

### Step 2 — Add credentials to backend/.env
```env
AZURE_OPENAI_KEY=your-key-here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=gpt-4o
```

### Step 3 — Uncomment the Azure block in backend/routes/agent.js
In `backend/routes/agent.js`, uncomment the Azure OpenAI section
and comment out the stub section. Restart the backend.

The copilot will now understand natural language and fill form fields
automatically using the full plan → act → observe → reflect → learn loop.

---

## Finding real PDF field names

The A9565-E is a Dynamic XFA form. To get the exact field names:

```bash
pdftk backend/pdf/A9565-E.pdf dump_data_fields > fields.txt
cat fields.txt
```

Then update the `buildPdfFields()` function in `backend/routes/submit.js`
to match the exact field names from the PDF.

---

## Deploying to Azure

### Frontend → Azure Static Web Apps
```bash
cd frontend
npm run build
# Deploy the dist/ folder to Azure Static Web Apps
# Or connect your GitHub repo for auto-deploy
```

### Backend → Azure App Service
```bash
cd backend
# Install Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
az login
az webapp up --name your-app-name --resource-group your-rg --runtime "NODE:20-lts"
```

Set environment variables in Azure Portal:
- App Service → Configuration → Application settings
- Add all keys from backend/.env.example

### pdftk on Azure App Service
Add to your App Service startup command:
```bash
apt-get install -y pdftk && node server.js
```

---

## Local testing checklist

- [ ] pdftk installed and on PATH (`pdftk --version`)
- [ ] `backend/pdf/A9565-E.pdf` exists
- [ ] `backend/.env` has POWER_AUTOMATE_URL filled in
- [ ] `backend/.env` has SIGNATORY_EMAIL filled in
- [ ] Backend running: `cd backend && npm run dev`
- [ ] Frontend running: `cd frontend && npm run dev`
- [ ] Health check passing: http://localhost:3001/api/health
- [ ] Fill out form → click Submit on Page 4 → check backend console logs

---

## Support

For Power Automate questions specific to your AAFC tenant, contact your IT/IM team.
For Azure OpenAI access, request through your Azure subscription administrator.
