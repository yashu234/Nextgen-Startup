# 🚀 Startup Forge & AI Engine

An all-in-one AI platform for generating investor-ready startup kits, business plans, branding assets, financial models, compliance checklists, and pitch decks.

---

## 📁 Monorepo Structure

```text
ai-engine / Nextgen-Startup
├── frontend/             # React + Vite Frontend Application (Port 5173 / 3000)
│   ├── src/
│   │   ├── components/   # UI Cards, Charts, Buttons, Modals, Loaders
│   │   ├── context/      # AuthContext, StartupContext, ToastContext
│   │   ├── pages/        # All 17 views (Dashboard, BusinessPlan, Compliance, etc.)
│   │   ├── services/     # API Axios services
│   │   └── utils/        # pdfGenerator, complianceEngine, financeCalculator, formatters
│   └── package.json
│
├── backend/              # Node.js + Express API Backend (Port 5000)
│   ├── config/           # Database configuration
│   ├── controllers/      # Auth, Startup, Finance, History, User controllers
│   ├── models/           # Mongoose Data Models
│   ├── routes/           # Express API endpoints (/api/auth, /api/startup, etc.)
│   ├── services/         # Gemini AI Service Bridge & Fallback Engine
│   ├── docs/             # Consolidated API & Architecture Documentation
│   └── package.json
│
├── ai-cli/               # Standalone AI Engine CLI Application
│   ├── src/              # Modular prompt generators & rate limiter
│   └── package.json
│
├── .env.example          # Environment variable template
└── package.json          # Monorepo root script launcher
```

---

## ⚡ Quick Start

### 1. Install Dependencies
Run the command below from the root directory to install dependencies across all services:
```bash
npm run install:all
```

### 2. Configure Environment Variables
Copy `.env.example` to `backend/.env` and update your keys:
```bash
cp .env.example backend/.env
```

### 3. Run Applications

- **Start Express Backend API** (Runs on `http://localhost:5000`):
  ```bash
  npm run dev:backend
  ```

- **Start React Frontend** (Runs on `http://localhost:5173`):
  ```bash
  npm run dev:frontend
  ```

- **Run AI Engine Interactive CLI**:
  ```bash
  npm run cli
  ```

- **Build Frontend for Production**:
  ```bash
  npm run build:frontend
  ```

---

## 📄 License
ISC / Proprietary - Startup Forge Team.
