import { Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const AppToaster = () => {
    const { isDark } = useTheme();

    return (
        <Toaster
            position="top-right"
            gutter={12}
            toastOptions={{
                duration: 3000,
                style: {
                    background: isDark ? '#1f1f1f' : '#ffffff',
                    color: isDark ? '#ffffff' : '#212121',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #333' : '1px solid #e5e7eb',
                    boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.6)' : '0 10px 30px rgba(0,0,0,0.15)',
                },
                success: {
                    iconTheme: {
                        primary: '#22c55e',
                        secondary: '#ffffff',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                    },
                },
            }}
        />
    );
};

export default AppToaster;
