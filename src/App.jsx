import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AppToaster from './components/AppToaster';
import AppRoutes from './routes/AppRoutes';
import CrispChat from './components/CrispChat';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <AppToaster />
                    <CrispChat />
                    <AppRoutes />
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
