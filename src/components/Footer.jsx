import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
    const { isDark } = useTheme();

    return (
        <div className={`text-center py-4 md:py-[8px] ${isDark ? 'bg-[#232323]' : 'bg-[#E0E0E0]'}`}>
            <p className={`text-xs md:text-sm ${isDark ? 'text-white' : 'text-[#000000]'}`}>© 2026 Akzonobel.</p>
        </div>
    );
};

export default Footer;

