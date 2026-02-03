const TrendIndicator = ({ percentage, flag }) => {
    const isIncrease = flag === 'increase';

    return (
        <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center gap-1 text-[11px] md:text-[14px] font-medium ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
                {isIncrease ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    <span className="text-red-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 7L17 17M17 17H9M17 17V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                )}

                <span>{percentage}%</span>
                <span className="text-[#9E9E9E]">score</span>
            </div>
            <span className="text-[#9E9E9E]">previous week</span>
        </div>
    );
};

export default TrendIndicator;
