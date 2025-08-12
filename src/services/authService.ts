/**
 * Authentication service for OAuth2 integration
 * Handles token exchange, refresh, logout, and user data fetching
 */

/**
 * Base URL for the authentication API
 */
const API_BASE_URL = 'http://localhost:8080';

/**
 * Response type for token-related API calls
 */
interface TokenResponse {
    accessToken: string;
}

/**
 * Exchange authorization code for access token
 * @param {string} code - Authorization code from OAuth provider
 * @returns {Promise<TokenResponse>} Access token response
 * @throws {Error} When token exchange fails
 */
export const exchangeCodeForToken = async (
    code: string
): Promise<TokenResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
        credentials: 'include', // Required for HttpOnly cookies
    });
    if (!response.ok) {
        throw new Error('Token exchange failed.');
    }
    return response.json();
};

/**
 * Refresh access token using HttpOnly refresh token
 * @returns {Promise<TokenResponse>} New access token response
 * @throws {Error} When token refresh fails
 */
export const refreshTokenAPI = async (): Promise<TokenResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Required for HttpOnly cookies
    });
    if (!response.ok) {
        throw new Error('Token refresh failed.');
    }
    return response.json();
};

/**
 * Logout user and invalidate tokens
 * @throws {Error} When logout API call fails
 */
export const logoutAPI = async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Logout failed.');
    }
};
