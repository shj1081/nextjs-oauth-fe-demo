'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useState } from 'react';

/**
 * User data interface based on backend response from /api/v1/user/me
 */
interface UserData {
    email: string;
    [key: string]: unknown;
}

/**
 * For-user data interface based on backend response from /api/v1/user/for-user
 */
interface ForUserData {
    message: string;
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
    const [forUserData, setForUserData] = useState<ForUserData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isForUserLoading, setIsForUserLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [forUserError, setForUserError] = useState<string | null>(null);

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
     * Fetch for-user data from the backend API
     */
    const handleFetchForUserData = async () => {
        setIsForUserLoading(true);
        setForUserError(null);
        try {
            const response = await fetchWithToken(
                'http://localhost:8080/api/v1/user/for-user'
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();
            setForUserData(data);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Unknown error occurred';
            setForUserError(errorMessage);
        } finally {
            setIsForUserLoading(false);
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
                        flexWrap: 'wrap',
                    }}
                >
                    <button
                        onClick={handleFetchData}
                        className="button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Fetch User Data'}
                    </button>
                    <button
                        onClick={handleFetchForUserData}
                        className="button"
                        disabled={isForUserLoading}
                    >
                        {isForUserLoading
                            ? 'Loading...'
                            : 'Fetch For-User Data'}
                    </button>
                    <button onClick={logout} className="button button-logout">
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="result-box error-box">
                        <h3>User Data Error:</h3>
                        <pre>{error}</pre>
                    </div>
                )}
                {userData && (
                    <div className="result-box">
                        <h3>User Data (/api/v1/user/me):</h3>
                        <pre>{JSON.stringify(userData, null, 2)}</pre>
                    </div>
                )}

                {forUserError && (
                    <div className="result-box error-box">
                        <h3>For-User Data Error:</h3>
                        <pre>{forUserError}</pre>
                    </div>
                )}
                {forUserData && (
                    <div className="result-box">
                        <h3>For-User Data (/api/v1/user/for-user):</h3>
                        <pre>{JSON.stringify(forUserData, null, 2)}</pre>
                    </div>
                )}
            </div>
        </main>
    );
}
