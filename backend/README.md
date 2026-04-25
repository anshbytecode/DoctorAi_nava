# DoctorAI Backend

Backend server for the DoctorAI application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory:

```
JWT_SECRET=your-secret-key-here
PORT=3001
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/me` - Get current user (requires authentication)

### Health Check

- `GET /api/health` - Check server status

## Data Storage

User data is stored in `data/users.json` (created automatically on first run).

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Change the JWT_SECRET in production!

