# SurveyApp Backend - MVC Architecture Setup Guide

## What Was Done

The backend has been reorganized with proper **MVC (Model-View-Controller)** architecture:

### ✅ Completed Setup

1. **API Versioning & Routing**
   - All routes now use `/api/v1/` prefix for versioning
   - Consistent route namespacing:
     - `/api/v1/auth` - Authentication
     - `/api/v1/bird` - Bird module
     - `/api/v1/citizen` - Citizen module
     - `/api/v1/mangrove` - Mangrove module
     - `/api/v1/citizen-form` - Citizen forms
     - `/api/v1/upload` - File uploads

2. **Middleware Structure** (`/middleware`)
   - `errorHandler.js` - Global error handling
   - `notFound.js` - 404 handler
   - `requestLogger.js` - Request logging
   - Integrated into `server.js` for proper error handling

3. **Utility Functions** (`/utils`)
   - `responseHandler.js` - Standardized API responses
   - Helper functions for success/error/paginated responses

4. **Configuration Files**
   - `server.js` - Enhanced with middleware and error handling
   - `config/api.js` - Extended with comprehensive settings
   - `config/db.js` - Database configuration (kept as intended)
   - `.env.example` - Environment variables template

5. **Documentation**
   - Comprehensive `README.md` with full API documentation
   - `BACKEND_SETUP.md` - This setup guide

## Backend Server Status

✅ **Server starts successfully on `http://localhost:5000`**

### Server Configuration
- Port: 5000
- Environment: development (set in .env)
- API Base: `http://localhost:5000/api/v1`
- Health Check: `http://localhost:5000/health`

## Quick Start

### 1. Configure Environment
```bash
cd SurveyAppBackend
cp .env.example .env
```

Edit `.env` with your settings:

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/surveyapp
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/surveyapp?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

### 4. Verify Server
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "SurveyApp Backend is running"
}
```

## API Route Examples

### Test Authentication
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Upload
```bash
curl -X POST http://localhost:5000/api/v1/upload/upload \
  -F "image=@/path/to/image.jpg" \
  -F "type=bird"
```

### Test Bird Survey
```bash
curl -X POST http://localhost:5000/api/v1/bird/form-entry \
  -H "Content-Type: application/json" \
  -d '{"speciesName":"Sparrow","count":5,"habitat":"Urban"}'
```

## Database Setup

### MongoDB Local Setup (Windows)

1. **Download MongoDB Community Edition:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows MSI
   - Run installer

2. **Start MongoDB Service:**
   ```bash
   net start MongoDB
   ```

3. **Verify Connection:**
   ```bash
   mongosh
   ```

### MongoDB Atlas Setup (Cloud)

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up

2. **Create Cluster:**
   - Click "Create" → Choose free tier
   - Select region close to your location
   - Create cluster

3. **Get Connection String:**
   - Go to Clusters → Connect
   - Choose "Drivers"
   - Copy connection string

4. **Setup Network Access:**
   - Go to Network Access
   - Add IP Address
   - For development: Add 0.0.0.0/0 (allows all IPs)
   - For production: Add specific IP

5. **Add to `.env`:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/surveyapp?retryWrites=true&w=majority
   ```

## MVC Architecture Explained

### Models (`/models`)
- Define database schemas
- Handle data validation
- Examples: User.js, BirdSurvey.js, CitizenForm.js

### Views/Routes (`/routes`)
- Define API endpoints
- Map requests to controller functions
- Organized by feature: auth.js, bird.js, citizen.js

### Controllers (`/controllers`)
- Contains business logic
- Handles requests and responses
- Examples: authController.js, birdController.js

### Supporting Files
- **Middleware** (`/middleware`) - Cross-cutting concerns
- **Config** (`/config`) - Database and API configuration
- **Utils** (`/utils`) - Helper functions
- **Server** (`server.js`) - Express app setup

## Common Issues & Solutions

### MongoDB Connection Error
```
MongoDB Connection Error: querySrv ENOTFOUND
```
**Solution:**
- Check internet connection
- Verify MONGODB_URI in .env
- For Atlas: Whitelist your IP in Network Access

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Kill process on port 5000 or use different port
PORT=5001 npm run dev
```

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
npm install
```

### Email Sending Issues
```
Authentication failed: Invalid login or password
```
**Solution:**
- For Gmail: Use App Passwords (not regular password)
- Generate: https://myaccount.google.com/apppasswords
- Add to EMAIL_PASS in .env

## File Structure Summary

```
SurveyAppBackend/
├── config/
│   ├── api.js                 ← API configuration
│   └── db.js                  ← MongoDB connection
├── middleware/                ← NEW: Custom middleware
│   ├── errorHandler.js
│   ├── notFound.js
│   ├── requestLogger.js
│   └── index.js
├── controllers/
│   ├── authController.js
│   ├── birdController.js
│   ├── citizenController.js
│   └── [other controllers]
├── models/
│   ├── User.js
│   ├── BirdSurvey.js
│   └── [other models]
├── routes/
│   ├── index.js               ← UPDATED: Central router with /api/v1
│   ├── auth.js
│   ├── bird.js
│   └── [other routes]
├── utils/                     ← NEW: Utility functions
│   └── responseHandler.js
├── uploads/                   ← User uploads storage
├── server.js                  ← UPDATED: With middleware
├── package.json
├── .env.example               ← NEW: Environment template
├── README.md                  ← UPDATED: Full documentation
└── BACKEND_SETUP.md           ← This file
```

## Deployment Checklist

- [ ] Create `.env` file with valid production values
- [ ] Set `NODE_ENV=production` in .env
- [ ] MongoDB Atlas cluster configured and whitelist production IP
- [ ] CORS_ORIGIN set to your frontend domain
- [ ] Email credentials configured (if needed)
- [ ] Test all API endpoints
- [ ] Monitor server logs

## Testing API Endpoints

Use Postman or any REST client:

1. **Import Collection:** Use the API endpoints from README.md
2. **Set Base URL:** `http://localhost:5000/api/v1`
3. **Test Routes:** Start with health check `/health`

## Next Steps

1. ✅ Backend is properly structured with MVC architecture
2. ✅ All routes are under `/api/v1` namespace
3. ✅ Middleware for error handling is in place
4. ✅ `server.js` and `db.js` are kept as specified

**What to do now:**
1. Set up `.env` file with MongoDB URI
2. Run `npm install` to ensure all dependencies
3. Start server with `npm run dev`
4. Test endpoints with Postman or curl
5. Update frontend API calls to use new `/api/v1` prefix

## Support

For any issues:
1. Check `.env` configuration
2. Review error messages in console
3. Check MongoDB connection status
4. Verify network connectivity
5. Review README.md for endpoint details
