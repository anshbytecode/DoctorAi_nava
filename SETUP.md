# DoctorAI - Setup & Run Guide

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

## Quick Start

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 3. Start Backend Server

Open a terminal and run:

```bash
cd backend
npm start
```

The backend will run on `http://localhost:3001`

**For development with auto-reload:**
```bash
cd backend
npm run dev
```

### 4. Start Frontend Server

Open a **new terminal** (keep backend running) and run:

```bash
npm run dev
```

The frontend will run on `http://localhost:8080`

## Access the Application

1. Open your browser and go to: `http://localhost:8080`
2. You'll see the DoctorAI homepage
3. Click "Sign Up" to create an account or "Sign In" if you already have one

## Environment Variables (Optional)

### Frontend
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:3001/api
```

### Backend
Create a `.env` file in the `backend` directory:
```
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
```

**Note:** If you don't create these files, the app will use default values.

## Troubleshooting

### Port Already in Use

If port 3001 (backend) is in use:
- Change `PORT` in `backend/.env` or `backend/server.js`

If port 8080 (frontend) is in use:
- Vite will automatically try the next available port
- Or change it in `vite.config.ts`

### Backend Not Starting

1. Make sure you're in the `backend` directory
2. Check that all dependencies are installed: `npm install`
3. Verify Node.js version: `node --version` (should be v16+)

### Frontend Can't Connect to Backend

1. Make sure backend is running on port 3001
2. Check `VITE_API_URL` in `.env` file
3. Check browser console for CORS errors

### Database/Storage

- User data is automatically stored in `backend/data/users.json`
- This file is created automatically on first signup
- No database setup required!

## Development Commands

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter

### Backend
- `npm start` - Start server
- `npm run dev` - Start with nodemon (auto-reload)

## Project Structure

```
doctor-ai-anshul/
├── src/                    # Frontend React code
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── contexts/           # React contexts (Auth)
│   └── lib/                # Utilities
├── backend/                # Backend Express server
│   ├── routes/             # API routes
│   ├── data/               # Data storage (auto-created)
│   └── server.js           # Main server file
└── public/                 # Static assets
```

## First Time Setup Checklist

- [ ] Install Node.js (v16+)
- [ ] Clone/download the project
- [ ] Run `npm install` in root directory
- [ ] Run `npm install` in backend directory
- [ ] Start backend server (`cd backend && npm start`)
- [ ] Start frontend server (`npm run dev`)
- [ ] Open browser to `http://localhost:8080`
- [ ] Create an account and explore!

## Need Help?

- Check the browser console for errors
- Check the backend terminal for server errors
- Verify both servers are running
- Make sure ports 3001 and 8080 are available

