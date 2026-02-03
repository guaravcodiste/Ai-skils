import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import Button from '../components/Button';
import tunnel from '/images/login-image.png';

const WelcomeArea = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [isMicTestActive, setIsMicTestActive] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [barHeights, setBarHeights] = useState(Array(12).fill(8));
    const [micStatus, setMicStatus] = useState('pending');
    const [networkStatus, setNetworkStatus] = useState('pending');
    const [browserStatus, setBrowserStatus] = useState('pending');
    const [latency, setLatency] = useState(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const microphoneRef = useRef(null);
    const animationFrameRef = useRef(null);
    const visualizerIntervalRef = useRef(null);

    useEffect(() => {
        // Check system statuses on mount
        checkMicrophoneAccess();
        checkNetworkConnection();
        checkBrowserCompatibility();
    }, []);

    useEffect(() => {
        if (isMicTestActive) {
            startMicTest();
        } else {
            stopMicTest();
        }

        return () => {
            stopMicTest();
        };
    }, [isMicTestActive]);

    useEffect(() => {
        if (!isMicTestActive) {
            setBarHeights(Array(12).fill(8));
            if (visualizerIntervalRef.current) {
                clearInterval(visualizerIntervalRef.current);
                visualizerIntervalRef.current = null;
            }
            return;
        }

        visualizerIntervalRef.current = setInterval(() => {
            if (analyserRef.current) {
                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteFrequencyData(dataArray);

                const newHeights = Array.from({ length: 12 }, (_, i) => {
                    const index = Math.floor((i / 12) * dataArray.length);
                    const value = dataArray[index] || 0;
                    const normalizedValue = (value / 255) * 40;
                    return Math.max(8, Math.min(40, normalizedValue));
                });

                setBarHeights(newHeights);
            } else {
                // Fallback animation when no audio input
                const newHeights = Array.from({ length: 12 }, (_, i) => {
                    const baseHeight = 8;
                    const variation = Math.sin(Date.now() / 200 + i * 0.5) * 10;
                    return Math.max(8, baseHeight + variation);
                });
                setBarHeights(newHeights);
            }
        }, 50);

        return () => {
            if (visualizerIntervalRef.current) {
                clearInterval(visualizerIntervalRef.current);
                visualizerIntervalRef.current = null;
            }
        };
    }, [isMicTestActive]);

    const checkMicrophoneAccess = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicStatus('success');
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            setMicStatus('error');
        }
    };

    const checkNetworkConnection = async () => {
        try {
            const startTime = performance.now();
            await fetch('https://www.google.com/favicon.ico', {
                mode: 'no-cors',
                cache: 'no-cache',
            });
            const endTime = performance.now();
            const calculatedLatency = Math.round(endTime - startTime);
            setLatency(calculatedLatency);
            setNetworkStatus('success');
        } catch (error) {
            setNetworkStatus('error');
        }
    };

    const checkBrowserCompatibility = () => {
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        const isEdge = /Edg/.test(navigator.userAgent);
        const isSupported = isChrome || isEdge;
        setBrowserStatus(isSupported ? 'success' : 'warning');
    };

    const startMicTest = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            microphoneRef.current = stream;

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateAudioLevel = () => {
                if (analyserRef.current) {
                    analyserRef.current.getByteFrequencyData(dataArray);
                    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                    setAudioLevel(average);
                    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
                }
            };

            updateAudioLevel();
        } catch (error) {
            console.error('Error accessing microphone:', error);
            setIsMicTestActive(false);
        }
    };

    const stopMicTest = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        if (visualizerIntervalRef.current) {
            clearInterval(visualizerIntervalRef.current);
            visualizerIntervalRef.current = null;
        }

        if (microphoneRef.current) {
            microphoneRef.current.getTracks().forEach(track => track.stop());
            microphoneRef.current = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        analyserRef.current = null;
        setAudioLevel(0);
        setBarHeights(Array(12).fill(8));
    };

    const handleMicTestClick = () => {
        setIsMicTestActive(!isMicTestActive);
    };

    const getLatencyStatus = latency => {
        if (latency < 50) return 'Excellent';
        if (latency < 100) return 'Good';
        if (latency < 200) return 'Fair';
        return 'Poor';
    };

    const renderCheckIcon = status => {
        if (status === 'success') {
            return (
                <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M21.5 4.03125C18.045 4.03125 14.6676 5.05577 11.7949 6.97527C8.92217 8.89476 6.68316 11.623 5.36099 14.815C4.03882 18.007 3.69288 21.5194 4.36692 24.908C5.04095 28.2966 6.70469 31.4092 9.14774 33.8523C11.5908 36.2953 14.7034 37.9591 18.092 38.6331C21.4806 39.3071 24.993 38.9612 28.185 37.639C31.377 36.3169 34.1053 34.0778 36.0247 31.2051C37.9442 28.3324 38.9688 24.955 38.9688 21.5C38.9639 16.8685 37.1218 12.4281 33.8469 9.15313C30.5719 5.87816 26.1315 4.03614 21.5 4.03125ZM29.1695 18.4195L19.7632 27.8257C19.6384 27.9506 19.4902 28.0498 19.3271 28.1174C19.164 28.185 18.9891 28.2198 18.8125 28.2198C18.6359 28.2198 18.4611 28.185 18.2979 28.1174C18.1348 28.0498 17.9866 27.9506 17.8618 27.8257L13.8306 23.7945C13.5784 23.5423 13.4368 23.2003 13.4368 22.8438C13.4368 22.4872 13.5784 22.1452 13.8306 21.893C14.0827 21.6409 14.4247 21.4993 14.7813 21.4993C15.1378 21.4993 15.4798 21.6409 15.732 21.893L18.8125 24.9753L27.2681 16.518C27.3929 16.3932 27.5411 16.2942 27.7042 16.2266C27.8674 16.159 28.0422 16.1243 28.2188 16.1243C28.3953 16.1243 28.5702 16.159 28.7333 16.2266C28.8964 16.2942 29.0446 16.3932 29.1695 16.518C29.2943 16.6429 29.3933 16.7911 29.4609 16.9542C29.5285 17.1174 29.5633 17.2922 29.5633 17.4688C29.5633 17.6453 29.5285 17.8201 29.4609 17.9833C29.3933 18.1464 29.2943 18.2946 29.1695 18.4195Z"
                        fill="#343330"
                    />
                </svg>
            );
        }
        if (status === 'pending') {
            return <div className="w-6 h-6 rounded-full border-2 border-gray-400 animate-pulse" />;
        }
        return (
            <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M21.5 4.03125C18.045 4.03125 14.6676 5.05577 11.7949 6.97527C8.92217 8.89476 6.68316 11.623 5.36099 14.815C4.03882 18.007 3.69288 21.5194 4.36692 24.908C5.04095 28.2966 6.70469 31.4092 9.14774 33.8523C11.5908 36.2953 14.7034 37.9591 18.092 38.6331C21.4806 39.3071 24.993 38.9612 28.185 37.639C31.377 36.3169 34.1053 34.0778 36.0247 31.2051C37.9442 28.3324 38.9688 24.955 38.9688 21.5C38.9639 16.8685 37.1218 12.4281 33.8469 9.15313C30.5719 5.87816 26.1315 4.03614 21.5 4.03125ZM29.1695 18.4195L19.7632 27.8257C19.6384 27.9506 19.4902 28.0498 19.3271 28.1174C19.164 28.185 18.9891 28.2198 18.8125 28.2198C18.6359 28.2198 18.4611 28.185 18.2979 28.1174C18.1348 28.0498 17.9866 27.9506 17.8618 27.8257L13.8306 23.7945C13.5784 23.5423 13.4368 23.2003 13.4368 22.8438C13.4368 22.4872 13.5784 22.1452 13.8306 21.893C14.0827 21.6409 14.4247 21.4993 14.7813 21.4993C15.1378 21.4993 15.4798 21.6409 15.732 21.893L18.8125 24.9753L27.2681 16.518C27.3929 16.3932 27.5411 16.2942 27.7042 16.2266C27.8674 16.159 28.0422 16.1243 28.2188 16.1243C28.3953 16.1243 28.5702 16.159 28.7333 16.2266C28.8964 16.2942 29.0446 16.3932 29.1695 16.518C29.2943 16.6429 29.3933 16.7911 29.4609 16.9542C29.5285 17.1174 29.5633 17.2922 29.5633 17.4688C29.5633 17.6453 29.5285 17.8201 29.4609 17.9833C29.3933 18.1464 29.2943 18.2946 29.1695 18.4195Z"
                    fill="#29C450"
                />
            </svg>
        );
    };

    const renderAudioVisualizer = () => {
        return (
            <div className="flex items-end justify-center gap-1.5 h-12 mt-3">
                {barHeights.map((height, index) => (
                    <div key={index} className="w-1.5 bg-white rounded-full transition-all duration-100 ease-out" style={{ height: `${height}px` }} />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[url('/images/WelcomeArea-bg-image.png')] bg-cover bg-center">
            <div className="px-[44px] py-[16px] flex justify-between items-center flex-col md:flex-row gap-[16px]">
                <img src="/images/logo-text.png" alt="Logo" />
                <ThemeToggle bgColor="bg-[#E2E2E2]" />
            </div>

            <div className="relative w-full max-w-[655px] mx-auto px-[13px] pb-[50px]">
                {/* Main Card */}
                <div className={`relative rounded-[20px] p-4 !pb-[36px] md:p-8 lg:p-12 lg:!pb-[28px] backdrop-blur-lg ${isDark ? 'bg-[#131313]' : 'bg-[#FFFFFF]/90'}`}>
                    {/* Welcome Area Header */}
                    <div className="mb-[34px] mx-auto">
                        <h2 className={`text-2xl md:text-3xl lg:text-[38px] text-center font-semibold mb-[4px] ${isDark ? 'text-white' : 'text-[#242424]'}`}>
                            Welcome to AI Skill Builder
                        </h2>
                        <p className={`text-sm md:text-[22px] font-medium text-center ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                            Your personal sales training coach
                        </p>
                    </div>

                    {/* Microphone Test Section */}
                    <div className="mb-[36px]">
                        <img src="/images/video.png" alt="Welcome Area" />
                    </div>

                    {/* System Check Items */}
                    <div className="space-y-4 mb-[22px] lg:mb-8">
                        <div
                            className={`flex items-start gap-4 p-4 rounded-[16px] ${
                                isDark ? (micStatus === 'success' ? 'bg-[#232323]' : 'bg-[#232323]') : micStatus === 'success' ? 'bg-[#DCD6CE]' : 'bg-[#DCD6CE]'
                            }`}
                        >
                            <div
                                className={`w-[46px] h-[46px] rounded-full border border-dashed flex justify-center items-center text-[36px] font-semibold ${
                                    isDark ? 'border-white text-white' : 'border-[#000] text-[#000]'
                                }`}
                            >
                                1
                            </div>
                            <div className="flex-1 max-w-[420px]">
                                <h3 className={`font-semibold text-[15px] mb-[3px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>Choose your practice</h3>
                                <p className={`text-[12px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                    Select from Value Selling or Product Expert scenarios tailored to your learning goals.
                                </p>
                            </div>
                        </div>

                        <div
                            className={`flex items-start gap-4 p-4 rounded-[16px] ${
                                isDark ? (micStatus === 'success' ? 'bg-[#232323]' : 'bg-[#232323]') : micStatus === 'success' ? 'bg-[#DCD6CE]' : 'bg-[#DCD6CE]'
                            }`}
                        >
                            <div
                                className={`w-[46px] h-[46px] rounded-full border border-dashed flex justify-center items-center text-[36px] font-semibold ${
                                    isDark ? 'border-white text-white' : 'border-[#000] text-[#000]'
                                }`}
                            >
                                2
                            </div>
                            <div className="flex-1 max-w-[420px]">
                                <h3 className={`font-semibold text-[15px] mb-[3px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>Practice with AI</h3>
                                <p className={`text-[12px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                    Have a real conversation with our AI avatar. Speak naturally, it will respond just like a real customer.
                                </p>
                            </div>
                        </div>

                        <div
                            className={`flex items-start gap-4 p-4 rounded-[16px] ${
                                isDark ? (micStatus === 'success' ? 'bg-[#232323]' : 'bg-[#232323]') : micStatus === 'success' ? 'bg-[#DCD6CE]' : 'bg-[#DCD6CE]'
                            }`}
                        >
                            <div
                                className={`w-[46px] h-[46px] rounded-full border border-dashed flex justify-center items-center text-[36px] font-semibold ${
                                    isDark ? 'border-white text-white' : 'border-[#000] text-[#000]'
                                }`}
                            >
                                3
                            </div>
                            <div className="flex-1 max-w-[420px]">
                                <h3 className={`font-semibold text-[15px] mb-[3px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>Get instant feedback</h3>
                                <p className={`text-[12px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                    After each session, receive personalized coaching tips to improve your skills.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Statement */}
                    <div className="flex flex-col gap-1 mb-[22px] lg:mb-8">
                        <div>
                            <p className={`font-light text-[15px] text-center ${isDark ? 'text-white' : 'text-[#757575]'}`}>
                                Your practice sessions are private and never recorded.
                            </p>
                        </div>
                    </div>

                    {/* Continue Button */}
                    <div className="flex justify-center">
                        <Button onClick={() => navigate('/dashboard')}>Get Started</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeArea;
