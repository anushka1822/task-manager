import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/axios';
import { type User } from '../types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    checkAuth: () => Promise<void>;
    updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            // Assuming GET /api/auth/me or similar exists, OR checking via a proteced route.
            // Based on routes I saw earlier, there isn't an explicit /me route. 
            // I generally recommend adding one, but for now I will rely on login response
            // or try to fetch user info if a token is essentially there.
            // Actually Task.txt says "Session Management... preferably using HttpOnly cookies".
            // If cookies are used, we need an endpoint to verify the cookie.
            // The server `auth.routes.ts` only has /register, /login, /logout.
            // I might need to use a trick: try to fetch tasks. If 401, not logged in.
            // OR better, I will assume I should persist user in localStorage for UI, 
            // but rely on API 401s to clear it.

            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) {
            console.error("Logout failed", e);
        }
        setUser(null);
        localStorage.removeItem('user');
    };

    const updateProfile = async (data: { name?: string; email?: string }) => {
        const response = await api.put('/auth/profile', data);
        if (response.data.success) {
            const updatedUser = response.data.user;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            logout,
            isAuthenticated: !!user,
            checkAuth,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
