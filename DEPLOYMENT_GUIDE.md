# TeyzixMarketplace - Vercel Deployment Guide

## Overview
This guide will help you deploy your MERN marketplace application. Since your app uses Socket.io for real-time messaging, we'll use a hybrid deployment approach:
- **Frontend**: Vercel (React app)
- **Backend**: Render or Railway (Node.js + Socket.io)
- **Database**: MongoDB Atlas

## Prerequisites
- GitHub account with your code pushed
- Vercel account (free tier)
- Render/Railway account (free tier)
- MongoDB Atlas account (free tier)

---

## Step 1: Prepare Your Project

### 1.1 Update Frontend Environment Variables
Create `.env.production` in the frontend directory:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### 1.2 Update API Calls in Frontend
Replace all `http://localhost:5000` with `import.meta.env.VITE_API_URL` in your React components.

**Example in ServiceDetails.jsx:**
```javascript
// Before
await axios.post('http://localhost:5000/api/messages/send', {...})

// After
await axios.post(`${import.meta.env.VITE_API_URL}/api/messages/send`, {...})
```

### 1.3 Update Socket.io Connection in Inbox.jsx
```javascript
// Before
const newSocket = io('http://localhost:5000');

// After
const newSocket = io(import.meta.env.VITE_API_URL);
```

### 1.4 Update Backend CORS
In `server.js`, update CORS to allow your Vercel domain:

```javascript
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});
```

---

## Step 2: Setup MongoDB Atlas

### 2.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create a new cluster (free tier M0)

### 2.2 Get Connection String
1. Click "Connect" → "Connect your application"
2. Copy the connection string
3. Replace `<password>` with your database password

**Example:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 2.3 Whitelist IP Addresses
- In Network Access, add `0.0.0.0/0` to allow all IPs (for development)
- For production, add specific IP addresses

---

## Step 3: Deploy Backend on Render

### 3.1 Prepare Backend for Production
Create `.env` file in server directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=https://your-vercel-app.vercel.app
PORT=5000
```

### 3.2 Update server.js for Production
Add this to handle Render's port:

```javascript
const PORT = process.env.PORT || 5000;
```

### 3.3 Push Code to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3.4 Deploy on Render
1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: teyzix-backend
   - **Branch**: main
   - **Root Directory**: server
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add environment variables from Step 3.2
6. Click "Deploy Web Service"

### 3.5 Get Backend URL
After deployment, Render will provide a URL like:
```
https://teyzix-backend.onrender.com
```

---

## Step 4: Deploy Frontend on Vercel

### 4.1 Prepare Frontend for Vercel
Create `vercel.json` in client directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 4.2 Update package.json Scripts
Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 4.3 Deploy on Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: client/My-Markrtplace
   - **Environment Variables**:
     - `VITE_API_URL`: https://teyzix-backend.onrender.com
5. Click "Deploy"

### 4.6 Get Frontend URL
After deployment, Vercel will provide a URL like:
```
https://teyzix-market.vercel.app
```

---

## Step 5: Update Backend Environment Variables

Go back to Render and update:
- `CLIENT_URL`: https://teyzix-market.vercel.app

This ensures CORS allows requests from your Vercel frontend.

---

## Step 6: Test the Deployment

### 6.1 Test Backend
```bash
curl https://teyzix-backend.onrender.com/api/services
```

### 6.2 Test Frontend
- Open your Vercel URL in browser
- Test all features:
  - User registration/login
  - Service browsing
  - Order placement
  - Real-time messaging

---

## Step 7: Configure File Uploads (Optional)

If you have file uploads, you'll need a cloud storage solution:

### Option 1: Cloudinary (Recommended)
1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get API credentials
3. Install in backend: `npm install cloudinary multer-storage-cloudinary`
4. Update upload middleware to use Cloudinary

### Option 2: Keep Local Uploads (Not Recommended for Production)
- Local uploads won't persist on Render
- Use only for development

---

## Troubleshooting

### Socket.io Connection Issues
- Ensure backend is deployed on a platform that supports WebSockets (Render does)
- Check CORS settings in server.js
- Verify frontend is connecting to correct backend URL

### MongoDB Connection Issues
- Check IP whitelist in MongoDB Atlas
- Verify connection string format
- Ensure database user has correct permissions

### Environment Variables Not Loading
- Double-check variable names match exactly
- Restart services after adding variables
- Use `process.env.VARIABLE_NAME` in backend code

### Build Failures
- Check build logs in Vercel/Render dashboards
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

---

## Cost Summary (Free Tier)

- **Vercel**: Free (frontend hosting)
- **Render**: Free (backend hosting - limited to 750 hours/month)
- **MongoDB Atlas**: Free (512MB storage)
- **Cloudinary**: Free (25GB storage/month)

---

## Alternative Deployment Options

### Option 2: Railway (Alternative to Render)
- Similar to Render
- Better for simple deployments
- Free tier available

### Option 3: Heroku (Paid)
- More reliable but no free tier
- Better for production apps

### Option 4: Vercel Serverless Functions
- Not recommended for Socket.io
- Better for REST APIs only

---

## Next Steps

1. **Add Error Handling**: Implement proper error boundaries
2. **Add Analytics**: Use Vercel Analytics or Google Analytics
3. **Add Monitoring**: Set up error tracking (Sentry)
4. **Add CI/CD**: Configure GitHub Actions for testing
5. **Add Domain**: Connect custom domain in Vercel settings

---

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Add rate limiting to API endpoints
- [ ] Implement input validation
- [ ] Add CORS restrictions
- [ ] Use environment variables for sensitive data
- [ ] Remove console.log statements in production
- [ ] Add helmet.js for security headers

---

## Support

If you encounter issues:
1. Check deployment logs in Vercel/Render dashboards
2. Verify environment variables are set correctly
3. Test API endpoints individually
4. Check MongoDB Atlas logs
5. Review CORS configuration

---

## Quick Reference URLs

- **Frontend**: https://teyzix-market.vercel.app
- **Backend**: https://teyzix-backend.onrender.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
