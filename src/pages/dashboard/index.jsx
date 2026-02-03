import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getUserFullName } from '../../utils/user';
import { getPracticeTypes } from '../../services/PracticeService';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PracticeCard from '../../components/PracticeCard';
import toast from 'react-hot-toast';
import { getDashboardStats } from '../../services/DashboardService';
import Skeleton from '../../components/Skeleton';
import DashboardStatsSkeleton from '../../components/DashboardStatsSkeleton';

import PracticeCardSkeleton from '../../components/PracticeCardSkeleton';
import TrendIndicator from '../../components/TrendIndicator';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { isDark } = useTheme();
    const { user } = useAuth();
    // ... code truncated ...

    // ... inside return ...

    const [practices, setPractices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const fetchPractices = async () => {
            try {
                const res = await getPracticeTypes();
                setPractices(res.data.data);
            } catch (error) {
                toast.error(error?.response?.data?.message || 'An error occurred while fetching practices.');
            } finally {
                setLoading(false);
            }
        };
        fetchPractices();
    }, []);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const res = await getDashboardStats();
                setDashboardStats(res.data.data);
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Failed to load dashboard stats');
            } finally {
                setStatsLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    const completedSessions = dashboardStats?.practiceSessions?.completed ?? 0;
    const totalSessions = dashboardStats?.practiceSessions?.total ?? 0;

    const totalPoints = dashboardStats?.totalPoints?.value ?? 0;
    const timePracticed = dashboardStats?.totalPracticeTime?.value ?? 0;

    const sessionProgressPercentage = totalSessions === 0 ? 0 : Math.round((completedSessions / totalSessions) * 100);
    const progressText = completedSessions;
    const totalText = totalSessions;

    const goalAchieved = dashboardStats?.averagePerformance?.percentage ?? 0;

    const gaugeValue = totalSessions === 0 ? 0 : sessionProgressPercentage;

    const chartData = [
        { name: 'Progress', value: gaugeValue },
        { name: 'Remaining', value: 100 - gaugeValue },
    ];

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#131313]' : 'bg-[#EAEAEA]'}`}>
            <div className="max-w-[1440px] mx-auto flex flex-col flex-1 w-full">
                <Header />

                {/* Main Content */}
                <div className="p-[16px] md:p-[26px] pt-0 md:pt-0 flex-1">
                    {/* Stats Cards Row */}
                    {statsLoading ? (
                        <DashboardStatsSkeleton />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-[12px] md:gap-[16px] mb-8 md:mb-12">
                            {/* Welcome Banner */}
                            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-8 bg-[url('/images/wc-banner-bg.png')] bg-cover bg-center p-[16px] md:p-[36px] h-full">
                                <div className="flex flex-col md:flex-row h-full">
                                    <div className="flex flex-col justify-between items-start">
                                        <div className="">
                                            <p className="text-[14px] font-medium text-white mb-[12px]">Ready for the next level?</p>
                                            <h1 className="text-[28px] font-bold text-white mb-[18px]">{user?.firstName ? getUserFullName(user) : user?.email}</h1>
                                            <p className="text-[16px] font-medium text-[#DCD6CE] mb-[12px]">
                                                Your personal coach is
                                                <br />
                                                ready to help you close the
                                                <br />
                                                gap between learning and
                                                <br />
                                                mastery.
                                            </p>
                                        </div>
                                        <button className="hidden rounded-lg font-semibold text-sm md:text-base transition-all text-white flex items-center gap-1">
                                            Start Training
                                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M6.80469 2.84375L10.4609 6.5L6.80469 10.1562"
                                                    stroke="white"
                                                    stroke-width="1.125"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path d="M9.95312 6.50049H2.53906" stroke="white" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-[8px] md:gap-[14px]">
                                {/* Sections Complete Card */}
                                <div className="flex flex-col gap-[8px]">
                                    <div
                                        className={`rounded-[12px] md:rounded-[20px] p-[8px] border backdrop-blur-lg text-center ${
                                            isDark ? 'bg-[#2a2a2a] border-[#eeeeee1a]' : 'bg-white border-[#EEEEEE]'
                                        }`}
                                    >
                                        <h3 className={`text-[24px] md:text-[28px] font-semibold leading-[140%] ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                            Your Growth Journey
                                        </h3>
                                        <p className={`text-[12px] font-medium ${isDark ? 'text-white' : 'text-[#757575]'}`}>
                                            Track your progress toward field readiness.
                                        </p>
                                    </div>
                                    <div
                                        className={`rounded-[12px] md:rounded-[20px] p-[16px] border backdrop-blur-lg h-full ${
                                            isDark ? 'bg-[#2a2a2a] border-[#eeeeee1a]' : 'bg-white border-[#EEEEEE]'
                                        }`}
                                    >
                                        <div className="mb-[12px]">
                                            <h3 className={`text-[16px] font-semibold ${isDark ? 'text-white' : 'text-[#000000]'}`}>Pilot Goal: Onboarding</h3>
                                            <p className={`text-[12px] font-medium ${isDark ? 'text-white' : 'text-[#757575]'}`}>3 Practice Sessions per week</p>
                                        </div>
                                        <div className="flex flex-col items-center relative">
                                            <div className="relative w-[260px] h-[150px] overflow-hidden">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                                        <defs>
                                                            <linearGradient id="rechartsGradient" x1="0" y1="0" x2="1" y2="0">
                                                                <stop offset="0%" stopColor="#FF0300" />
                                                                <stop offset="100%" stopColor="#EFC76E" />
                                                            </linearGradient>
                                                        </defs>
                                                        <Pie
                                                            data={chartData}
                                                            cx="50%"
                                                            cy="100%"
                                                            startAngle={180}
                                                            endAngle={0}
                                                            innerRadius={115}
                                                            outerRadius={125}
                                                            paddingAngle={0}
                                                            dataKey="value"
                                                            stroke="none"
                                                            cornerRadius={10}
                                                        >
                                                            <Cell fill={gaugeValue === 100 ? '#059669' : gaugeValue >= 25 ? 'url(#rechartsGradient)' : '#FF0300'} />
                                                            <Cell fill={isDark ? '#232323' : '#EBEBEB'} />
                                                        </Pie>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                                <div className="absolute bottom-0 left-0 right-0 text-center pb-5">
                                                    <div className={`text-[36px] leading-[1] ${isDark ? 'text-white' : 'text-[#3F3F3F]'}`}>
                                                        {completedSessions}/{totalSessions}
                                                    </div>
                                                    <div className={`text-[12px] leading-[100%] ${isDark ? 'text-white' : 'text-[#010101]'}`}>sessions finished</div>
                                                </div>
                                            </div>
                                            <div
                                                className={`w-full p-[10px] md:px-[20px] md:py-[16px] rounded-[12px] md:rounded-[20px] ${
                                                    isDark ? 'bg-[#131313]' : 'bg-gradient-to-r from-white to-[#DCD6CE]'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <span className={`text-[12px] ${isDark ? 'text-white' : 'text-[#757575]'}`}>0%</span>
                                                    <p>
                                                        <div className={`text-[34px] font-semibold text-center ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                                            {sessionProgressPercentage}%
                                                        </div>
                                                        <div className={`text-[16px] text-center ${isDark ? 'text-white' : 'text-[#000000]'}`}>of the goal achieved</div>
                                                    </p>
                                                    <span className={`text-[12px] ${isDark ? 'text-white' : 'text-[#757575]'}`}>100%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skill Score Card */}
                                <div className="flex flex-col gap-[8px] md:gap-[14px]">
                                    <div
                                        className={`rounded-[12px] md:rounded-[20px] p-[16px] border backdrop-blur-lg ${
                                            isDark ? 'bg-[#2a2a2a] border-[#eeeeee1a]' : 'bg-white border-[#EEEEEE]'
                                        }`}
                                    >
                                        <div className="flex justify-between mb-[22px]">
                                            <div>
                                                <h3 className={`text-[16px] font-semibold ${isDark ? 'text-white' : 'text-[#000000]'}`}>Skill Evolution</h3>
                                                <p className={`text-[12px] font-medium ${isDark ? 'text-white' : 'text-[#757575]'}`}>
                                                    Tracks Skill Application over time
                                                </p>
                                            </div>
                                            <div>
                                                <div className={`text-[18px] md:text-[26px] text-right mb-0 leading-[80%] ${isDark ? 'text-white' : 'text-[#757575]'}`}>
                                                    72
                                                </div>
                                                <span className="text-[12px] text-[#A0AEC0] font-medium">
                                                    <span className="text-[#01B574] font-bold">(+15)</span> points
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <img src="/images/Graph.png" alt="Skill Score" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-[8px] md:gap-[14px]">
                                        <div
                                            className={`rounded-[12px] md:rounded-[20px] p-[16px] border backdrop-blur-lg ${
                                                isDark ? 'bg-[#2a2a2a] border-[#eeeeee1a]' : 'bg-white border-[#EEEEEE]'
                                            }`}
                                        >
                                            <h3 className={`text-[16px] font-semibold text-center mb-[20px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                                Total Points
                                            </h3>
                                            <div className={`text-[46px] text-center mb-[10px] ${isDark ? 'text-white' : 'text-[#000]'}`}>
                                                {/* 1,250 */}
                                                {totalPoints.toLocaleString()}
                                            </div>
                                            <TrendIndicator percentage={dashboardStats.totalPoints.percentage} flag={dashboardStats.totalPoints.flag} />
                                        </div>
                                        <div
                                            className={`rounded-[12px] md:rounded-[20px] p-[16px] border backdrop-blur-lg ${
                                                isDark ? 'bg-[#2a2a2a] border-[#eeeeee1a]' : 'bg-white border-[#EEEEEE]'
                                            }`}
                                        >
                                            <h3 className={`text-[16px] font-semibold text-center mb-[20px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                                Time Praticed
                                            </h3>
                                            <div className={`text-[46px] text-center mb-[10px] ${isDark ? 'text-white' : 'text-[#000]'}`}>
                                                {/* 24 */}
                                                {timePracticed}
                                                <span className="text-[10px] md:text-[16px]">min</span>
                                            </div>
                                            <TrendIndicator percentage={dashboardStats.totalPracticeTime.percentage} flag={dashboardStats.totalPracticeTime.flag} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Practice Selection Section */}
                    <div>
                        <h2 className={`text-[26px] md:text-[32px] font-bold mb-6 md:mb-8 text-center ${isDark ? 'text-white' : 'text-[#242424]'}`}>
                            Select your growth path for today
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                            {loading && (
                                <>
                                    <PracticeCardSkeleton />
                                    <PracticeCardSkeleton />
                                </>
                            )}

                            {!loading && practices.length > 0
                                ? practices.map(practice => <PracticeCard key={practice.id} practice={practice} isDark={isDark} />)
                                : !loading && (
                                      <div className="col-span-full flex flex-col items-center justify-center min-h-[300px] py-16 px-4 rounded-3xl border border-dashed border-[#9F9A9433]">
                                          <div className={`text-xl md:text-2xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#242424]'}`}>No practices found</div>
                                          <p className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                              There are currently no practices available for you.
                                          </p>
                                      </div>
                                  )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
