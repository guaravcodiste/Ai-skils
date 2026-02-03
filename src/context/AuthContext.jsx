import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile } from '../services/ProfileService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadProfile = async () => {
        try {
            const res = await getProfile();
            setUser(res.data.data);
            setIsAuthenticated(true);
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (token) {
            loadProfile();
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (tokens, rememberMe) => {
        if (rememberMe) {
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
        } else {
            sessionStorage.setItem('accessToken', tokens.accessToken);
            sessionStorage.setItem('refreshToken', tokens.refreshToken);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }

        setIsLoading(true); // important
        try {
            await loadProfile(); // sets user and isAuthenticated
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
                refreshProfile: loadProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
