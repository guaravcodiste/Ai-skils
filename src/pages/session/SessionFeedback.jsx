import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import { saveSessionRating } from '../../services/LiveAvatarService';
import ThemeToggle from '../../components/ThemeToggle';

const SessionFeedback = () => {
    const { isDark } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const practiceId = params.practice_id;
    const sessionId = params.session_id;

    const handleContinue = async () => {
        if (!rating) {
            toast.error('Please select a rating before continuing');
            return;
        }

        try {
            setLoading(true);
            await saveSessionRating(sessionId, {
                rating,
            });
            // navigate(`/session-summary/${practiceId}/session/${sessionId}`);
            navigate('/dashboard');
            // navigate(`/session-start/${practiceId}`);
        } catch (err) {
            toast.error('Failed to submit rating. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const firstName = user?.firstName || '';

    return (
        <div className="min-h-screen bg-[url('/images/Value-Selling-Assessment.png')] bg-cover bg-center relative">
            <div className="max-w-[1440px] mx-auto">
                <div className="px-[44px] py-[16px] flex justify-between items-center flex-col md:flex-row gap-[16px] relative z-10">
                    <div className="text-white text-2xl font-semibold">AkzoNobel</div>
                    <ThemeToggle bgColor="bg-[#E2E2E2]" />
                </div>

                <div className="relative w-full max-w-[655px] mx-auto px-[13px] p-[50px]">
                    {/* Content Card */}
                    <div
                        className={`relative rounded-[20px] backdrop-blur-lg overflow-hidden px-[24px] pt-[58px] pb-[70px] lg:p-[30px] !lg:pt[35px] ${isDark ? 'bg-[#131313]/80' : 'bg-[linear-gradient(180deg,_rgba(255,255,255,0.83)_58%,_rgba(144,132,113,0.83)_100%)]'
                            }`}
                    >
                        {/* Icon */}
                        <div className="flex justify-center mb-4 md:mb-6">
                            <img src="/images/check 1.svg" className='w-[135px] h-[135px]' alt="Session Feedback" />
                        </div>

                        {/* Title */}
                        <h2 className={`text-[24px] lg:text-[28px] font-semibold text-center mb-2 md:mb-3 leading-[34px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                            Mission Accomplished {firstName ? `${firstName}.` : ''}
                            <br />
                            Great energy today!
                        </h2>

                        {/* Subtitle */}
                        <p className={`text-[18px] lg:font-[22px] font-medium text-center mb-6 md:mb-8 leading-[22px] ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                            Thank you for trusting me with your practice. Every rep you do here builds confidence for the real world.
                        </p>

                        {/* Star Rating */}
                        <div className="mb-6 md:mb-8">
                            <div className="flex justify-center items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                        aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                                    >
                                        <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                                fill={star <= rating ? '#908471' : 'none'}
                                                stroke="#908471"
                                                strokeWidth="1.5"
                                            />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                            {/* Selected Rating Label */}
                            {rating > 0 && (
                                <div className="text-center min-h-[24px] md:min-h-[28px]">
                                    <span className={`text-sm md:text-base font-medium transition-colors ${isDark ? 'text-[#908471]' : 'text-[#908471]'}`}>
                                        {[
                                            { value: 1, label: 'Poor' },
                                            { value: 2, label: 'Fair' },
                                            { value: 3, label: 'Good' },
                                            { value: 4, label: 'Very Good' },
                                            { value: 5, label: 'Excellent!' },
                                        ].find(item => item.value === rating)?.label || ''}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Continue Button */}
                        <div className="flex justify-center">
                            <Button onClick={handleContinue}>{loading ? 'Submitting...' : 'Continue'}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionFeedback;
