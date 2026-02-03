import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import Button from '../../components/Button';
import { getPracticeTypeDetails } from '../../services/PracticeService';
import { useState } from 'react';
import toast from 'react-hot-toast';

const SessionWithCompetence = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const params = useParams();
    const practice_id = params.practice_id;

    const [practice, setPractice] = useState(null);
    // const [loading, setLoading] = useState(false);
    const [loading, setLoading] = useState(true); // Changed to true
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [competencies, setCompetencies] = useState([]);
    const [selectedCompetency, setSelectedCompetency] = useState(null);

    useEffect(() => {
        const fetchPracticeDetails = async () => {
            try {
                setLoading(true);
                const res = await getPracticeTypeDetails(practice_id);
                const practice = res.data.data;
                setPractice(practice);
                const formattedCompetencies = getFormattedCompetencies(practice?.competencies);
                setCompetencies(formattedCompetencies);
            } catch (error) {
                toast.error(error?.response?.data?.message || 'An error occurred while fetching practice details.');
            } finally {
                setLoading(false);
            }
        };
        fetchPracticeDetails();
    }, [practice_id]);

    const getFormattedCompetencies = data => {
        return data.map(item => ({
            competency_name: item.title,
            competency_knowledgebase_name: item.knowledgeBase?.name ?? null,
            knowledgebase_id: item.knowledgeBase?.id ?? item.knowledgeBaseId,
            knowledgebase_context_id: item.knowledgeBase?.contextId ?? null,
        }));
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
    };

    return (
        <div className="min-h-screen bg-[url('/images/Value-Selling-Assessment.png')] bg-cover bg-center relative">
            <div className="max-w-[1440px] mx-auto">
                {/* Top Header Section */}
                <div className="px-[44px] py-[16px] flex justify-between items-center flex-col md:flex-row gap-[16px]">
                    <img src="/images/logo-text.png" alt="Logo" />
                    <ThemeToggle bgColor="bg-[#E2E2E2]" />
                </div>

                <div className="relative w-full max-w-[655px] mx-auto px-[13px] pb-[50px]">
                    {/* Main Card */}
                    <div
                        className={`relative rounded-[20px] p-[16px] !pb-[36px] !pt-[40px] md:p-8 lg:p-12 lg:!pb-[28px] backdrop-blur-lg ${isDark ? 'bg-[#131313]/80' : 'bg-[linear-gradient(180deg,_rgba(255,255,255,0.83)_58%,_rgba(144,132,113,0.83)_100%)]'
                            }`}
                    >
                        {loading && (
                            <div className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-sm">
                                <div className="text-center px-6">

                                    <div className="mt-4 flex justify-center">
                                        <div className="h-8 w-8 border-4 border-[#908471] border-t-[#CAD3AC] rounded-full animate-spin" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Back Button */}
                        <button
                            className="absolute top-[9px] left-[18px] z-10 flex items-center gap-[16px]"
                            aria-label="Go back"
                            onClick={() => {
                                navigate('/dashboard');
                            }}
                        >
                            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M18.8125 37.625C22.5333 37.625 26.1705 36.5217 29.2642 34.4545C32.3579 32.3874 34.7691 29.4493 36.193 26.0117C37.6169 22.5742 37.9894 18.7916 37.2635 15.1424C36.5376 11.4931 34.7459 8.14103 32.1149 5.51006C29.484 2.87908 26.1319 1.08737 22.4826 0.361482C18.8334 -0.364401 15.0508 0.00814635 11.6133 1.43202C8.17573 2.85589 5.23762 5.26714 3.17048 8.36084C1.10333 11.4545 -1.96992e-06 15.0917 -1.64464e-06 18.8125C0.00526689 23.8003 1.98899 28.5822 5.51587 32.1091C9.04276 35.636 13.8247 37.6197 18.8125 37.625ZM10.5531 17.7887L16.3415 12.0002C16.6131 11.7287 16.9814 11.5761 17.3654 11.5761C17.7494 11.5761 18.1177 11.7287 18.3892 12.0002C18.6608 12.2717 18.8133 12.64 18.8133 13.024C18.8133 13.4081 18.6608 13.7763 18.3892 14.0479L15.0699 17.3654L26.0481 17.3654C26.4319 17.3654 26.8 17.5178 27.0713 17.7892C27.3427 18.0606 27.4952 18.4287 27.4952 18.8125C27.4952 19.1963 27.3427 19.5644 27.0713 19.8358C26.8 20.1072 26.4319 20.2596 26.0481 20.2596L15.0699 20.2596L18.3892 23.5771C18.6608 23.8487 18.8133 24.217 18.8133 24.601C18.8133 24.985 18.6608 25.3533 18.3892 25.6248C18.1177 25.8963 17.7494 26.0489 17.3654 26.0489C16.9814 26.0489 16.6131 25.8963 16.3415 25.6248L10.5531 19.8363C10.4185 19.7019 10.3118 19.5423 10.239 19.3667C10.1662 19.191 10.1287 19.0027 10.1287 18.8125C10.1287 18.6223 10.1662 18.434 10.239 18.2583C10.3118 18.0827 10.4185 17.9231 10.5531 17.7887Z"
                                    fill={isDark ? 'white' : 'black'}
                                />
                            </svg>
                            <span className="text-[14px] font-medium text-[#757575]">Back to Dashboard</span>
                        </button>

                        {/* Title */}
                        <div className="mb-[28px] md:mb-[34px] text-center mt-[17px]">
                            <h2
                                className={`text-[26px] lg:text-[38px] text-center font-semibold mb-[4px] leading-[35px] lg:leading-[45px] ${isDark ? 'text-white' : 'text-[#242424]'
                                    }`}
                            >
                                It’s Game Time!
                            </h2>
                            <p className={`text-sm md:text-[22px] font-medium text-center mb-[34px] ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                                I’ve set the scenario. You choose the focus.
                            </p>

                            {/* Profile Picture */}
                            <div className="flex justify-center mb-[36px] md:mb-[40px]">
                                {/* <img
                                    src={practice?.avatar?.image}
                                    alt="Profile"
                                    className="w-[126px] h-[126px] lg:w-[200px] lg:h-[200px] rounded-full object-cover shadow-lg"
                                /> */}
                                <div className="relative w-[126px] h-[126px] lg:w-[200px] lg:h-[200px]">
                                    {imageLoading && (
                                        <div className={`absolute inset-0 rounded-full flex items-center justify-center ${isDark ? 'bg-[#232323]' : 'bg-gray-200'}`}>
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#908471]"></div>
                                        </div>
                                    )}

                                    {imageError && (
                                        <div className={`w-full h-full rounded-full flex items-center justify-center ${isDark ? 'bg-[#232323]' : 'bg-gray-200'}`}>
                                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                    )}

                                    {practice?.avatar?.image && !imageError && (
                                        <img
                                            src={practice.avatar.image}
                                            alt="Profile"
                                            className={`w-[126px] h-[126px] lg:w-[200px] lg:h-[200px] rounded-full object-cover shadow-lg duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
                                                }`}
                                            onLoad={handleImageLoad}
                                            onError={handleImageError}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-[20px] lg:mb-[22px]">
                            <div className={`font-semibold text-[16px] mb-[14px] lg:mb-[7px] uppercase ${isDark ? 'text-white' : 'text-[#000]'}`}>
                                Set Your Feedback Focus
                            </div>
                            <div className="relative mb-[4px]">
                                <select
                                    className={`w-full appearance-none rounded-[10px] px-[16px] py-[13px] text-[14px] font-normal border-none outline-none cursor-pointer pr-[40px] ${isDark ? 'bg-[#080808] text-[#DCD6CE]' : 'bg-[#DCD6CE] text-[#080808]'
                                        }`}
                                    value={selectedCompetency ?? ''}
                                    defaultValue=""
                                    onChange={e => setSelectedCompetency(e.target.value)}
                                >
                                    <option value="" disabled hidden>
                                        Select one competence
                                    </option>
                                    {competencies.map((item, index) => (
                                        <option key={index} value={item.knowledgebase_context_id}>
                                            {item.competency_knowledgebase_name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M1 1.5L6 6.5L11 1.5"
                                            stroke={isDark ? '#343330' : '#343330'}
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <p className={`text-[12px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                Tell me which critical competence you want to practice. I will track your performance specifically against this standard.
                            </p>
                        </div>

                        {/* Numbered Sections */}
                        <div className={`font-semibold text-[16px] mb-[14px] lg:mb-[7px] uppercase ${isDark ? 'text-white' : 'text-[#000]'}`}>
                            How to ace this session:
                        </div>
                        <div className="space-y-[16px] lg:space-y-[10px] mb-[22px] lg:mb-[32px]">
                            <div className={`flex items-center gap-4 p-4 rounded-[16px] ${isDark ? 'bg-[#232323] bg-opacity-60' : 'bg-[#908471] bg-opacity-[0.16]'}`}>
                                <div
                                    className={`w-[46px] h-[46px] rounded-full border border-dashed flex justify-center items-center text-[36px] font-semibold ${isDark ? 'border-white text-white' : 'border-[#000] text-[#000]'
                                        }`}
                                >
                                    1
                                </div>
                                <div className="flex-1 max-w-[420px]">
                                    <h3 className={`font-semibold text-[15px] mb-[3px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>Just Talk</h3>
                                    <p className={`text-[12px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                        No buttons or scripts. Speak naturally, just like a real call.
                                    </p>
                                </div>
                            </div>

                            <div className={`flex items-center gap-4 p-4 rounded-[16px] ${isDark ? 'bg-[#232323] bg-opacity-60' : 'bg-[#908471] bg-opacity-[0.16]'}`}>
                                <div
                                    className={`w-[46px] h-[46px] rounded-full border border-dashed flex justify-center items-center text-[36px] font-semibold ${isDark ? 'border-white text-white' : 'border-[#000] text-[#000]'
                                        }`}
                                >
                                    2
                                </div>
                                <div className="flex-1 max-w-[420px]">
                                    <h3 className={`font-semibold text-[15px] mb-[3px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>Be Real</h3>
                                    <p className={`text-[12px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                        I will react instantly to your tone. Treat me like a real customer.
                                    </p>
                                </div>
                            </div>

                            <div className={`flex items-center gap-4 p-4 rounded-[16px] ${isDark ? 'bg-[#232323] bg-opacity-60' : 'bg-[#908471] bg-opacity-[0.16]'}`}>
                                <div
                                    className={`w-[46px] h-[46px] rounded-full border border-dashed flex justify-center items-center text-[36px] font-semibold ${isDark ? 'border-white text-white' : 'border-[#000] text-[#000]'
                                        }`}
                                >
                                    3
                                </div>
                                <div className="flex-1 max-w-[420px]">
                                    <h3 className={`font-semibold text-[15px] mb-[3px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>Watch the Clock</h3>
                                    <p className={`text-[12px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                        When you are close to 8 minutes, press Stop Training to listen to your feedback.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col md:flex-row gap-[12px] md:gap-[16px] justify-between items-stretch md:items-center">
                            <Button onClick={() => navigate('/dashboard')} className="md:max-w-[220px] order-2 md:order-1">
                                Cancel
                            </Button>
                            <Button
                                onClick={() => navigate(`/practiceSession/${practice_id}/competency/${selectedCompetency}`)}
                                disabled={!selectedCompetency}
                                className={`order-1 md:order-2 !bg-[#908471] text-white hover:!bg-[#7a6f5f] ${!selectedCompetency ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-600' : ''
                                    }`}
                            >
                                Start Training
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionWithCompetence;
