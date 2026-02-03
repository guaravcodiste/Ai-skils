import React from 'react';
import Skeleton from './Skeleton';
import { useTheme } from '../context/ThemeContext';

const DashboardStatsSkeleton = () => {
    const { isDark } = useTheme();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
            {/* Welcome Banner Skeleton */}
            <div className={`relative rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-8 p-[16px] md:p-[36px] h-full ${
                isDark ? 'bg-[#1a1a1a] border border-[#eeeeee1a]' : 'bg-[#e0e0e0]'
            }`}>
               <div className="flex flex-col justify-between h-full space-y-4">
                   <div>
                        <Skeleton className="w-24 h-4 mb-3" />
                        <Skeleton className="w-48 h-8 mb-4" />
                        <Skeleton className="w-32 h-4 mb-1" />
                        <Skeleton className="w-40 h-4" />
                   </div>
                   <Skeleton className="w-32 h-10 rounded-lg" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-[8px] md:gap-[14px]">
                {/* Sections Complete Skeleton */}
                <div
                    className={`rounded-[12px] md:rounded-[20px] p-2 md:p-6 border backdrop-blur-lg ${
                        isDark ? 'bg-[#2a2a2a] border-[#eeeeee1a]' : 'bg-white border-[#EEEEEE]'
                    }`}
                >
                    <Skeleton className="w-24 h-4 mb-1" />
                    <Skeleton className="w-16 h-3 mb-4" />
                    
                    <div className="flex flex-col items-center relative gap-4">
                         <Skeleton className="w-[124px] h-[124px] md:w-[232px] md:h-[232px] rounded-full" />
                         <Skeleton className="w-full h-12 rounded-[12px] md:rounded-[20px]" />
                    </div>
                </div>

                {/* Skill Score & Points Skeleton */}
                <div className="flex flex-col gap-[8px] md:gap-[14px]">
                     {/* Skill Score */}
                    <div
                        className={`rounded-[12px] md:rounded-[20px] p-2 md:p-6 border backdrop-blur-lg flex-1 ${
                            isDark ? 'bg-[#2a2a2a] border-[#eeeeee1a]' : 'bg-white border-[#EEEEEE]'
                        }`}
                    >
                         <div className="flex justify-between items-end mb-[24px]">
                            <Skeleton className="w-20 h-4" />
                            <div className="flex flex-col items-end gap-1">
                                <Skeleton className="w-12 h-6" />
                                <Skeleton className="w-16 h-3" />
                            </div>
                        </div>
                        <Skeleton className="w-full h-24 rounded-lg" />
                    </div>

                    <div className="grid grid-cols-2 gap-[8px] md:gap-[14px]">
                        {/* Total Points */}
                        <div
                            className={`rounded-[12px] md:rounded-[20px] p-2 md:p-4 border backdrop-blur-lg ${
                                isDark ? 'bg-[#2a2a2a] border-[#eeeeee1a]' : 'bg-white border-[#EEEEEE]'
                            }`}
                        >
                             <Skeleton className="w-20 h-4 mx-auto mb-2" />
                             <Skeleton className="w-16 h-8 mx-auto" />
                        </div>
                        {/* Time Practiced */}
                         <div
                            className={`rounded-[12px] md:rounded-[20px] p-2 md:p-4 border backdrop-blur-lg ${
                                isDark ? 'bg-[#2a2a2a] border-[#eeeeee1a]' : 'bg-white border-[#EEEEEE]'
                            }`}
                        >
                             <Skeleton className="w-24 h-4 mx-auto mb-2" />
                             <Skeleton className="w-16 h-8 mx-auto" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStatsSkeleton;
