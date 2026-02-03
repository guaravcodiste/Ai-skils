import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { verifyToken } from '../../services/AuthService';
import ThemeToggle from '../../components/ThemeToggle';
import toast from 'react-hot-toast';

const AcceptInvite = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [searchParams] = useSearchParams();
    const [isVerifying, setIsVerifying] = useState(true);
    const hasVerified = useRef(false);

    useEffect(() => {
        if (hasVerified.current) return;

        const verifyInviteToken = async () => {
            hasVerified.current = true;
            const tokenFromUrl = searchParams.get('token');
            if (!tokenFromUrl) {
                toast.error('Invalid or missing invitation token. Please contact your administrator.');
                setIsVerifying(false);
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            try {
                await verifyToken(tokenFromUrl);
                toast.success('Invitation verified! Please set your password.');
                navigate(`/set-password?token=${tokenFromUrl}`);
            } catch (err) {
                toast.error(err?.response?.data?.message || 'Invalid or expired invitation token.');
                setIsVerifying(false);
                setTimeout(() => navigate('/login'), 2000);
            }
        };

        verifyInviteToken();
    }, [searchParams, navigate]);

    return (
        <div
            className={`h-screen flex flex-col lg:flex-row p-0 md:p-4 overflow-hidden ${isDark ? 'bg-[#131313]' : ''}`}
            style={
                !isDark
                    ? {
                          background: 'linear-gradient(140deg, rgba(232, 215, 193, 1) 0%, rgba(255, 255, 255, 1) 100%)',
                      }
                    : undefined
            }
        >
            <div className="relative w-full lg:w-1/2 h-full overflow-hidden z-0 bg-[url(/images/login-image.png)] bg-cover bg-center rounded-[0] md:rounded-[20px]">
                <div className="relative h-full flex items-center justify-center p-8">
                    <div className="bg-[#16161666] backdrop-blur-lg rounded-[20px] px-[30px] py-[12px] md:px-[50px] md:py-[24px] text-center">
                        <h1 className="text-[38px] lg:text-[66px] text-[#FFF7D0] mb-2 tracking-[-3%] leading-[36px] md:leading-[62px]">
                            <span className="font-light">AI</span> Skill Builder
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-medium">Sales Training Platform</p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10 rounded-[24px]">
                <div className="w-full max-w-md">
                    <div className="mb-[16px]">
                        <ThemeToggle />
                    </div>

                    <div className="text-center">
                        {isVerifying ? (
                            <>
                                {/* Loading Spinner */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 rounded-full border-8 border-[#908471]/20 border-t-[#908471] animate-spin"></div>
                                </div>

                                <h2 className={`text-3xl md:text-4xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#242424]'}`}>
                                    Verifying Invitation
                                </h2>
                                <p className={`text-sm md:text-base ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                                    Please wait while we verify your invitation...
                                </p>
                            </>
                        ) : (
                            <>
                                {/* Error State */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </div>

                                <h2 className={`text-3xl md:text-4xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#242424]'}`}>
                                    Verification Failed
                                </h2>
                                <p className={`text-sm md:text-base ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                                    Redirecting to login...
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcceptInvite;

