import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";
import Button from "../../components/Button";

const SessionStart = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("preparation");

  return (
    <div className="min-h-screen bg-[url('/images/Value-Selling-Assessment.png')] bg-cover bg-center relative">
      {/* Header */}
      <div className="px-[44px] py-[16px] flex justify-between items-center flex-col md:flex-row gap-[16px] relative z-10">
        <div className="text-white text-2xl font-semibold">AkzoNobel</div>
        <ThemeToggle bgColor="bg-[#E2E2E2]" />
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-[655px] mx-auto px-[13px] pb-[50px]">
        {/* Main Card */}
        <div
          className={`relative rounded-[20px] backdrop-blur-lg overflow-hidden ${
            isDark
            ? "bg-[#131313]"
            : "bg-[#FFFFFF]/90"
        }`}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="absolute top-[9px] left-[18px] z-10 flex items-center gap-[16px]"
            aria-label="Go back"
          >
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.8125 37.625C22.5333 37.625 26.1705 36.5217 29.2642 34.4545C32.3579 32.3874 34.7691 29.4493 36.193 26.0117C37.6169 22.5742 37.9894 18.7916 37.2635 15.1424C36.5376 11.4931 34.7459 8.14103 32.1149 5.51006C29.484 2.87908 26.1319 1.08737 22.4826 0.361482C18.8334 -0.364401 15.0508 0.00814635 11.6133 1.43202C8.17573 2.85589 5.23762 5.26714 3.17048 8.36084C1.10333 11.4545 -1.96992e-06 15.0917 -1.64464e-06 18.8125C0.00526689 23.8003 1.98899 28.5822 5.51587 32.1091C9.04276 35.636 13.8247 37.6197 18.8125 37.625ZM10.5531 17.7887L16.3415 12.0002C16.6131 11.7287 16.9814 11.5761 17.3654 11.5761C17.7494 11.5761 18.1177 11.7287 18.3892 12.0002C18.6608 12.2717 18.8133 12.64 18.8133 13.024C18.8133 13.4081 18.6608 13.7763 18.3892 14.0479L15.0699 17.3654L26.0481 17.3654C26.4319 17.3654 26.8 17.5178 27.0713 17.7892C27.3427 18.0606 27.4952 18.4287 27.4952 18.8125C27.4952 19.1963 27.3427 19.5644 27.0713 19.8358C26.8 20.1072 26.4319 20.2596 26.0481 20.2596L15.0699 20.2596L18.3892 23.5771C18.6608 23.8487 18.8133 24.217 18.8133 24.601C18.8133 24.985 18.6608 25.3533 18.3892 25.6248C18.1177 25.8963 17.7494 26.0489 17.3654 26.0489C16.9814 26.0489 16.6131 25.8963 16.3415 25.6248L10.5531 19.8363C10.4185 19.7019 10.3118 19.5423 10.239 19.3667C10.1662 19.191 10.1287 19.0027 10.1287 18.8125C10.1287 18.6223 10.1662 18.434 10.239 18.2583C10.3118 18.0827 10.4185 17.9231 10.5531 17.7887Z" fill={isDark ? "white" : "black"}/>
            </svg>
            <span 
                className={`text-[14px] font-medium ${
                    isDark ? "text-[#ffffff]" : "text-[#ffffff]"
                  }`}
            >Back to Dashboard</span>
          </button>

          {/* Business Meeting Image */}
          <div>
            <div className="w-full h-[200px]  overflow-hidden">
              <img 
                src="/images/Session-Start-banner.png" 
                alt="Business Meeting" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        <div className="max-w-[560px] mx-auto py-[18px] px-[8px]">
            {/* Title */}
            <div className="mb-[30px] md:mb-[40px]">
                <h1
                className={`text-[26px] font-semibold mb-[16px] md:mb-[24px] text-center ${
                    isDark ? "text-white" : "text-[#242424]"
                }`}
                >
                    Value Selling Assessment
                </h1>

                {/* Assessment Stages - Tab Buttons */}
                <div className="flex gap-[8px] justify-between items-center flex-wrap bg-[#DCD6CE] rounded-[20px] p-[6px]">
                    <button
                        onClick={() => setActiveTab("preparation")}
                        className={`px-[18px] md:px-[28px] py-[8px] md:py-[14px] text-[11px] md:text-[16px] whitespace-nowrap transition-all cursor-pointer ${
                        activeTab === "preparation"
                            ? "rounded-[8px] md:rounded-[10px] bg-[#908471] text-white"
                            : "text-[#757575] hover:text-white hover:bg-[#908471] rounded-[8px] md:rounded-[10px]"
                        }`}
                    >
                        <div className="flex flex-col items-center">
                            <span className="font-semibold">Preparation</span>
                            <span>& Discovery</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("validation")}
                        className={`px-[18px] md:px-[28px] py-[8px] md:py-[14px] text-[11px] md:text-[16px] whitespace-nowrap transition-all cursor-pointer ${
                        activeTab === "validation"
                            ? "rounded-[8px] md:rounded-[10px] bg-[#908471] text-white"
                            : "text-[#757575] hover:text-white hover:bg-[#908471] rounded-[8px] md:rounded-[10px]"
                        }`}
                    >
                        <div className="flex flex-col items-center">
                        <span className="font-semibold">Validation</span>
                        <span>& Quantification</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("presentation")}
                        className={`px-[18px] md:px-[28px] py-[8px] md:py-[14px] text-[11px] md:text-[16px] whitespace-nowrap transition-all cursor-pointer ${
                        activeTab === "presentation"
                            ? "rounded-[8px] md:rounded-[10px] bg-[#908471] text-white"
                            : "text-[#757575] hover:text-white hover:bg-[#908471] rounded-[8px] md:rounded-[10px]"
                        }`}
                    >
                        <div className="flex flex-col items-center">
                        <span className="font-semibold">Presentation</span>
                        <span>& Closure</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Dynamic Content Based on Active Tab */}
            {activeTab === "preparation" && (
                <>
                {/* SCENARIO Section */}
                <div className="mb-[16px] md:mb-[24px]">
                    <h2
                        className={`text-[16px] font-semibold mb-[9px] md:mb-[3px] ${
                            isDark ? "text-white" : "text-[#000000]"
                        }`}
                    >
                        SCENARIO
                    </h2>
                    <p
                    className={`text-[14px] font-light leading-[19px] ${
                        isDark ? "text-[#ffffff]" : "text-[#000000]"
                    }`}
                    >
                    You're meeting with a Procurement Manager at a mid-sized manufacturing company for the first time. Your goal is to build rapport, understand their current situation, and uncover their key pain points and challenges with their existing coating solution.
                    </p>
                </div>

                {/* YOUR OBJECTIVES Section */}
                <div className="mb-[16px] md:mb-[24px]">
                    <h2
                        className={`text-[16px] font-semibold mb-[9px] md:mb-[3px] ${
                            isDark ? "text-white" : "text-[#000000]"
                        }`}
                    >
                    YOUR OBJECTIVES
                    </h2>
                    <ul className="space-y-[4px]">
                        <li className="flex items-center gap-[4px]">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[2px]">
                                <path d="M4.48 0.448L5.054 0C5.502 0.662667 5.94533 1.25533 6.384 1.778C6.82267 2.30067 7.28 2.78133 7.756 3.22C8.24133 3.64933 8.76867 4.06933 9.338 4.48V4.55C8.76867 4.95133 8.24133 5.37133 7.756 5.81C7.28 6.24867 6.82267 6.72933 6.384 7.252C5.94533 7.76533 5.502 8.358 5.054 9.03L4.48 8.582C4.85333 8.05 5.23133 7.56 5.614 7.112C5.99667 6.664 6.37933 6.26267 6.762 5.908C7.14467 5.544 7.518 5.236 7.882 4.984C8.246 4.72267 8.596 4.522 8.932 4.382V4.648C8.596 4.508 8.246 4.312 7.882 4.06C7.518 3.79867 7.14467 3.49067 6.762 3.136C6.37933 2.772 5.99667 2.366 5.614 1.918C5.23133 1.47 4.85333 0.980001 4.48 0.448ZM0 4.172H6.146C6.55667 4.172 6.95333 4.18133 7.336 4.2C7.71867 4.20933 8.064 4.228 8.372 4.256L8.848 4.522L8.372 4.774C8.064 4.802 7.71867 4.82533 7.336 4.844C6.95333 4.86267 6.55667 4.872 6.146 4.872H0V4.172Z" fill={isDark ? "#ffffff" : "#000000"} />
                            </svg>
                            <span
                                className={`text-[14px] font-light leading-[19px] ${
                                    isDark ? "text-[#ffffff]" : "text-[#000000]"
                                }`}
                            >
                            Build initial rapport and establish credibility
                            </span>
                        </li>
                        <li className="flex items-center gap-[4px]">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[2px]">
                                <path d="M4.48 0.448L5.054 0C5.502 0.662667 5.94533 1.25533 6.384 1.778C6.82267 2.30067 7.28 2.78133 7.756 3.22C8.24133 3.64933 8.76867 4.06933 9.338 4.48V4.55C8.76867 4.95133 8.24133 5.37133 7.756 5.81C7.28 6.24867 6.82267 6.72933 6.384 7.252C5.94533 7.76533 5.502 8.358 5.054 9.03L4.48 8.582C4.85333 8.05 5.23133 7.56 5.614 7.112C5.99667 6.664 6.37933 6.26267 6.762 5.908C7.14467 5.544 7.518 5.236 7.882 4.984C8.246 4.72267 8.596 4.522 8.932 4.382V4.648C8.596 4.508 8.246 4.312 7.882 4.06C7.518 3.79867 7.14467 3.49067 6.762 3.136C6.37933 2.772 5.99667 2.366 5.614 1.918C5.23133 1.47 4.85333 0.980001 4.48 0.448ZM0 4.172H6.146C6.55667 4.172 6.95333 4.18133 7.336 4.2C7.71867 4.20933 8.064 4.228 8.372 4.256L8.848 4.522L8.372 4.774C8.064 4.802 7.71867 4.82533 7.336 4.844C6.95333 4.86267 6.55667 4.872 6.146 4.872H0V4.172Z" fill={isDark ? "#ffffff" : "#000000"} />
                            </svg>
                            <span
                                className={`text-[14px] font-light leading-[19px] ${
                                    isDark ? "text-[#ffffff]" : "text-[#000000]"
                                }`}
                            >
                            Ask open-ended discovery questions to understand their situation
                            </span>
                        </li>
                        <li className="flex items-center gap-[4px]">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[2px]">
                                <path d="M4.48 0.448L5.054 0C5.502 0.662667 5.94533 1.25533 6.384 1.778C6.82267 2.30067 7.28 2.78133 7.756 3.22C8.24133 3.64933 8.76867 4.06933 9.338 4.48V4.55C8.76867 4.95133 8.24133 5.37133 7.756 5.81C7.28 6.24867 6.82267 6.72933 6.384 7.252C5.94533 7.76533 5.502 8.358 5.054 9.03L4.48 8.582C4.85333 8.05 5.23133 7.56 5.614 7.112C5.99667 6.664 6.37933 6.26267 6.762 5.908C7.14467 5.544 7.518 5.236 7.882 4.984C8.246 4.72267 8.596 4.522 8.932 4.382V4.648C8.596 4.508 8.246 4.312 7.882 4.06C7.518 3.79867 7.14467 3.49067 6.762 3.136C6.37933 2.772 5.99667 2.366 5.614 1.918C5.23133 1.47 4.85333 0.980001 4.48 0.448ZM0 4.172H6.146C6.55667 4.172 6.95333 4.18133 7.336 4.2C7.71867 4.20933 8.064 4.228 8.372 4.256L8.848 4.522L8.372 4.774C8.064 4.802 7.71867 4.82533 7.336 4.844C6.95333 4.86267 6.55667 4.872 6.146 4.872H0V4.172Z" fill={isDark ? "#ffffff" : "#000000"} />
                            </svg>
                            <span
                                className={`text-[14px] font-light leading-[19px] ${
                                    isDark ? "text-[#ffffff]" : "text-[#000000]"
                                }`}
                            >
                            Identify at least 3 key pain points or challenges
                            </span>
                        </li>
                        <li className="flex items-center gap-[4px]">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[2px]">
                                <path d="M4.48 0.448L5.054 0C5.502 0.662667 5.94533 1.25533 6.384 1.778C6.82267 2.30067 7.28 2.78133 7.756 3.22C8.24133 3.64933 8.76867 4.06933 9.338 4.48V4.55C8.76867 4.95133 8.24133 5.37133 7.756 5.81C7.28 6.24867 6.82267 6.72933 6.384 7.252C5.94533 7.76533 5.502 8.358 5.054 9.03L4.48 8.582C4.85333 8.05 5.23133 7.56 5.614 7.112C5.99667 6.664 6.37933 6.26267 6.762 5.908C7.14467 5.544 7.518 5.236 7.882 4.984C8.246 4.72267 8.596 4.522 8.932 4.382V4.648C8.596 4.508 8.246 4.312 7.882 4.06C7.518 3.79867 7.14467 3.49067 6.762 3.136C6.37933 2.772 5.99667 2.366 5.614 1.918C5.23133 1.47 4.85333 0.980001 4.48 0.448ZM0 4.172H6.146C6.55667 4.172 6.95333 4.18133 7.336 4.2C7.71867 4.20933 8.064 4.228 8.372 4.256L8.848 4.522L8.372 4.774C8.064 4.802 7.71867 4.82533 7.336 4.844C6.95333 4.86267 6.55667 4.872 6.146 4.872H0V4.172Z" fill={isDark ? "#ffffff" : "#000000"} />
                            </svg>
                            <span
                                className={`text-[14px] font-light leading-[19px] ${
                                    isDark ? "text-[#ffffff]" : "text-[#000000]"
                                }`}
                            >
                            Understand their decision-making process and timeline
                            </span>
                        </li>
                    </ul>
                </div>

                {/* TIPS Section */}
                <div className="mb-[38px] md:mb-[40px]">
                    <h2
                        className={`text-[16px] font-semibold mb-[9px] md:mb-[3px] ${
                            isDark ? "text-white" : "text-[#000000]"
                        }`}
                    >
                    TIPS
                    </h2>
                    <p
                        className={`text-[14px] font-light leading-[19px] ${
                            isDark ? "text-[#ffffff]" : "text-[#000000]"
                        }`}
                    >
                    Focus on listening. The AI will respond naturally to your questions and statements. Speak clearly and pause briefly between thoughts.
                    </p>
                </div>
                </>
            )}

            {activeTab === "validation" && (
                 <>
                 {/* SCENARIO Section */}
                 <div className="mb-[16px] md:mb-[24px]">
                     <h2
                         className={`text-[16px] font-semibold mb-[9px] md:mb-[3px] ${
                             isDark ? "text-white" : "text-[#000000]"
                         }`}
                     >
                         SCENARIO
                     </h2>
                     <p
                     className={`text-[14px] font-light leading-[19px] ${
                         isDark ? "text-[#ffffff]" : "text-[#000000]"
                     }`}
                     >
                     You've had an initial discovery meeting with the Procurement Manager. Now you're following up to validate your understanding of their needs and begin quantifying the business impact of their current challenges.
                     </p>
                 </div>
 
                 {/* YOUR OBJECTIVES Section */}
                 <div className="mb-[16px] md:mb-[24px]">
                     <h2
                         className={`text-[16px] font-semibold mb-[9px] md:mb-[3px] ${
                             isDark ? "text-white" : "text-[#000000]"
                         }`}
                     >
                     YOUR OBJECTIVES
                     </h2>
                     <ul className="space-y-[4px]">
                         <li className="flex items-center gap-[4px]">
                             <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[2px]">
                                 <path d="M4.48 0.448L5.054 0C5.502 0.662667 5.94533 1.25533 6.384 1.778C6.82267 2.30067 7.28 2.78133 7.756 3.22C8.24133 3.64933 8.76867 4.06933 9.338 4.48V4.55C8.76867 4.95133 8.24133 5.37133 7.756 5.81C7.28 6.24867 6.82267 6.72933 6.384 7.252C5.94533 7.76533 5.502 8.358 5.054 9.03L4.48 8.582C4.85333 8.05 5.23133 7.56 5.614 7.112C5.99667 6.664 6.37933 6.26267 6.762 5.908C7.14467 5.544 7.518 5.236 7.882 4.984C8.246 4.72267 8.596 4.522 8.932 4.382V4.648C8.596 4.508 8.246 4.312 7.882 4.06C7.518 3.79867 7.14467 3.49067 6.762 3.136C6.37933 2.772 5.99667 2.366 5.614 1.918C5.23133 1.47 4.85333 0.980001 4.48 0.448ZM0 4.172H6.146C6.55667 4.172 6.95333 4.18133 7.336 4.2C7.71867 4.20933 8.064 4.228 8.372 4.256L8.848 4.522L8.372 4.774C8.064 4.802 7.71867 4.82533 7.336 4.844C6.95333 4.86267 6.55667 4.872 6.146 4.872H0V4.172Z" fill={isDark ? "#ffffff" : "#000000"} />
                             </svg>
                             <span
                                 className={`text-[14px] font-light leading-[19px] ${
                                     isDark ? "text-[#ffffff]" : "text-[#000000]"
                                 }`}
                             >
                             Confirm and validate the pain points identified in discovery
                             </span>
                         </li>
                         <li className="flex items-center gap-[4px]">
                             <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[2px]">
                                 <path d="M4.48 0.448L5.054 0C5.502 0.662667 5.94533 1.25533 6.384 1.778C6.82267 2.30067 7.28 2.78133 7.756 3.22C8.24133 3.64933 8.76867 4.06933 9.338 4.48V4.55C8.76867 4.95133 8.24133 5.37133 7.756 5.81C7.28 6.24867 6.82267 6.72933 6.384 7.252C5.94533 7.76533 5.502 8.358 5.054 9.03L4.48 8.582C4.85333 8.05 5.23133 7.56 5.614 7.112C5.99667 6.664 6.37933 6.26267 6.762 5.908C7.14467 5.544 7.518 5.236 7.882 4.984C8.246 4.72267 8.596 4.522 8.932 4.382V4.648C8.596 4.508 8.246 4.312 7.882 4.06C7.518 3.79867 7.14467 3.49067 6.762 3.136C6.37933 2.772 5.99667 2.366 5.614 1.918C5.23133 1.47 4.85333 0.980001 4.48 0.448ZM0 4.172H6.146C6.55667 4.172 6.95333 4.18133 7.336 4.2C7.71867 4.20933 8.064 4.228 8.372 4.256L8.848 4.522L8.372 4.774C8.064 4.802 7.71867 4.82533 7.336 4.844C6.95333 4.86267 6.55667 4.872 6.146 4.872H0V4.172Z" fill={isDark ? "#ffffff" : "#000000"} />
                             </svg>
                             <span
                                 className={`text-[14px] font-light leading-[19px] ${
                                     isDark ? "text-[#ffffff]" : "text-[#000000]"
                                 }`}
                             >
                             Help the customer quantify the cost of their current problems
                             </span>
                         </li>
                         <li className="flex items-center gap-[4px]">
                             <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[2px]">
                                 <path d="M4.48 0.448L5.054 0C5.502 0.662667 5.94533 1.25533 6.384 1.778C6.82267 2.30067 7.28 2.78133 7.756 3.22C8.24133 3.64933 8.76867 4.06933 9.338 4.48V4.55C8.76867 4.95133 8.24133 5.37133 7.756 5.81C7.28 6.24867 6.82267 6.72933 6.384 7.252C5.94533 7.76533 5.502 8.358 5.054 9.03L4.48 8.582C4.85333 8.05 5.23133 7.56 5.614 7.112C5.99667 6.664 6.37933 6.26267 6.762 5.908C7.14467 5.544 7.518 5.236 7.882 4.984C8.246 4.72267 8.596 4.522 8.932 4.382V4.648C8.596 4.508 8.246 4.312 7.882 4.06C7.518 3.79867 7.14467 3.49067 6.762 3.136C6.37933 2.772 5.99667 2.366 5.614 1.918C5.23133 1.47 4.85333 0.980001 4.48 0.448ZM0 4.172H6.146C6.55667 4.172 6.95333 4.18133 7.336 4.2C7.71867 4.20933 8.064 4.228 8.372 4.256L8.848 4.522L8.372 4.774C8.064 4.802 7.71867 4.82533 7.336 4.844C6.95333 4.86267 6.55667 4.872 6.146 4.872H0V4.172Z" fill={isDark ? "#ffffff" : "#000000"} />
                             </svg>
                             <span
                                 className={`text-[14px] font-light leading-[19px] ${
                                     isDark ? "text-[#ffffff]" : "text-[#000000]"
                                 }`}
                             >
                             Build a preliminary ROI case with specific metrics
                             </span>
                         </li>
                         <li className="flex items-center gap-[4px]">
                             <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[2px]">
                                 <path d="M4.48 0.448L5.054 0C5.502 0.662667 5.94533 1.25533 6.384 1.778C6.82267 2.30067 7.28 2.78133 7.756 3.22C8.24133 3.64933 8.76867 4.06933 9.338 4.48V4.55C8.76867 4.95133 8.24133 5.37133 7.756 5.81C7.28 6.24867 6.82267 6.72933 6.384 7.252C5.94533 7.76533 5.502 8.358 5.054 9.03L4.48 8.582C4.85333 8.05 5.23133 7.56 5.614 7.112C5.99667 6.664 6.37933 6.26267 6.762 5.908C7.14467 5.544 7.518 5.236 7.882 4.984C8.246 4.72267 8.596 4.522 8.932 4.382V4.648C8.596 4.508 8.246 4.312 7.882 4.06C7.518 3.79867 7.14467 3.49067 6.762 3.136C6.37933 2.772 5.99667 2.366 5.614 1.918C5.23133 1.47 4.85333 0.980001 4.48 0.448ZM0 4.172H6.146C6.55667 4.172 6.95333 4.18133 7.336 4.2C7.71867 4.20933 8.064 4.228 8.372 4.256L8.848 4.522L8.372 4.774C8.064 4.802 7.71867 4.82533 7.336 4.844C6.95333 4.86267 6.55667 4.872 6.146 4.872H0V4.172Z" fill={isDark ? "#ffffff" : "#000000"} />
                             </svg>
                             <span
                                 className={`text-[14px] font-light leading-[19px] ${
                                     isDark ? "text-[#ffffff]" : "text-[#000000]"
                                 }`}
                             >
                             Get agreement on the value drivers that matter most
                             </span>
                         </li>
                     </ul>
                 </div>
 
                 {/* TIPS Section */}
                 <div className="mb-[38px] md:mb-[40px]">
                     <h2
                         className={`text-[16px] font-semibold mb-[9px] md:mb-[3px] ${
                             isDark ? "text-white" : "text-[#000000]"
                         }`}
                     >
                     TIPS
                     </h2>
                     <p
                         className={`text-[14px] font-light leading-[19px] ${
                             isDark ? "text-[#ffffff]" : "text-[#000000]"
                         }`}
                     >
                     Focus on listening. The AI will respond naturally to your questions and statements. Speak clearly and pause briefly between thoughts.
                     </p>
                 </div>
                 </>
            )}

            {activeTab === "presentation" && (
                 <>
                 {/* SCENARIO Section */}
                 <div className="mb-[16px] md:mb-[24px]">
                     <h2
                         className={`text-[16px] font-semibold mb-[9px] md:mb-[3px] ${
                             isDark ? "text-white" : "text-[#000000]"
                         }`}
                     >
                         SCENARIO
                     </h2>
                     <p
                     className={`text-[14px] font-light leading-[19px] ${
                         isDark ? "text-[#ffffff]" : "text-[#000000]"
                     }`}
                     >
                     You've validated the customer's needs and built a strong business case. Now it's time to present your solution, handle final objections, and work toward closing the deal.
                     </p>
                 </div>
 
                 {/* YOUR OBJECTIVES Section */}
                 <div className="mb-[16px] md:mb-[24px]">
                     <h2
                         className={`text-[16px] font-semibold mb-[9px] md:mb-[3px] ${
                             isDark ? "text-white" : "text-[#000000]"
                         }`}
                     >
                     YOUR OBJECTIVES
                     </h2>
                     <ul className="space-y-[4px]">
                         <li className="flex items-center gap-[4px]">
                             <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[2px]">
                                 <path d="M4.48 0.448L5.054 0C5.502 0.662667 5.94533 1.25533 6.384 1.778C6.82267 2.30067 7.28 2.78133 7.756 3.22C8.24133 3.64933 8.76867 4.06933 9.338 4.48V4.55C8.76867 4.95133 8.24133 5.37133 7.756 5.81C7.28 6.24867 6.82267 6.72933 6.384 7.252C5.94533 7.76533 5.502 8.358 5.054 9.03L4.48 8.582C4.85333 8.05 5.23133 7.56 5.614 7.112C5.99667 6.664 6.37933 6.26267 6.762 5.908C7.14467 5.544 7.518 5.236 7.882 4.984C8.246 4.72267 8.596 4.522 8.932 4.382V4.648C8.596 4.508 8.246 4.312 7.882 4.06C7.518 3.79867 7.14467 3.49067 6.762 3.136C6.37933 2.772 5.99667 2.366 5.614 1.918C5.23133 1.47 4.85333 0.980001 4.48 0.448ZM0 4.172H6.146C6.55667 4.172 6.95333 4.18133 7.336 4.2C7.71867 4.20933 8.064 4.228 8.372 4.256L8.848 4.522L8.372 4.774C8.064 4.802 7.71867 4.82533 7.336 4.844C6.95333 4.86267 6.55667 4.872 6.146 4.872H0V4.172Z" fill={isDark ? "#ffffff" : "#000000"} />
                             </svg>
                             <span
                                 className={`text-[14px] font-light leading-[19px] ${
                                     isDark ? "text-[#ffffff]" : "text-[#000000]"
                                 }`}
                             >
                             Present your solution tied to their specific validated needs
                             </span>
                         </li>
                         <li className="flex items-center gap-[4px]">
                             <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[2px]">
                                 <path d="M4.48 0.448L5.054 0C5.502 0.662667 5.94533 1.25533 6.384 1.778C6.82267 2.30067 7.28 2.78133 7.756 3.22C8.24133 3.64933 8.76867 4.06933 9.338 4.48V4.55C8.76867 4.95133 8.24133 5.37133 7.756 5.81C7.28 6.24867 6.82267 6.72933 6.384 7.252C5.94533 7.76533 5.502 8.358 5.054 9.03L4.48 8.582C4.85333 8.05 5.23133 7.56 5.614 7.112C5.99667 6.664 6.37933 6.26267 6.762 5.908C7.14467 5.544 7.518 5.236 7.882 4.984C8.246 4.72267 8.596 4.522 8.932 4.382V4.648C8.596 4.508 8.246 4.312 7.882 4.06C7.518 3.79867 7.14467 3.49067 6.762 3.136C6.37933 2.772 5.99667 2.366 5.614 1.918C5.23133 1.47 4.85333 0.980001 4.48 0.448ZM0 4.172H6.146C6.55667 4.172 6.95333 4.18133 7.336 4.2C7.71867 4.20933 8.064 4.228 8.372 4.256L8.848 4.522L8.372 4.774C8.064 4.802 7.71867 4.82533 7.336 4.844C6.95333 4.86267 6.55667 4.872 6.146 4.872H0V4.172Z" fill={isDark ? "#ffffff" : "#000000"} />
                             </svg>
                             <span
                                 className={`text-[14px] font-light leading-[19px] ${
                                     isDark ? "text-[#ffffff]" : "text-[#000000]"
                                 }`}
                             >
                             Handle at least 2 objections effectively (price, timing, competition)
                             </span>
                         </li>
                         <li className="flex items-center gap-[4px]">
                             <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[2px]">
                                 <path d="M4.48 0.448L5.054 0C5.502 0.662667 5.94533 1.25533 6.384 1.778C6.82267 2.30067 7.28 2.78133 7.756 3.22C8.24133 3.64933 8.76867 4.06933 9.338 4.48V4.55C8.76867 4.95133 8.24133 5.37133 7.756 5.81C7.28 6.24867 6.82267 6.72933 6.384 7.252C5.94533 7.76533 5.502 8.358 5.054 9.03L4.48 8.582C4.85333 8.05 5.23133 7.56 5.614 7.112C5.99667 6.664 6.37933 6.26267 6.762 5.908C7.14467 5.544 7.518 5.236 7.882 4.984C8.246 4.72267 8.596 4.522 8.932 4.382V4.648C8.596 4.508 8.246 4.312 7.882 4.06C7.518 3.79867 7.14467 3.49067 6.762 3.136C6.37933 2.772 5.99667 2.366 5.614 1.918C5.23133 1.47 4.85333 0.980001 4.48 0.448ZM0 4.172H6.146C6.55667 4.172 6.95333 4.18133 7.336 4.2C7.71867 4.20933 8.064 4.228 8.372 4.256L8.848 4.522L8.372 4.774C8.064 4.802 7.71867 4.82533 7.336 4.844C6.95333 4.86267 6.55667 4.872 6.146 4.872H0V4.172Z" fill={isDark ? "#ffffff" : "#000000"} />
                             </svg>
                             <span
                                 className={`text-[14px] font-light leading-[19px] ${
                                     isDark ? "text-[#ffffff]" : "text-[#000000]"
                                 }`}
                             >
                             Create urgency and momentum toward a decision
                             </span>
                         </li>
                         <li className="flex items-center gap-[4px]">
                             <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-[2px]">
                                 <path d="M4.48 0.448L5.054 0C5.502 0.662667 5.94533 1.25533 6.384 1.778C6.82267 2.30067 7.28 2.78133 7.756 3.22C8.24133 3.64933 8.76867 4.06933 9.338 4.48V4.55C8.76867 4.95133 8.24133 5.37133 7.756 5.81C7.28 6.24867 6.82267 6.72933 6.384 7.252C5.94533 7.76533 5.502 8.358 5.054 9.03L4.48 8.582C4.85333 8.05 5.23133 7.56 5.614 7.112C5.99667 6.664 6.37933 6.26267 6.762 5.908C7.14467 5.544 7.518 5.236 7.882 4.984C8.246 4.72267 8.596 4.522 8.932 4.382V4.648C8.596 4.508 8.246 4.312 7.882 4.06C7.518 3.79867 7.14467 3.49067 6.762 3.136C6.37933 2.772 5.99667 2.366 5.614 1.918C5.23133 1.47 4.85333 0.980001 4.48 0.448ZM0 4.172H6.146C6.55667 4.172 6.95333 4.18133 7.336 4.2C7.71867 4.20933 8.064 4.228 8.372 4.256L8.848 4.522L8.372 4.774C8.064 4.802 7.71867 4.82533 7.336 4.844C6.95333 4.86267 6.55667 4.872 6.146 4.872H0V4.172Z" fill={isDark ? "#ffffff" : "#000000"} />
                             </svg>
                             <span
                                 className={`text-[14px] font-light leading-[19px] ${
                                     isDark ? "text-[#ffffff]" : "text-[#000000]"
                                 }`}
                             >
                             Secure commitment or clear next steps
                             </span>
                         </li>
                     </ul>
                 </div>
 
                 {/* TIPS Section */}
                 <div className="mb-[38px] md:mb-[40px]">
                     <h2
                         className={`text-[16px] font-semibold mb-[9px] md:mb-[3px] ${
                             isDark ? "text-white" : "text-[#000000]"
                         }`}
                     >
                     TIPS
                     </h2>
                     <p
                         className={`text-[14px] font-light leading-[19px] ${
                             isDark ? "text-[#ffffff]" : "text-[#000000]"
                         }`}
                     >
                     Focus on listening. The AI will respond naturally to your questions and statements. Speak clearly and pause briefly between thoughts.
                     </p>
                 </div>
                 </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-[10px] md:gap-[16px] justify-between items-stretch md:items-center">
                <Button onClick={() => navigate("/dashboard")} className="md:max-w-[220px] order-2 md:order-1">
                    Cancel
                </Button>
                <Button onClick={() => navigate("/practiceSession")} className="order-1 md:order-2 !bg-[#908471] text-white hover:!bg-[#7a6f5f]">
                    <span className="md:hidden">Start Practice Session</span>
                    <span className="hidden md:inline">Start Session</span>
                </Button>
            </div>
        </div>

        </div>
      </div>
    </div>
  );
};

export default SessionStart;

