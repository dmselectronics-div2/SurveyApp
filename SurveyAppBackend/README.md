# SurveyApp Backend API

Backend API for SurveyApp - A comprehensive survey and observation application with support for Bird, Citizen, and Mangrove modules.

## Architecture

This backend follows the **MVC (Model-View-Controller)** architecture pattern:

```
SurveyAppBackend/
├── config/              # Configuration files
│   ├── api.js          # API configuration
│   └── db.js           # Database connection
├── middleware/         # Custom middleware
│   ├── errorHandler.js # Global error handling
│   ├── notFound.js     # 404 handler
│   └── requestLogger.js # Request logging
├── controllers/        # Business logic
│   ├── authController.js
│   ├── birdController.js
│   ├── citizenController.js
│   ├── BivalviController.js
│   └── uploadController.js
├── models/            # MongoDB schemas
│   ├── User.js
│   ├── BirdSurvey.js
│   ├── CitizenForm.js
│   ├── BivalviSurvey.js
│   └── [other models]
├── routes/            # API endpoints
│   ├── auth.js
│   ├── bird.js
│   ├── citizen.js
│   ├── Bivalvi.js
│   ├── upload.js
│   └── index.js (central router)
├── utils/             # Utility functions
├── uploads/           # Uploaded files storage
├── server.js          # Express app entry point
├── package.json
└── .env.example
```

## API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Health Check
```
GET /health
```

### Authentication Routes (`/api/v1/auth`)
- `POST /registering` - Register new user
- `POST /login` - User login
- `POST /google-register` - Google authentication
- `POST /profile` - Update profile
- `GET /profile` - Get user profile

### Bird Module Routes (`/api/v1/bird`)
- `POST /form-entry` - Submit bird survey
- `GET /form-entries` - Get all bird surveys
- `GET /form-entry/:id` - Get specific bird survey
- `PUT /form-entry/:id` - Update bird survey
- `DELETE /form-entry/:id` - Delete bird survey
- `GET /bird-species` - Get bird species data
- `GET /bird-stats` - Get bird statistics

### Citizen Module Routes (`/api/v1/citizen`)
- `POST /plants` - Create plant observation
- `GET /plants` - Get all plants
- `POST /animals` - Create animal observation
- `POST /nature` - Create nature observation
- `POST /human-activity` - Create human activity record

### Mangrove Module Routes (`/api/v1/mangrove`)
- `POST /submit-bivalvi-form` - Submit survey
- `GET /bivalvi-form-entries` - Get all surveys
- `GET /bivalvi-form-entry/:id` - Get specific survey

### Upload Routes (`/api/v1/upload`)
- `POST /upload-profile-image` - Upload profile image
- `POST /upload` - Upload general image
- `POST /upload-base64` - Upload base64 encoded image
- `DELETE /upload/:type/:filename` - Delete file

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/surveyapp
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/surveyapp

# Server
PORT=5000
NODE_ENV=development

# Email (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# API
API_KEY=your-api-key
CORS_ORIGIN=*
```

### 3. Setup MongoDB

**Local MongoDB:**
```bash
# Start MongoDB service
```

**MongoDB Atlas:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create cluster and get connection string
3. Whitelist your IP address

### 4. Run Development Server
```bash
npm run dev
```

Server will start at: `http://localhost:5000`

## Response Format

All endpoints return standardized JSON:

### Success
```json
{
  "status": "ok",
  "message": "Success",
  "data": {}
}
```

### Error
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Directory Structure

- **config/** - Configuration (API, Database)
- **middleware/** - Custom middleware (error handling, logging)
- **controllers/** - Business logic for each module
- **models/** - MongoDB schemas
- **routes/** - API route definitions
- **utils/** - Helper functions
- **uploads/** - Uploaded files storage
- **server.js** - Express application entry point
- **db.js** - Database configuration

## Security

1. Store sensitive data in `.env` (never commit it)
2. Use strong MongoDB passwords
3. Configure CORS properly
4. Validate and sanitize inputs
5. Use HTTPS in production

## Troubleshooting

**MongoDB Connection Error:**
- Check if MongoDB is running
- Verify MONGODB_URI
- For Atlas, whitelist your IP

**Port Already in Use:**
```bash
PORT=5001 npm run dev
```

**CORS Issues:**
- Update CORS_ORIGIN in .env
- Use `*` for development

## License

All rights reserved