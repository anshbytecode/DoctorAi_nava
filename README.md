# DoctorAI - AI-Powered Healthcare Assistant

A comprehensive healthcare application with AI-powered symptom analysis, doctor recommendations, health education, and more.

**Live URL**: https://doctoraibyanshul.netlify.app/

## Features

### Core Features
- 🔐 **User Authentication** - Secure signup and login with JWT tokens
- 🧠 **Enhanced AI Symptom Checker** - Multi-step analysis with follow-up questions, severity scoring, and emergency detection
- 👨‍⚕️ **Doctor Recommendations** - AI-powered matching with appointment booking
- 📚 **Health Education** - Access expert-reviewed health articles
- 💬 **AI Chat Assistant** - Real-time health guidance
- 📊 **Health Dashboard** - Complete health overview
- 📝 **Health Records** - Medical history with image attachments
- 💊 **Medication Tracking** - Track medications with reminders
- 📈 **Vitals Tracker** - Monitor vitals with visual charts
- 🖼️ **Image Upload** - Profile pictures and document uploads
- ⚕️ **Medicine Safety Checker** - Drug interaction and overdose risk detection
- 🎯 **Disease Risk Predictor** - AI-powered risk assessment for diabetes, heart disease, hypertension
- 📄 **Health Report Parser** - AI analysis of lab reports with medical term simplification
- 🏥 **Hospital Locator** - Find nearby hospitals and emergency services
- 📋 **Treatment Plan Generator** - Personalized treatment plans for common conditions
- 🧠 **Mental Health Scanner** - Comprehensive mental health assessment
- 👤 **Personal Health Profile** - Complete health information with risk factor analysis
- 🔔 **Notifications & Reminders** - Smart alerts and custom reminders

### Web3 Features
- 🔗 **Wallet Connection** - Connect MetaMask or other Web3 wallets
- 🌐 **IPFS Storage** - Decentralized image storage on IPFS
- 🏆 **Web3 Badges** - Unlock achievements and showcase your health journey
- 🔐 **Blockchain Integration** - Store health data on blockchain (optional)

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router
- TanStack Query

### Backend
- Node.js + Express
- JWT Authentication
- bcrypt for password hashing
- File-based data storage (JSON)

### Web3
- ethers.js for wallet integration
- IPFS for decentralized storage
- MetaMask/WalletConnect support

## Quick Start Guide

### Step 1: Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

### Step 2: Start the Backend Server

Open a terminal and run:
```bash
cd backend
npm start
```

The backend will run on `http://localhost:3001`

**For development (with auto-reload):**
```bash
cd backend
npm run dev
```

### Step 3: Start the Frontend Server

Open a **new terminal** (keep the backend running) and run:
```bash
npm run dev
```

The frontend will run on `http://localhost:8080`

### Step 4: Access the Application

1. Open your browser
2. Navigate to: `http://localhost:8080`
3. Sign up for a new account or log in

## Detailed Setup

See [SETUP.md](./SETUP.md) for complete setup instructions, troubleshooting, and more details.

### Environment Variables (Optional)

**Frontend** - Create `.env` in root:
```
VITE_API_URL=http://localhost:3001/api
```

**Backend** - Create `.env` in `backend/`:
```
JWT_SECRET=your-secret-key-here
PORT=3001
```

**Note:** Defaults are provided if you skip this step.

## Project Structure

```
doctor-ai-anshul/
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── contexts/       # React contexts (Auth)
│   ├── lib/            # Utilities and API
│   └── hooks/          # Custom hooks
├── backend/
│   ├── routes/         # API routes
│   ├── data/           # Data storage (auto-created)
│   └── server.js       # Express server
└── public/             # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

## Usage

1. Start both frontend and backend servers
2. Visit `http://localhost:8080`
3. Sign up for a new account or login
4. Explore the features:
   - Check symptoms using AI
   - Find and book doctors
   - Chat with AI assistant
   - View health education articles
   - Manage appointments and health records

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Change JWT_SECRET in production
- Use environment variables for sensitive data
- Web3 wallet connections are secure and non-custodial
- IPFS storage provides decentralized, permanent storage

## Web3 Integration

See [WEB3_SETUP.md](./WEB3_SETUP.md) for detailed Web3 setup instructions.

### Quick Web3 Setup:
1. Install MetaMask browser extension
2. Create or import a wallet
3. Connect wallet in the app (Profile → Web3 Wallet)
4. Enable Web3 features for decentralized storage

## License

This project is for educational purposes.

