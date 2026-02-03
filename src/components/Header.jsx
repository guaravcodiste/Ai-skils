import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { getUserFullName } from '../utils/user';
import { useEffect, useRef, useState } from 'react';

const Header = () => {
    const { isDark } = useTheme();
    const { user, logout } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = e => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getUserInitials = user => {
        if (!user) return '';
        const first = user.firstName?.charAt(0) || '';
        const last = user.lastName?.charAt(0) || '';
        return (first + last).toUpperCase();
    };

    return (
        // <div className="p-[16px] md:p-[26px]">
        <div className="p-[16px] md:p-[26px] relative z-[50]">
            <div
                className={`flex items-center gap-[16px] justify-between px-[8px] md:px-[24px] py-[8px] rounded-[20px] border border-[#ffffff1a] ${
                    isDark ? 'bg-[#1B1B1B]' : 'bg-white'
                }`}
            >
                <div className='flex items-center gap-[8px] md:gap-[12px]'>
                    {isDashboard && (
                        <Link to="/welcomeArea">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M15 18L9 12L15 6"
                                    stroke={isDark ? 'white' : 'black'}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Link>
                    )}
                    <Link to="/dashboard" className={`flex items-center text-[20px] md:text-[24px] cursor-pointer ${isDark ? 'text-white' : 'text-[#1B1B1B]'}`}>
                        <span className="font-light me-1">AI</span> Skill Builder
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <div className="">
                        <ThemeToggle bgColor="bg-[#DFDFDF]" />
                    </div>
                    {/* <div className="flex items-center gap-3">
                        <div className="w-[44px] h-[44px] rounded-full overflow-hidden">
                            <img src="/images/userPic.png" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="hidden md:block">
                            <p className={`font-medium text-[14px] ${isDark ? 'text-white' : 'text-[#00000080]'}`}>{getUserFullName(user)}</p>
                            <p className={`font-medium text-[12px] ${isDark ? 'text-white' : 'text-[#000000cc]'}`}>Product Manager</p>
                        </div>
                    </div> */}
                    <div className="relative" ref={dropdownRef}>
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsOpen(prev => !prev)}>
                            {/* <div className="w-[44px] h-[44px] rounded-full overflow-hidden">
                                <img src="/images/userPic.png" alt="Profile" className="w-full h-full object-cover" />
                            </div> */}

                            <div
                                className={`w-[44px] h-[44px] rounded-full flex items-center justify-center font-semibold text-[16px]
    ${isDark ? 'bg-[#2A2A2A] text-white' : 'bg-[#E5E5E5] text-[#1B1B1B]'}`}
                            >
                                {getUserInitials(user)}
                            </div>

                            <div className="hidden md:block">
                                <p className={`font-medium text-[14px] ${isDark ? 'text-white' : 'text-[#00000080]'}`}>{getUserFullName(user)}</p>
                                <p className={`font-medium text-[12px] ${isDark ? 'text-white' : 'text-[#000000cc]'}`}>Product Manager</p>
                            </div>
                        </div>

                        {/* Dropdown Menu */}
                        {isOpen && (
                            <div
                                className={`absolute right-0 mt-3 w-[160px] rounded-[12px] shadow-lg border z-[9999]
                                ${isDark ? 'bg-[#1B1B1B] border-[#ffffff1a] text-white' : 'bg-white border-[#0000001a]'}`}
                            >
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 text-[14px] hover:bg-[#0000000d] dark:hover:bg-[#ffffff0d] rounded-[12px]"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
