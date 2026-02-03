import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import Button from '../../components/Button';

const QuestionaryFinalization = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const result = location.state?.result;
    const assessmentName = location.state?.assessmentName || 'Assessment';
    const practiceTypeId = location.state?.practiceTypeId || null;
    const { isDark } = useTheme();

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-white text-lg">Result not found. Please retake assessment.</p>
            </div>
        );
    }

    const { score, correctAnswers, totalQuestions } = result;

    const percentage = score / 100;

    const feedbackTitle = score >= 80 ? 'Excellent work!' : score >= 50 ? 'Great starting point' : 'Keep practicing!';

    return (
        <div className="min-h-screen bg-[url('/images/Value-Selling-Assessment.png')] bg-cover bg-center relative">
            <div className="max-w-[1440px] mx-auto">
                {/* Header */}
                <div className="px-[44px] py-[16px] flex justify-between items-center flex-col md:flex-row gap-[16px] relative z-10">
                    <div className="text-white text-2xl font-semibold">AkzoNobel</div>
                    <ThemeToggle bgColor="bg-[#E2E2E2]" />
                </div>

                {/* Main Content */}
                <div className="relative w-full max-w-[655px] mx-auto px-[13px] pb-[50px]">
                    {/* Main Card */}
                    <div
                        className={`relative rounded-[20px] p-4 md:p-8 lg:p-12 backdrop-blur-lg ${
                            isDark ? 'bg-[#131313]/80' : 'bg-[linear-gradient(180deg,_rgba(255,255,255,0.83)_58%,_rgba(144,132,113,0.83)_100%)]'
                        }`}
                    >
                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="absolute top-4 left-4 md:top-6 md:left-6 z-10 flex items-center gap-[16px]"
                            aria-label="Go back"
                        >
                            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M18.8125 37.625C22.5333 37.625 26.1705 36.5217 29.2642 34.4545C32.3579 32.3874 34.7691 29.4493 36.193 26.0117C37.6169 22.5742 37.9894 18.7916 37.2635 15.1424C36.5376 11.4931 34.7459 8.14103 32.1149 5.51006C29.484 2.87908 26.1319 1.08737 22.4826 0.361482C18.8334 -0.364401 15.0508 0.00814635 11.6133 1.43202C8.17573 2.85589 5.23762 5.26714 3.17048 8.36084C1.10333 11.4545 -1.96992e-06 15.0917 -1.64464e-06 18.8125C0.00526689 23.8003 1.98899 28.5822 5.51587 32.1091C9.04276 35.636 13.8247 37.6197 18.8125 37.625ZM10.5531 17.7887L16.3415 12.0002C16.6131 11.7287 16.9814 11.5761 17.3654 11.5761C17.7494 11.5761 18.1177 11.7287 18.3892 12.0002C18.6608 12.2717 18.8133 12.64 18.8133 13.024C18.8133 13.4081 18.6608 13.7763 18.3892 14.0479L15.0699 17.3654L26.0481 17.3654C26.4319 17.3654 26.8 17.5178 27.0713 17.7892C27.3427 18.0606 27.4952 18.4287 27.4952 18.8125C27.4952 19.1963 27.3427 19.5644 27.0713 19.8358C26.8 20.1072 26.4319 20.2596 26.0481 20.2596L15.0699 20.2596L18.3892 23.5771C18.6608 23.8487 18.8133 24.217 18.8133 24.601C18.8133 24.985 18.6608 25.3533 18.3892 25.6248C18.1177 25.8963 17.7494 26.0489 17.3654 26.0489C16.9814 26.0489 16.6131 25.8963 16.3415 25.6248L10.5531 19.8363C10.4185 19.7019 10.3118 19.5423 10.239 19.3667C10.1662 19.191 10.1287 19.0027 10.1287 18.8125C10.1287 18.6223 10.1662 18.434 10.239 18.2583C10.3118 18.0827 10.4185 17.9231 10.5531 17.7887Z"
                                    fill={isDark ? 'white' : 'black'}
                                />
                            </svg>
                            <span className={`text-[14px] font-medium ${isDark ? 'text-[#757575]' : 'text-[#757575]'}`}>Back to Dashboard</span>
                        </button>

                        {/* Assessment Header */}
                        <div className="mb-[64px] md:mb-[52px] mt-[60px] md:mt-[80px]">
                            <p
                                className={`text-[14px] md:text-[14px] uppercase tracking-[0.5px] mb-[10px] text-center font-medium ${
                                    isDark ? 'text-[#CECECE]' : 'text-[#757575]'
                                }`}
                            >
                                PRE-SESSION ASSESSMENT
                            </p>
                            <h1 className={`text-[26px] md:text-[38px] font-semibold mb-[12px] text-center ${isDark ? 'text-white' : 'text-[#242424]'}`}>
                                {assessmentName}
                            </h1>
                            <div className="flex items-center justify-between gap-[12px] mb-[40px] md:mb-[50px] flex-col md:flex-row">
                                <div className="w-full h-[8px] md:h-[10px] bg-[#E5E5E5] rounded-full overflow-hidden order-2 md:order-1">
                                    <div className="h-full w-full bg-[#29C450] rounded-full"></div>
                                </div>
                                <span className={`text-[12px] font-medium whitespace-nowrap order-1 md:order-2 ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                                    Complete
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-center mb-[16px] md:mb-[20px]">
                            <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px]">
                                <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#232323" />
                                            <stop offset="100%" stopColor="#908471" />
                                        </linearGradient>
                                    </defs>
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="url(#progressGradient)"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 45}`}
                                        // strokeDashoffset={`${2 * Math.PI * 45 * (1 - 0.65)}`}
                                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage)}`}
                                        className="transition-all duration-500"
                                    />
                                </svg>
                                {/* Percentage text */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className={`text-[44px] md:text-[56px] font-bold ${isDark ? 'text-white' : 'text-[#000]'}`}>{score}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Feedback Section */}
                        <div className="mb-[40px] md:mb-[68px] text-center max-w-[480px] mx-auto">
                            <h2 className={`text-[20px] md:text-[26px] font-semibold mb-[16px] md:mb-[20px] ${isDark ? 'text-white' : 'text-[#242424]'}`}>
                                {/* Great starting point */}
                                {feedbackTitle}
                            </h2>
                            <p className={`text-[17px] md:text-[22px] font-semibold mb-[8px] md:mb-[10px] ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                                {/* You got 0 out of 4 questions correct. */}
                                You got {correctAnswers} out of {totalQuestions} questions correct.
                            </p>
                            <p className={`text-[17px] md:text-[22px] leading-[18px] md:leading-[22px] ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                                This practice session is the perfect opportunity to learn.
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                // onClick={() => navigate(`/sessionStart/${practiceTypeId}`)}
                                onClick={() => navigate(`/session-start/${practiceTypeId}`)}
                            >
                                Start Practice Session
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionaryFinalization;
