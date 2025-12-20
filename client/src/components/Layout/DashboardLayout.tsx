import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import { LogOut, LayoutDashboard } from 'lucide-react';

export default function DashboardLayout() {
    const { isAuthenticated, isLoading, logout, user } = useAuth();
    useSocket(); // Initialize socket connection
    const navigate = useNavigate();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <div className="bg-indigo-600 p-2 rounded-lg">
                                    <LayoutDashboard className="h-6 w-6 text-white" />
                                </div>
                                <span className="font-bold text-xl text-gray-900">TaskFlow</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="/profile" className="text-sm text-gray-700 font-medium hover:text-indigo-600 transition-colors">
                                Hello, {user?.name}
                            </a>
                            <button
                                onClick={() => {
                                    logout();
                                    navigate('/login');
                                }}
                                className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
}
