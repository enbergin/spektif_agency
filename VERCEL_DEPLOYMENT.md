# Vercel Deployment Guide for Spektif Agency

## 🚀 Fixed Issues

✅ **Routes manifest path issue** - Added proper `vercel.json` configuration for monorepo  
✅ **Hardcoded secrets** - Updated auth configuration to use environment variables  
✅ **NextAuth build errors** - Simplified route handler  
✅ **Monorepo support** - Configured Vercel to build from `apps/web` directory  

## 📝 Required Environment Variables

Set these in your Vercel dashboard under **Settings > Environment Variables**:

### Production (Required)
```bash
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters-long
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com/api
API_URL=https://your-backend-api-url.com/api
NODE_ENV=production
```

### Google OAuth (Optional)
```bash
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

## 🔧 Deployment Steps

1. **Push your changes** to GitHub (the fixes are already applied)

2. **Set environment variables** in Vercel dashboard:
   - Go to your project settings
   - Add the environment variables listed above
   - **CRITICAL**: Set `NEXTAUTH_SECRET` to a random 32+ character string

3. **Redeploy** your project:
   ```bash
   vercel --prod
   ```

## 📋 What Was Fixed

### 1. Created `vercel.json` 
```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "apps/web/$1"
    }
  ]
}
```

### 2. Updated Auth Configuration
- Replaced hardcoded secrets with environment variables
- Fixed Google OAuth to use env vars
- Simplified NextAuth route handler

### 3. Next.js Configuration
- Added `output: 'standalone'` for better Vercel deployment
- Maintained existing environment variable setup

## 🔐 Security Notes

- **Never commit** real secrets to Git
- Generate a **unique NEXTAUTH_SECRET** for production
- Use **real Google OAuth credentials** if enabling Google login
- Set up **proper API endpoints** for your backend

## 🌐 Backend Considerations

Your frontend currently tries to connect to `localhost:3001` API. For production:

1. **Deploy your NestJS backend** separately (Railway, Render, or another service)
2. **Update NEXT_PUBLIC_API_URL** to point to your production API
3. **Ensure CORS** is configured on your backend to allow requests from your Vercel domain

## ✅ Next Steps

1. Set environment variables in Vercel
2. Deploy and test
3. Configure your backend API deployment
4. Update API URLs to production endpoints

The main routes-manifest.json error should be resolved with the new `vercel.json` configuration!
