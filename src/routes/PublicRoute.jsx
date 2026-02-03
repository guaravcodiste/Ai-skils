import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ redirectIfLoggedIn = '/dashboard' }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return isAuthenticated ? <Navigate to={redirectIfLoggedIn} replace /> : <Outlet />;
};

export default PublicRoute;
