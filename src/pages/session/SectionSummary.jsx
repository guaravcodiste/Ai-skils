import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { getSessionEvalutedResult } from '../../services/LiveAvatarService';
import { useEffect, useState } from 'react';
import { EVALUATION_STATUS } from '../../enum/session';
import ThemeToggle from '../../components/ThemeToggle';
import Button from '../../components/Button';

const SectionSummary = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const params = useParams();
    const practiceId = params.practice_id;
    const sessionId = params.session_id;

    const [loading, setLoading] = useState(true);
    const [aiResult, setAiResult] = useState(null);
    const [sessionDuration, setSessionDuration] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let intervalId;

        const pollResult = async () => {
            try {
                const res = await getSessionEvalutedResult(sessionId);
                const status = res.data?.data?.aiResult?.status;

                if (status === EVALUATION_STATUS.COMPLETED) {
                    setAiResult(res.data?.data?.aiResult);
                    setSessionDuration(res.data?.data?.sessionDuration);
                    setLoading(false);
                    clearInterval(intervalId);
                } else if (status === EVALUATION_STATUS.FAILED) {
                    setError('We could not analyze this session. Please try again.');
                    setLoading(false);
                    clearInterval(intervalId);
                } else {
                    setLoading(true);
                }
            } catch (err) {
                setLoading(false);
                setError('Failed to fetch evaluation result');
                clearInterval(intervalId);
            }
        };
        setLoading(true);
        pollResult();
        intervalId = setInterval(pollResult, 2000);

        return () => clearInterval(intervalId);
    }, [sessionId]);

    const formatDuration = totalSeconds => {
        if (!totalSeconds && totalSeconds !== 0) return '0:00';

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const insights = aiResult?.payload?.insights;
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const score = aiResult?.payload?.scorePercentage ?? 0;
    const progressOffset = circumference * (1 - score / 100);

    return (
        <div className="min-h-screen bg-[url('/images/Value-Selling-Assessment.png')] bg-cover bg-center relative">
            <div className="max-w-[1440px] mx-auto">
                {/* Header */}
                <div className="px-[44px] py-[16px] flex justify-between items-center flex-col md:flex-row gap-[16px] relative z-10">
                    <div className="text-white text-2xl font-semibold">AkzoNobel</div>
                    <ThemeToggle />
                </div>

                <div className="relative w-full max-w-[655px] mx-auto px-[13px] pb-[50px]">
                    <div
                        className={`relative rounded-[20px] backdrop-blur-lg overflow-hidden ${
                            isDark ? 'bg-[#131313]/80' : 'bg-[linear-gradient(180deg,_rgba(255,255,255,0.83)_58%,_rgba(144,132,113,0.83)_100%)]'
                        }`}
                    >
                        <div className="max-w-[560px] mx-auto py-[36px] px-[8px] md:px-[24px]">
                            {loading && (
                                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                                    <div className="text-center px-6">
                                        <p className="text-[18px] md:text-[20px] font-semibold text-white mb-2">Analyzing your session...</p>
                                        <p className="text-[13px] md:text-[14px] text-white/80">This usually takes a few seconds</p>

                                        <div className="mt-4 flex justify-center">
                                            <div className="h-8 w-8 border-4 border-[#908471] border-t-[#CAD3AC] rounded-full animate-spin" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {error && (
                                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/95 backdrop-blur-sm">
                                    <div className="text-center px-6">
                                        <p className="text-[18px] md:text-[20px] font-semibold text-white mb-2"> Something went wrong</p>
                                        <p className="text-red-500">{error}</p>

                                        <div className="mt-4">
                                            <Button onClick={() => navigate('/dashboard')} className="order-2 md:order-1">
                                                Back to Dashboard
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Progress Indicator */}
                            <div className="flex justify-center mb-[16px] md:mb-[24px]">
                                <div className="relative w-[138px] h-[138px] md:w-[160px] md:h-[160px]">
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
                                            // r="45"
                                            r={radius}
                                            fill="none"
                                            stroke="url(#progressGradient)"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            // strokeDasharray={`${2 * Math.PI * 45}`}
                                            // strokeDashoffset={`${2 * Math.PI * 45 * (1 - 0.65)}`}
                                            strokeDasharray={circumference}
                                            strokeDashoffset={progressOffset}
                                            className="transition-all duration-500"
                                        />
                                    </svg>
                                    {/* Percentage text */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className={`text-[40px] md:text-[48px] font-bold ${isDark ? 'text-white' : 'text-[#000]'}`}>
                                            {/* 65% */}
                                            {aiResult?.payload?.scorePercentage}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className={`text-[20px] md:text-[26px] font-semibold mb-[12px] md:mb-[6px] text-center ${isDark ? 'text-white' : 'text-[#242424]'}`}>
                                Great Progress!
                            </h1>

                            {/* Subtitle */}
                            <p className={`text-[16px] md:text-[22px] font-semibold mb-[24px] text-center ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                                You're improving with each session
                            </p>

                            {/* Performance Metrics */}
                            <div
                                className={`grid grid-cols-3 gap-[8px] md:gap-[12px] mb-[26px] rounded-[12px] md:rounded-[20px] p-[4px] md:p-[8px] ${
                                    isDark ? 'bg-[#DCD6CE]' : 'bg-[#DCD6CE]'
                                }`}
                            >
                                {/* Discovery Questions */}
                                <div className="rounded-[12px] md:rounded-[10px] bg-[#908471] font-bold text-center text-white flex justify-center items-center py-[12px]">
                                    <div>
                                        <div className="text-[17px] md:text-[25px] leading-[24px] md:leading-[30px]">
                                            {/* 4/5 */}
                                            {aiResult?.payload?.discovery?.asked}/{aiResult?.payload?.discovery?.total}
                                        </div>
                                        <div className="text-[9px] md:text-[13px] font-normal">Discovery Questions</div>
                                    </div>
                                </div>

                                {/* Objections Handled */}
                                <div className="flex justify-center items-center text-[#757575] font-bold text-center">
                                    <div>
                                        <div className="text-[17px] md:text-[25px] leading-[24px] md:leading-[30px]">
                                            {/* 2/3 */}
                                            {aiResult?.payload?.objections?.handled}/{aiResult?.payload?.objections?.total}
                                        </div>
                                        <div className="text-[9px] md:text-[13px] font-normal">Objections Handled</div>
                                    </div>
                                </div>

                                {/* Session Duration */}
                                <div className="flex justify-center items-center text-[#757575] font-bold text-center">
                                    <div>
                                        <div className="text-[17px] md:text-[25px] leading-[24px] md:leading-[30px]">
                                            {/* 8:42 */}
                                            {formatDuration(sessionDuration)}
                                        </div>
                                        <div className="text-[9px] md:text-[13px] font-normal">Session Duration</div>
                                    </div>
                                </div>
                            </div>

                            {/* Coach Insights Section */}
                            <div className="mb-[24px] md:mb-[32px]">
                                <h2 className={`text-[16px] font-semibold mb-[14px] text-[#242424] hidden md:block ${isDark ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
                                    ALL COACH INSIGHTS
                                </h2>

                                {/* Insight Cards */}
                                <div className="space-y-[12px] md:space-y-[16px]">
                                    {/* Strong opening */}
                                    <div
                                        className={`rounded-[12px] md:rounded-[20px] p-[12px] md:p-[16px] flex items-center gap-[12px] md:gap-[16px] ${
                                            isDark ? 'bg-[#232323] bg-opacity-60' : 'bg-[#908471] bg-opacity-[0.16]'
                                        }`}
                                    >
                                        {/* Green Checkmark Icon */}
                                        <div className="flex-shrink-0">
                                            <div className="w-[34px] h-[34px] rounded-full bg-[#29C450] flex items-center justify-center">
                                                <svg
                                                    className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className={`text-[14px] md:text-[16px] font-semibold ${isDark ? 'text-white' : 'text-[#000000]'}`}>Strong opening</h3>
                                            <p className={`text-[12px] font-light leading-relaxed ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                                {/* You established rapport effectively and asked open-ended questions to understand their situation. */}
                                                {insights?.strength?.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Try this next time */}
                                    <div
                                        className={`rounded-[12px] md:rounded-[20px] p-[12px] md:p-[16px] flex items-center gap-[12px] md:gap-[16px] ${
                                            isDark ? 'bg-[#232323] bg-opacity-60' : 'bg-[#908471] bg-opacity-[0.16]'
                                        }`}
                                    >
                                        {/* Gray Checkmark Icon */}
                                        <div className="flex-shrink-0">
                                            <div
                                                className={`w-[34px] h-[34px] rounded-full flex items-center justify-center ${isDark ? 'bg-[#8D8D8D]' : 'bg-[#343330]'}`}
                                            >
                                                <svg
                                                    className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className={`text-[14px] md:text-[16px] font-semibold ${isDark ? 'text-white' : 'text-[#000000]'}`}>Try this next time</h3>
                                            <p className={`text-[12px] font-light leading-relaxed ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                                {/* When handling price objections, tie the value back to specific ROI metrics they mentioned earlier. */}
                                                {insights?.improvement?.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Focus area */}
                                    <div
                                        className={`rounded-[12px] md:rounded-[20px] p-[12px] md:p-[16px] flex items-center gap-[12px] md:gap-[16px] ${
                                            isDark ? 'bg-[#232323] bg-opacity-60' : 'bg-[#908471] bg-opacity-[0.16]'
                                        }`}
                                    >
                                        {/* Gray Checkmark Icon */}
                                        <div className="flex-shrink-0">
                                            <div
                                                className={`w-[34px] h-[34px] rounded-full flex items-center justify-center ${isDark ? 'bg-[#8D8D8D]' : 'bg-[#343330]'}`}
                                            >
                                                <svg
                                                    className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className={`text-[14px] md:text-[16px] font-semibold ${isDark ? 'text-white' : 'text-[#000000]'}`}>Focus area</h3>
                                            <p className={`text-[12px] font-light leading-relaxed ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                                {/* Practice pausing after asking questions to give the customer space to elaborate. */}
                                                {insights?.focus?.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col md:flex-row gap-[12px] md:gap-[16px] justify-between items-stretch md:items-center">
                                <Button onClick={() => navigate('/dashboard')} className="order-2 md:order-1">
                                    Back to Dashboard
                                </Button>
                                <Button
                                    // onClick={() => navigate(`/sessionStart/${practiceId}`)}
                                    onClick={() => navigate(`/session-start/${practiceId}`)}
                                    className={`order-1 md:order-2 ${
                                        isDark ? '!bg-[#908471] text-white hover:!bg-[#7a6f5f]' : '!bg-[#908471] text-white hover:!bg-[#7a6f5f]'
                                    }`}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Practice Again
                                        <svg width="15" height="26" viewBox="0 0 15 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M6.44813 7.6015L8.43713 6.16712C9.04913 7.17437 9.64838 8.06687 10.2349 8.84462C10.8214 9.62237 11.427 10.3172 12.0518 10.9292C12.6893 11.5412 13.365 12.1086 14.079 12.6314V12.7461C13.365 13.2561 12.6893 13.8235 12.0518 14.4482C11.427 15.0602 10.8214 15.7551 10.2349 16.5329C9.64838 17.2979 9.04913 18.184 8.43713 19.1913L6.44813 17.776C6.98363 16.9472 7.53825 16.2269 8.112 15.6149C8.68575 14.9901 9.2595 14.4546 9.83325 14.0084C10.407 13.5621 10.968 13.2051 11.5163 12.9374C12.0645 12.6696 12.5809 12.4784 13.0654 12.3636V13.0139C12.5809 12.8991 12.0645 12.7079 11.5163 12.4401C10.968 12.1596 10.407 11.7962 9.83325 11.35C9.2595 10.9037 8.68575 10.3746 8.112 9.76262C7.53825 9.13787 6.98363 8.4175 6.44813 7.6015ZM1.34175 11.3691H6.67763C7.63388 11.3691 8.52 11.4137 9.336 11.503C10.152 11.5922 10.8979 11.707 11.5736 11.8472L13.008 12.6887L11.5736 13.5111C10.8979 13.6514 10.152 13.7661 9.336 13.8554C8.52 13.9446 7.63388 13.9892 6.67763 13.9892H1.34175V11.3691Z"
                                                fill="white"
                                            />
                                        </svg>
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionSummary;
