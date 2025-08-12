import { AuthProvider } from '@/context/AuthContext';
import type { Metadata } from 'next';
import './globals.css';

/**
 * Metadata for the application
 */
export const metadata: Metadata = {
    title: 'OAuth2 Authentication Demo',
    description: 'Next.js OAuth2 authentication with Spring Boot backend',
};

/**
 * Root layout component
 * Wraps the entire application with authentication context
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
