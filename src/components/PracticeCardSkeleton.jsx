import React from 'react';
import Skeleton from './Skeleton';
import { useTheme } from '../context/ThemeContext';

const PracticeCardSkeleton = () => {
    const { isDark } = useTheme();

    return (
        <div
            className={`rounded-xl md:rounded-[20px] border backdrop-blur-lg overflow-hidden ${
                isDark ? 'bg-[#2a2a2a] border-[#eeeeee1a]' : 'bg-white border-[#EEEEEE]'
            }`}
        >
            {/* Image Placeholder */}
            <div className="relative h-[110px] md:h-[190px] overflow-hidden">
                <Skeleton className="w-full h-full rounded-none" />
            </div>
            
            <div className="p-[16px] md:p-[30px]">
                <div className="flex justify-between items-end gap-[24px] md:gap-[78px]">
                    <div className="w-full max-w-[500px]">
                        {/* Title */}
                        <Skeleton className="w-3/4 h-4 md:h-6 mb-2" />
                        
                        {/* Description */}
                        <div className="mb-[12px] md:mb-[16px] space-y-2">
                             <Skeleton className="w-full h-3 md:h-4" />
                             <Skeleton className="w-2/3 h-3 md:h-4" />
                        </div>

                        {/* Meta Tags */}
                        <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-6">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4 rounded-full" />
                                <Skeleton className="w-16 h-3" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4 rounded-full" />
                                <Skeleton className="w-20 h-3" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Button Placeholder */}
                    <div className="flex justify-end pb-4 md:pb-6">
                         <Skeleton className="w-[24px] h-[24px] md:w-[38px] md:h-[38px] rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PracticeCardSkeleton;
