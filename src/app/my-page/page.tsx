'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useState } from 'react';

/**
 * User data interface based on backend response
 */
interface UserData {
    email: string;
    [key: string]: unknown;
}

/**
 * Protected user profile page
 * Only accessible to authenticated users
 */
export default function MyPage() {
    const {
        isAuthenticated,
        isLoading: isAuthLoading,
        logout,
        fetchWithToken,
    } = useAuth();

    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch user data from the backend API
     */
    const handleFetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchWithToken(
                'http://localhost:8080/api/v1/user/me'
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();
            setUserData(data);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Show loading state while checking authentication
     */
    if (isAuthLoading) {
        return (
            <main>
                <div className="container">
                    <h1>Verifying authentication...</h1>
                </div>
            </main>
        );
    }

    /**
     * Show access denied for unauthenticated users
     */
    if (!isAuthenticated) {
        return (
            <main>
                <div className="container">
                    <h1>Access Denied</h1>
                    <p>This page requires authentication.</p>
                    <Link href="/" className="button">
                        Go to Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="container">
                <h1>My Profile</h1>
                <p>This page is only accessible to authenticated users.</p>
                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                    }}
                >
                    <button
                        onClick={handleFetchData}
                        className="button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Fetch User Data'}
                    </button>
                    <button onClick={logout} className="button button-logout">
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="result-box error-box">
                        <pre>{error}</pre>
                    </div>
                )}
                {userData && (
                    <div className="result-box">
                        <pre>{JSON.stringify(userData, null, 2)}</pre>
                    </div>
                )}
            </div>
        </main>
    );
}
