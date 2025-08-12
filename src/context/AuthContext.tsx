'use client';

import * as authService from '@/services/authService';
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

/**
 * In-memory access token storage
 * This prevents XSS attacks by not storing sensitive data in localStorage/sessionStorage
 */
let inMemoryAccessToken: string | null = null;

/**
 * Authentication context type definition
 */
interface AuthContextType {
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (code: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchWithToken: (url: string, options?: RequestInit) => Promise<Response>;
}

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to use authentication context
 * @throws {Error} When used outside of AuthProvider
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * Authentication provider component
 * Manages user authentication state and provides auth-related functions
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Handles token refresh when access token expires
     * @returns {Promise<string | null>} New access token or null if refresh fails
     */
    const handleTokenRefresh = useCallback(async () => {
        try {
            const data = await authService.refreshTokenAPI();
            setAccessToken(data.accessToken);
            inMemoryAccessToken = data.accessToken;
            return data.accessToken;
        } catch {
            await logout();
            return null;
        }
    }, []);

    /**
     * Logs out the user and cleans up authentication state
     */
    const logout = async () => {
        try {
            await authService.logoutAPI();
        } catch {
            // Logout API failure is not critical, continue with cleanup
        } finally {
            setAccessToken(null);
            inMemoryAccessToken = null;
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }
    };

    /**
     * Wrapper function for authenticated API calls
     * Automatically handles token refresh on 401 errors
     * @param {string} url - API endpoint URL
     * @param {RequestInit} options - Fetch options
     * @returns {Promise<Response>} Fetch response
     */
    const fetchWithToken = useCallback(
        async (url: string, options: RequestInit = {}) => {
            if (!inMemoryAccessToken) {
                throw new Error('No access token available.');
            }

            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${inMemoryAccessToken}`,
                },
            });

            if (response.status === 401) {
                const newAccessToken = await handleTokenRefresh();
                if (newAccessToken) {
                    return fetch(url, {
                        ...options,
                        headers: {
                            ...options.headers,
                            Authorization: `Bearer ${newAccessToken}`,
                        },
                    });
                }
            }
            return response;
        },
        [handleTokenRefresh]
    );

    /**
     * Initialize authentication on app start
     * Attempts silent refresh to restore user session
     */
    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);
            try {
                const data = await authService.refreshTokenAPI();
                setAccessToken(data.accessToken);
                inMemoryAccessToken = data.accessToken;
            } catch {
                setAccessToken(null);
                inMemoryAccessToken = null;
            } finally {
                setIsLoading(false);
            }
        };
        initializeAuth();
    }, []);

    /**
     * Handles user login with authorization code
     * @param {string} code - Authorization code from OAuth provider
     */
    const login = async (code: string) => {
        setIsLoading(true);
        try {
            const data = await authService.exchangeCodeForToken(code);
            setAccessToken(data.accessToken);
            inMemoryAccessToken = data.accessToken;
        } catch {
            setAccessToken(null);
            inMemoryAccessToken = null;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        accessToken,
        isAuthenticated: !!accessToken,
        isLoading,
        login,
        logout,
        fetchWithToken,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
