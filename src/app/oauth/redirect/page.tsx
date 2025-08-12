'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

/**
 * OAuth redirect callback component
 * Handles the authorization code from OAuth provider and completes login process
 */
function OAuthRedirectContent() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

    /**
     * Process OAuth callback and complete login
     */
    useEffect(() => {
        const code = searchParams.get('code');

        if (code && isProcessing) {
            setIsProcessing(false); // Prevent duplicate execution
            login(code)
                .then(() => {
                    router.replace('/');
                })
                .catch((err) => {
                    const errorMessage =
                        err instanceof Error
                            ? err.message
                            : 'Login process failed.';
                    setError(errorMessage);
                });
        } else if (!code) {
            setError('Authorization code not found.');
            setIsProcessing(false);
        }
    }, [login, router, searchParams, isProcessing]);

    return (
        <main>
            <div className="container">
                {error ? (
                    <>
                        <h1>Login Failed</h1>
                        <p className="error-box">{error}</p>
                        <Link href="/" className="button">
                            Go to Home
                        </Link>
                    </>
                ) : (
                    <h1>Processing login...</h1>
                )}
            </div>
        </main>
    );
}

/**
 * OAuth redirect callback page with Suspense boundary
 */
export default function OAuthRedirectPage() {
    return (
        <Suspense
            fallback={
                <main>
                    <div className="container">
                        <h1>Loading...</h1>
                    </div>
                </main>
            }
        >
            <OAuthRedirectContent />
        </Suspense>
    );
}
