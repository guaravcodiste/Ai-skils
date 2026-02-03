import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const CrispChat = () => {
    const { user } = useAuth();

    useEffect(() => {
        // Initialize Crisp
        window.$crisp = [];
        window.CRISP_WEBSITE_ID = import.meta.env.VITE_CRISP_WEBSITE_ID;

        (function () {
            const d = document;
            const s = d.createElement("script");
            s.src = "https://client.crisp.chat/l.js";
            s.async = 1;
            d.getElementsByTagName("head")[0].appendChild(s);
        })();

        // Optional: Cleanup if component unmounts
        // Crisp usually stays as a singleton, but if you want to hide it:
        // return () => {
        //     if (window.$crisp) {
        //         window.$crisp.push(["do", "chat:hide"]);
        //     }
        // };
    }, []);

    useEffect(() => {
        if (window.$crisp) {
            if (user) {
                // Sync user data to Crisp
                if (user.email) {
                    window.$crisp.push(["set", "user:email", [user.email]]);
                }
                if (user.username || user.firstName || user.name) {
                    const name = user.name || user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim();
                    window.$crisp.push(["set", "user:nickname", [name]]);
                }
                // Show the chat when logged in
                window.$crisp.push(["do", "chat:show"]);
            } else {
                // User logged out, reset and hide
                window.$crisp.push(["do", "session:reset"]);
                window.$crisp.push(["do", "chat:hide"]);
            }
        }
    }, [user]);

    return null; // This component doesn't render any UI itself
};

export default CrispChat;
