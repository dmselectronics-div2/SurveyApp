# Authentication Documentation

This document provides a comprehensive overview of the authentication system in the SurveyApp project, covering both the React Native frontend and the Node.js backend.

## 1. Overview

The application implements a robust authentication system that includes:
- **Multi-method Login**: Email/Password, Google Sign-In, PIN, and Biometric (Fingerprint) authentication.
- **Registration Flow**: Detailed user profile creation (Role, Survey Types, Research Areas), Email Verification, and Admin Approval.
- **Security**: Password hashing (bcrypt), JWT tokens, and secure credential storage (Keychain).
- **Recovery**: Password reset functionality via email verification.

## 2. Backend Architecture

### Key Files
- `SurveyAppBackend/routes/auth.js`: Defines all authentication API endpoints.
- `SurveyAppBackend/controllers/authController.js`: Contains the business logic for authentication.
- `SurveyAppBackend/models/User.js`: Mongoose model for User data.

### API Endpoints
| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/registering` | Registers a new user with email and password. |
| POST | `/login` | Authenticates a user and returns a JWT token. |
| POST | `/google-register` | Handles Google Sign-In registration and login. |
| POST | `/send-confirmation-email` | Sends a 6-digit verification code to the user's email. |
| POST | `/email-validation` | Verifies the email confirmation code. |
| POST | `/send-password-reset-email` | Initiates the password reset flow. |
| POST | `/verify-reset-code` | Verifies the password reset code. |
| POST | `/update-password` | Updates the user's password after successful reset. |
| GET | `/get-user-validation` | Checks the admin approval status of a user. |
| POST | `/approve-user` | Admin endpoint to approve a pending user account. |
| POST | `/save-signup-details` | Saves additional user details (Role, Survey Types, etc.). |
| POST | `/save-pin` | Saves a 4-digit PIN for quick login. |

## 3. Frontend Architecture

### Key Components (`src/auth/`)
- **Login**: `login-page/login-page.tsx`, `login-page/SigninForm.tsx`, `login-page/LoginWelcome.tsx`
- **Registration**: `register-page/register-page.tsx`, `register-page/veryfy-email.tsx`
- **Profile Setup**: `register-page/SignupRoleSelection.tsx`, `register-page/SignupSurveyType.tsx`, `register-page/SignupResearchAreas.tsx`, `register-page/SignupPeriodicalCategories.tsx`
- **Security Setup**: `register-page/pin-password.tsx` (Set PIN), `register-page/verify-fingerprint.tsx`
- **Recovery**: `login-page/forgot-pasword.tsx`, `login-page/reset-password.tsx`
- **Admin Check**: `register-page/get-verification-admin.tsx`

### Navigation
The authentication screens are managed by the `Stack.Navigator` in `App.tsx`. The initial route is determined by checking if secure credentials exist in the Keychain.

## 4. Authentication Flows

### A. Registration (Email/Password)
1.  **User Input**: User enters email and password in `RegisterPage`.
2.  **Backend Call**: POST `/registering` creates a user record (hashed password).
3.  **Verification**:
    - Backend sends a verification code via email (`/send-confirmation-email`).
    - User enters code in `VerifyEmail` screen.
    - POST `/email-validation` confirms the email.
4.  **Profile Setup**: User navigates through Role, Survey Type, and Research Area selection screens.
5.  **Admin Approval**: User waits in `GetAdminApprove` screen while the app polls `/get-user-validation`. Once approved (`isApproved: true`), the user can proceed.
6.  **Security Setup**: User sets a PIN and optionally enables Biometrics (`SetPin`).

### B. Google Sign-In
1.  **Trigger**: User clicks "Continue with Google" in `LoginWelcome` or `SigninForm`.
2.  **Frontend**: `GoogleSignin.signIn()` retrieves the user's Google profile and ID token.
3.  **Backend**: POST `/google-register` checks if the user exists.
    - If new: Creates a user entry with `isGoogleLogin: true` and sends a welcome email.
    - If existing: Logs the user in.
4.  **Flow**: New users are redirected to the Profile Setup flow similarly to email registrants.

### C. Login
1.  **Input**: User enters credentials.
2.  **Backend Call**: POST `/login`.
3.  **Checks**:
    - User existence.
    - Account deletion status (`isDeleted`).
    - Password match (bcrypt).
    - Email confirmation (`emailConfirmed`).
    - Admin approval (`isApproved`).
4.  **Success**: Returns JWT token and user info. Token is stored securely using `react-native-keychain`.

### D. Password Reset
1.  **Request**: User requests reset in `ForgetPasswordPage`.
2.  **Backend**: POST `/send-password-reset-email` generates and sends a code.
3.  **Verification**: User enters code; backend verifies it via `/verify-reset-code`.
4.  **Reset**: User sets new password; backend updates it via `/update-password`.

## 5. Security Measures

- **Password Hashing**: Passwords are never stored in plain text. `bcryptjs` is used for hashing with a salt round of 10.
- **JWT Tokens**: Authentication state is maintained using JSON Web Tokens (JWT).
- **Secure Storage**: Sensitive data (tokens, credentials) on the device is stored using `react-native-keychain`.
- **Admin Approval**: A strict manual approval process prevents unauthorized access even after email verification.
- **Code Expiration**: Verification codes expire after 30 minutes.

## 6. Configuration

The backend relies on the following environment variables (in `.env`):
- `EMAIL_USER`: Email address for sending notifications.
- `EMAIL_PASS`: App-specific password for the email account.
- `GOOGLE_POFILE_CLIENT_ID`: Google Client ID for backend verification (if implemented).
- `MONGO_URI` (deduced): Database connection string.
- `JWT_SECRET` (deduced): Secret key for signing JWT tokens.
