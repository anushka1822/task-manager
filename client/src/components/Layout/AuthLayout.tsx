import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AuthLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-xl">
                <Outlet />
            </div>
        </div>
    );
}
