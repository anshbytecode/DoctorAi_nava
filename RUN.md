# How to Run DoctorAI

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

**Install frontend dependencies:**
```bash
npm install
```

**Install backend dependencies:**
```bash
cd backend
npm install
cd ..
```

### Step 2: Start Backend Server

Open **Terminal 1** (or Command Prompt) and run:
```bash
cd backend
npm start
```

You should see: `Server is running on port 3001`

**Keep this terminal open!**

### Step 3: Start Frontend Server

Open **Terminal 2** (a new terminal window) and run:
```bash
npm run dev
```

You should see: `Local: http://localhost:8080`

### Step 4: Open in Browser

Open your browser and go to: **http://localhost:8080**

---

## 📋 Detailed Instructions

### Prerequisites
- Node.js installed (v16 or higher)
- npm (comes with Node.js)

### Windows (PowerShell/CMD)

1. **Open first terminal:**
   ```powershell
   cd backend
   npm install
   npm start
   ```

2. **Open second terminal (new window):**
   ```powershell
   npm install
   npm run dev
   ```

3. **Open browser:** `http://localhost:8080`

### Mac/Linux

1. **Open first terminal:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Open second terminal (new tab/window):**
   ```bash
   npm install
   npm run dev
   ```

3. **Open browser:** `http://localhost:8080`

---

## ✅ What You Should See

### Backend Terminal:
```
Server is running on port 3001
```

### Frontend Terminal:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

### Browser:
- DoctorAI homepage
- Sign Up / Sign In buttons
- Navigation menu

---

## 🔧 Troubleshooting

### "Port already in use"
- Backend (3001): Close other apps using port 3001 or change PORT in `backend/server.js`
- Frontend (8080): Vite will auto-use next available port

### "Cannot find module"
- Run `npm install` in both root and backend directories

### "Backend not connecting"
- Make sure backend is running first
- Check backend terminal for errors
- Verify backend is on port 3001

### "npm: command not found"
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

---

## 🎯 First Time Using?

1. **Start both servers** (backend first, then frontend)
2. **Open browser** to `http://localhost:8080`
3. **Click "Sign Up"** to create account
4. **Fill in details** and create account
5. **You'll be logged in automatically**
6. **Explore the dashboard!**

---

## 📝 Development Mode

**Backend with auto-reload:**
```bash
cd backend
npm run dev
```

**Frontend** (already has hot-reload):
```bash
npm run dev
```

---

## 🛑 Stopping the Servers

- Press `Ctrl + C` in each terminal
- Or close the terminal windows

---

## 💡 Pro Tips

1. **Always start backend first** - Frontend needs it to work
2. **Keep both terminals open** - Don't close them while using the app
3. **Check terminal for errors** - If something doesn't work, check the terminal output
4. **Use two terminal windows** - One for backend, one for frontend

---

## 🆘 Still Having Issues?

1. Check Node.js version: `node --version` (should be v16+)
2. Check npm version: `npm --version`
3. Delete `node_modules` and run `npm install` again
4. Check that ports 3001 and 8080 are not blocked by firewall
5. Make sure you're in the correct directory when running commands

---

**Need more help?** Check `SETUP.md` for detailed setup instructions.

