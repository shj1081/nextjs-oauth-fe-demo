# Next.js OAuth2 Authentication Client

A complete OAuth2 authentication client built with Next.js and TypeScript, designed to work with a Spring Boot backend.

## Features

- **Secure OAuth2 Flow**: Complete OAuth2 implementation with GitHub as the provider
- **Token Management**: Automatic token refresh with HttpOnly cookies for security
- **Protected Routes**: Client-side route protection for authenticated users
- **Error Handling**: Comprehensive error handling and user feedback
- **TypeScript**: Full TypeScript support for type safety
- **Modern React**: Uses React 18+ features and hooks

## Architecture

- **Frontend**: Next.js 14+ with App Router
- **Authentication**: OAuth2 with GitHub
- **State Management**: React Context API
- **Security**: Access tokens in memory, refresh tokens in HttpOnly cookies
- **Backend**: Designed to work with Spring Boot OAuth2 server

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- A running Spring Boot OAuth2 server (typically on `http://localhost:8080`)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Home page with login
│   ├── my-page/           # Protected user profile page
│   └── oauth/redirect/    # OAuth callback handler
├── context/
│   └── AuthContext.tsx    # Authentication context and provider
└── services/
    └── authService.ts     # API service functions
```

## Key Components

### AuthContext

- Manages authentication state
- Handles token refresh automatically
- Provides `fetchWithToken` for authenticated API calls

### Protected Routes

- Automatic redirection for unauthenticated users
- Loading states during authentication checks

### Token Security

- Access tokens stored in memory (prevents XSS)
- Refresh tokens in HttpOnly cookies (prevents CSRF)
- Automatic token refresh on 401 responses

## API Endpoints

The client expects these endpoints on the backend:

- `GET /oauth2/authorization/github` - Initiate OAuth2 flow
- `POST /api/v1/auth/token` - Exchange authorization code for tokens
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout and invalidate tokens
- `GET /api/v1/user/me` - Get user profile (protected)

## Configuration

Update the API base URL in `src/services/authService.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8080';
```

## Security Features

- **XSS Protection**: No sensitive data in localStorage/sessionStorage
- **CSRF Protection**: HttpOnly cookies for refresh tokens
- **Automatic Cleanup**: Tokens cleared on logout or session expiry
- **Route Protection**: Client-side route guards

## Development

The project uses TypeScript for type safety and includes comprehensive error handling. All components are documented with JSDoc comments.

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Follow the existing code style
2. Add proper TypeScript types
3. Include JSDoc comments for functions
4. Test authentication flows thoroughly

## License

This project is open source and available under the MIT License.
