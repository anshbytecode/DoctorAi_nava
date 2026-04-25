# Netlify Deployment Guide for DoctorAI

This guide will help you deploy DoctorAI frontend to Netlify with proper backend connection.

## Prerequisites

- Backend deployed on Render: `https://doctorai-adv-anshul-1.onrender.com`
- Netlify account
- GitHub repository (optional, but recommended)

## Quick Deploy Steps

### Option 1: Deploy via Netlify Dashboard

1. **Go to Netlify Dashboard**
   - Visit [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"

2. **Connect Repository** (if using Git)
   - Connect your GitHub/GitLab/Bitbucket repository
   - Or drag and drop the `dist` folder after building locally

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: Leave empty (or `doctor-ai-anshul` if deploying from root)

4. **Environment Variables** (Optional)
   - Go to Site settings → Environment variables
   - Add if needed:
     ```
     VITE_API_URL=https://doctorai-adv-anshul-1.onrender.com/api
     ```
   - **Note**: The app will automatically use the Render backend URL in production, so this is optional.

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod
```

## Configuration Files

The following files are already configured:

- ✅ `netlify.toml` - Build configuration
- ✅ `public/_redirects` - SPA routing support
- ✅ `src/lib/api.ts` - Auto-detects production and uses Render backend

## How It Works

### Automatic Backend Detection

The app automatically detects the environment:

- **Development** (`npm run dev`): Uses `http://localhost:3001/api`
- **Production** (deployed): Uses `https://doctorai-adv-anshul-1.onrender.com/api`

### Manual Override

If you want to override the backend URL, set the environment variable in Netlify:

1. Go to Site settings → Environment variables
2. Add: `VITE_API_URL` = `https://your-backend-url.com/api`

## Testing After Deployment

1. Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
2. Navigate to `/login` or `/signup`
3. Try creating an account or logging in
4. Check browser console for any errors

## Troubleshooting

### "Failed to fetch" Error

**Possible causes:**
1. Backend is not running on Render
   - Check Render dashboard to ensure backend is active
   - Render free tier spins down after inactivity

2. CORS issues
   - Backend CORS is configured to allow all origins
   - Check `backend/server.js` CORS settings

3. Network connectivity
   - Check browser console for specific error messages
   - Verify backend URL is correct

### Routes Not Working

- Ensure `public/_redirects` file exists with: `/* /index.html 200`
- Or `netlify.toml` has the redirects configuration

### Build Fails

- Check Node.js version (should be 16+)
- Ensure all dependencies are installed
- Check build logs in Netlify dashboard

## Backend Status Check

You can check if the backend is running by visiting:
```
https://doctorai-adv-anshul-1.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | Auto-detected (localhost in dev, Render in prod) |

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Netlify build logs
3. Verify backend is running on Render
4. Check network tab in browser DevTools

