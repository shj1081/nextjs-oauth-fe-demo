'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Home page component
 * Displays login interface for unauthenticated users
 * Redirects authenticated users to their profile page
 */
export default function Home() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    /**
     * GitHub OAuth login URL
     */
    const GITHUB_LOGIN_URL =
        'http://localhost:8080/oauth2/authorization/github';

    /**
     * Redirect authenticated users to profile page
     */
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace('/my-page');
        }
    }, [isLoading, isAuthenticated, router]);

    /**
     * Show loading state while checking authentication
     */
    if (isLoading || isAuthenticated) {
        return (
            <main>
                <div className="container">
                    <h1>Loading...</h1>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="container">
                <h1>Spring Boot & Next.js OAuth2</h1>
                <p>A complete authentication architecture example.</p>
                <Link href={GITHUB_LOGIN_URL} className="button">
                    Login with GitHub
                </Link>
            </div>
        </main>
    );
}
