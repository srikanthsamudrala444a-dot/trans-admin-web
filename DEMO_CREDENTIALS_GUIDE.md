# Demo Credentials Implementation Guide

## Overview

The Angular Admin Dashboard now uses **local demo credentials** for authentication instead of making API calls. This allows the application to work offline and be deployed to static hosting without backend dependencies.

## Demo Credentials

### Login Credentials
- **Email**: `admin.cabservice.com`
- **Password**: `admin123`

These credentials are displayed directly on the login page for easy reference.

## Implementation Details

### Files Modified

#### 1. **src/app/core/services/login.service.ts**
- Replaced HTTP API calls with local credential validation
- Implements demo credential checking
- Returns mock user response with admin role
- Simulates 500ms API delay for realistic UX

```typescript
// Demo credentials validation
const DEMO_CREDENTIALS = {
  email: 'admin.cabservice.com',
  password: 'admin123',
  contactNumber: 'admin.cabservice.com',
  pin: 'admin123'
};

// Mock user response
const MOCK_USER_RESPONSE = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  refreshToken: 'refresh-token-mock',
  user: {
    id: '1',
    email: 'admin.cabservice.com',
    name: 'Admin User',
    role: 'ADMIN',
    phone: '9999999999'
  }
};
```

#### 2. **src/app/features/auth/login/login.component.ts**
- Updated to pass email as contactNumber
- Enhanced error handling
- Improved console logging for debugging
- Stores tokens in localStorage

#### 3. **src/app/features/auth/login/login.component.html**
- Demo credentials displayed in a hint box
- Pre-filled form fields with demo values

## How It Works

### Login Flow

1. **User Input**: User enters email and password
2. **Validation**: Service compares against demo credentials
3. **Success Path**:
   - Returns mock JWT tokens (access + refresh)
   - Stores tokens in localStorage
   - Navigates to dashboard
4. **Error Path**:
   - Returns error message
   - Shows "Invalid email or password"

### JWT Token Structure

The mock JWT token is base64-encoded and contains:
```json
{
  "sub": "admin",
  "role": "admin",
  "name": "Admin User"
}
```

**Note**: This is for demo purposes only. In production, implement proper JWT validation.

## Benefits

✅ **No Backend Required**
- Works offline
- Perfect for static site deployment
- No CORS issues
- No API rate limits

✅ **Fast Development**
- Instant login
- No network delays
- Easy to test
- No authentication server setup

✅ **Great for Demos**
- Pre-filled credentials
- Realistic 500ms delay
- Admin user by default
- Full dashboard access

## Transitioning to Real API

When you're ready to use a real backend API:

### Update login.service.ts

```typescript
login(credentials: { contactNumber: string; pin: string }): Observable<any> {
  // Make actual HTTP call
  return this.http.post<AuthResponse>(
    'https://your-api.com/auth/login',
    credentials
  ).pipe(
    map(response => {
      // Handle real API response
      return response;
    }),
    catchError(error => {
      // Handle real errors
      return throwError(() => error);
    })
  );
}
```

### Update Auth Guard

Ensure your auth guard validates real JWT tokens:

```typescript
// Validate token expiration
const isTokenValid = !this.jwtHelper.isTokenExpired(token);

// Decode and check claims
const decodedToken = this.jwtHelper.decodeToken(token);
const hasAdminRole = decodedToken.role === 'ADMIN';
```

## Testing

### Test Login Success
1. Open login page
2. Email: `admin.cabservice.com`
3. Password: `admin123`
4. Click "Sign In"
5. Should navigate to dashboard within 500ms

### Test Login Failure
1. Try any other email/password combination
2. Should show error: "Invalid email or password. Use admin.cabservice.com / admin123"

### Test Token Storage
1. Open browser DevTools → Application → Storage → localStorage
2. After login, should see:
   - `accessToken`: JWT token
   - `refreshToken`: Refresh token
   - `user`: User JSON object

## Security Notes

⚠️ **Important**: This is for **development and demo purposes only**.

- Demo credentials are hardcoded (not secure for production)
- JWT tokens are mock tokens (not cryptographically secure)
- No real authentication happens (anyone can login)
- All data is client-side (easily accessible in localStorage)

### For Production:

1. ✅ Implement real JWT validation on the backend
2. ✅ Use HTTPS for all authentication
3. ✅ Implement refresh token rotation
4. ✅ Add CORS protection
5. ✅ Use secure HTTP-only cookies for tokens
6. ✅ Implement rate limiting on login attempts
7. ✅ Add audit logging for authentication events

## Environment Variables

Currently, no environment variables are needed for demo credentials. 

For production, add environment-specific configuration:

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com',
  useRealAuth: true
};

// environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  useRealAuth: false  // Use demo credentials
};
```

## Build & Deployment

The demo credentials work seamlessly with:

- ✅ Development server (`npm start`)
- ✅ Production build (`npm run build`)
- ✅ Static site deployment (Render, Netlify, etc.)
- ✅ Docker containers
- ✅ Server-side rendering (with caveat that SSR is disabled)

## Console Logging

Check browser console for debugging:

```
Attempting login with credentials: {email: "admin.cabservice.com", password: "admin123"}
Login successful: {accessToken: "...", refreshToken: "...", user: {...}}
Token saved to localStorage
```

## FAQ

**Q: Can I change the demo credentials?**
A: Yes! Update `DEMO_CREDENTIALS` constant in `login.service.ts`

**Q: How do I add more demo users?**
A: Modify the credential validation logic in `login.service.ts`:
```typescript
const DEMO_USERS = [
  { email: 'admin.cabservice.com', password: 'admin123', role: 'ADMIN' },
  { email: 'user.cabservice.com', password: 'user123', role: 'USER' }
];
```

**Q: Will this work on Render?**
A: Yes! It's perfect for static site deployment since there are no backend API calls.

**Q: How do I test the application?**
A: Simply login with the demo credentials and navigate through the dashboard. All features should work as they're using mock data or localStorage.

**Q: Can I see what's stored in the browser?**
A: Yes! Open DevTools (F12) → Application → Storage → localStorage

---

**Status**: ✅ Ready for Demo and Development

The application is fully functional with demo credentials and ready for deployment to any static hosting platform.
