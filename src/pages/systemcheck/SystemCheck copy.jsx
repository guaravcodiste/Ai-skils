import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import Button from '../../components/Button';
import tunnel from '/images/login-image.png';

const SystemCheck = () => {
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

    useEffect(() => {
        console.log('isMicTestActive:', isMicTestActive, 'audioLevel:', audioLevel);
        if (!isMicTestActive) return;

        if (audioLevel > 10) {
            // threshold, adjust if needed
            setMicStatus('success');
        } else {
            setMicStatus('pending');
        }
    }, [audioLevel]);

    // const startMicTest = async () => {
    //     try {
    //         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    //         microphoneRef.current = stream;

    //         const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    //         audioContextRef.current = audioContext;

    //         const analyser = audioContext.createAnalyser();
    //         analyser.fftSize = 256;
    //         analyserRef.current = analyser;

    //         const source = audioContext.createMediaStreamSource(stream);
    //         source.connect(analyser);

    //         const dataArray = new Uint8Array(analyser.frequencyBinCount);

    //         const updateAudioLevel = () => {
    //             if (analyserRef.current) {
    //                 analyserRef.current.getByteFrequencyData(dataArray);
    //                 const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    //                 setAudioLevel(average);
    //                 animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    //             }
    //         };

    //         updateAudioLevel();
    //     } catch (error) {
    //         console.error('Error accessing microphone:', error);
    //         setIsMicTestActive(false);
    //     }
    // };

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

            let detectionCounter = 0;
            const updateAudioLevel = () => {
                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setAudioLevel(average);

                // Update bar heights
                const newHeights = Array.from({ length: 12 }, (_, i) => {
                    const index = Math.floor((i / 12) * dataArray.length);
                    const value = dataArray[index] || 0;
                    return Math.max(8, Math.min(40, (value / 255) * 40));
                });
                setBarHeights(newHeights);

                // Mic detection logic
                if (average > 10) detectionCounter += 1; // arbitrary threshold
                if (detectionCounter > 5) setMicStatus('success'); // after few frames of sound
                animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
            };

            updateAudioLevel();
        } catch (error) {
            console.error('Error accessing microphone:', error);
            setMicStatus('error');
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

    const isSystemReady = micStatus === 'success' && networkStatus === 'success' && browserStatus === 'success';

    return (
        <div className="min-h-screen bg-[url('/images/SystemCheck-bg-image.png')] bg-cover bg-right">
            <div className="px-[44px] py-[16px] flex justify-between items-center flex-col md:flex-row gap-[16px]">
                <img src="/images/logo-text.png" alt="Logo" />
                <ThemeToggle />
            </div>

            <div className="relative w-full max-w-[655px] mx-auto px-[13px] pb-[50px]">
                {/* Main Card */}
                <div className={`relative rounded-[20px] p-4 md:p-8 lg:p-12 backdrop-blur-lg ${isDark ? 'bg-[#131313]' : 'bg-[#FFFFFF]/90'}`}>
                    {/* System Check Header */}
                    <div className="mb-8 max-w-[522px] mx-auto">
                        <p className={`text-sm md:text-[22px] font-medium text-center mb-2 ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>System Check</p>
                        <h2 className={`text-2xl md:text-3xl lg:text-[38px] text-center font-semibold ${isDark ? 'text-white' : 'text-[#242424]'}`}>
                            Let's make sure everything is ready for your session.
                        </h2>
                    </div>

                    {/* Microphone Test Section */}
                    <div className="mb-[36px]">
                        <p className={`ttext-sm md:text-[22px] font-medium text-center mb-[20px] ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                            Click to test your microphone
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={handleMicTestClick}
                                className={`w-full p-[20px] rounded-[20px] transition-all max-w-[460px] ${
                                    isDark ? 'bg-black text-white hover:bg-gray-900' : 'bg-black text-white hover:bg-gray-800'
                                }`}
                            >
                                <div className="flex flex-col gap-[6px] justify-center items-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="14" cy="14" r="14" fill="white" />
                                            <path
                                                d="M13.9999 17.4075C14.8057 17.4066 15.5783 17.0861 16.1482 16.5163C16.718 15.9465 17.0385 15.1738 17.0393 14.368V10.3154C17.0393 9.50923 16.7191 8.73613 16.1491 8.16612C15.5791 7.59611 14.806 7.27588 13.9999 7.27588C13.1938 7.27588 12.4207 7.59611 11.8506 8.16612C11.2806 8.73613 10.9604 9.50923 10.9604 10.3154V14.368C10.9612 15.1738 11.2817 15.9465 11.8516 16.5163C12.4214 17.0861 13.194 17.4066 13.9999 17.4075ZM11.9736 10.3154C11.9736 9.77794 12.187 9.26254 12.567 8.88253C12.9471 8.50252 13.4625 8.28904 13.9999 8.28904C14.5373 8.28904 15.0527 8.50252 15.4327 8.88253C15.8127 9.26254 16.0262 9.77794 16.0262 10.3154V14.368C16.0262 14.9054 15.8127 15.4208 15.4327 15.8008C15.0527 16.1808 14.5373 16.3943 13.9999 16.3943C13.4625 16.3943 12.9471 16.1808 12.567 15.8008C12.187 15.4208 11.9736 14.9054 11.9736 14.368V10.3154ZM14.5065 19.4084V21.4601C14.5065 21.5944 14.4531 21.7233 14.3581 21.8183C14.2631 21.9133 14.1342 21.9667 13.9999 21.9667C13.8655 21.9667 13.7367 21.9133 13.6417 21.8183C13.5467 21.7233 13.4933 21.5944 13.4933 21.4601V19.4084C12.2443 19.2814 11.0869 18.6957 10.2448 17.7646C9.40262 16.8336 8.93562 15.6234 8.93408 14.368C8.93408 14.2336 8.98745 14.1048 9.08246 14.0098C9.17746 13.9148 9.30631 13.8614 9.44066 13.8614C9.57501 13.8614 9.70386 13.9148 9.79887 14.0098C9.89387 14.1048 9.94724 14.2336 9.94724 14.368C9.94724 15.4428 10.3742 16.4736 11.1342 17.2336C11.8942 17.9936 12.925 18.4206 13.9999 18.4206C15.0747 18.4206 16.1055 17.9936 16.8655 17.2336C17.6255 16.4736 18.0525 15.4428 18.0525 14.368C18.0525 14.2336 18.1059 14.1048 18.2009 14.0098C18.2959 13.9148 18.4247 13.8614 18.5591 13.8614C18.6934 13.8614 18.8223 13.9148 18.9173 14.0098C19.0123 14.1048 19.0657 14.2336 19.0657 14.368C19.0641 15.6234 18.5971 16.8336 17.755 17.7646C16.9128 18.6957 15.7554 19.2814 14.5065 19.4084Z"
                                                fill="#908471"
                                            />
                                        </svg>
                                        <span className="font-semibold text-[20px]">{isMicTestActive ? 'Stop Mic Test' : 'Start Mic Test'}</span>
                                    </div>
                                    {isMicTestActive && renderAudioVisualizer()}
                                </div>
                                {isMicTestActive && <p className="text-[14px] mt-2 text-center text-white">Waiting for audio input...</p>}
                            </button>
                        </div>
                    </div>

                    {/* System Check Items */}
                    <div className="space-y-4 mb-8">
                        {/* Microphone Access */}
                        <div
                            className={`flex items-start gap-4 p-4 rounded-[16px] ${
                                isDark ? (micStatus === 'success' ? 'bg-[#232323]' : 'bg-[#232323]') : micStatus === 'success' ? 'bg-[#DCD6CE]' : 'bg-[#DCD6CE]'
                            }`}
                        >
                            <div className={`flex-shrink-0 ${micStatus === 'success' ? 'text-green-500' : micStatus === 'pending' ? 'text-gray-400' : 'text-red-500'}`}>
                                {renderCheckIcon(micStatus)}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-semibold text-[15px] mb-[3px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>Microphone Access</h3>
                                <p className={`text-[12px] ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                    {micStatus === 'success'
                                        ? 'Voice Activity Detection ready'
                                        : micStatus === 'pending'
                                        ? 'Checking microphone access...'
                                        : 'Microphone access denied'}
                                </p>
                            </div>
                        </div>

                        {/* Network Connection */}
                        <div
                            className={`flex items-start gap-4 p-4 rounded-[16px] ${
                                isDark ? (networkStatus === 'success' ? 'bg-[#232323]' : 'bg-[#232323]') : networkStatus === 'success' ? 'bg-[#DCD6CE]' : 'bg-[#DCD6CE]'
                            }`}
                        >
                            <div
                                className={`flex-shrink-0 ${
                                    networkStatus === 'success' ? 'text-green-500' : networkStatus === 'pending' ? 'text-gray-400' : 'text-red-500'
                                }`}
                            >
                                {renderCheckIcon(networkStatus)}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-semibold text-base md:text-lg mb-1 ${isDark ? 'text-white' : 'text-[#242424]'}`}>Network Connection</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {networkStatus === 'success' && latency
                                        ? `Latency: ${latency}ms (${getLatencyStatus(latency)})`
                                        : networkStatus === 'pending'
                                        ? 'Checking network connection...'
                                        : 'Network connection failed'}
                                </p>
                            </div>
                        </div>

                        {/* Browser Compatibility */}
                        <div
                            className={`flex items-start gap-4 p-4 rounded-[16px] ${
                                isDark ? (browserStatus === 'success' ? 'bg-[#232323]' : 'bg-[#232323]') : browserStatus === 'success' ? 'bg-[#DCD6CE]' : 'bg-[#DCD6CE]'
                            }`}
                        >
                            <div
                                className={`flex-shrink-0 ${
                                    browserStatus === 'success' ? 'text-green-500' : browserStatus === 'pending' ? 'text-gray-400' : 'text-yellow-500'
                                }`}
                            >
                                {renderCheckIcon(browserStatus)}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-semibold text-base md:text-lg mb-1 ${isDark ? 'text-white' : 'text-[#242424]'}`}>Browser Compatibility</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {browserStatus === 'success'
                                        ? 'Chrome supported'
                                        : browserStatus === 'pending'
                                        ? 'Checking browser compatibility...'
                                        : 'Browser may not be fully supported'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Statement */}
                    <div className="flex flex-col gap-1 mb-8">
                        <div className="flex justify-center items-center">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13 2.5H3C2.73478 2.5 2.48043 2.60536 2.29289 2.79289C2.10536 2.98043 2 3.23478 2 3.5V7C2 10.295 3.595 12.2919 4.93313 13.3869C6.37437 14.5656 7.80813 14.9656 7.87063 14.9825C7.95656 15.0059 8.04719 15.0059 8.13313 14.9825C8.19563 14.9656 9.6275 14.5656 11.0706 13.3869C12.405 12.2919 14 10.295 14 7V3.5C14 3.23478 13.8946 2.98043 13.7071 2.79289C13.5196 2.60536 13.2652 2.5 13 2.5ZM10.855 6.85375L7.355 10.3538C7.30856 10.4002 7.25342 10.4371 7.19272 10.4623C7.13202 10.4874 7.06696 10.5004 7.00125 10.5004C6.93554 10.5004 6.87048 10.4874 6.80978 10.4623C6.74908 10.4371 6.69394 10.4002 6.6475 10.3538L5.1475 8.85375C5.05368 8.75993 5.00097 8.63268 5.00097 8.5C5.00097 8.36732 5.05368 8.24007 5.1475 8.14625C5.24132 8.05243 5.36857 7.99972 5.50125 7.99972C5.63393 7.99972 5.76118 8.05243 5.855 8.14625L7 9.29313L10.1462 6.14625C10.1927 6.09979 10.2479 6.06294 10.3086 6.0378C10.3692 6.01266 10.4343 5.99972 10.5 5.99972C10.5657 5.99972 10.6308 6.01266 10.6914 6.0378C10.7521 6.06294 10.8073 6.09979 10.8538 6.14625C10.9002 6.1927 10.9371 6.24786 10.9622 6.30855C10.9873 6.36925 11.0003 6.4343 11.0003 6.5C11.0003 6.5657 10.9873 6.63075 10.9622 6.69145C10.9371 6.75214 10.9002 6.8073 10.8538 6.85375H10.855Z"
                                    fill="#343330"
                                />
                            </svg>
                            <h3 className={`font-medium text-[15px] ${isDark ? 'text-white' : 'text-[#757575]'}`}>Privacy Protected</h3>
                        </div>
                        <div>
                            <p className={`font-light text-[15px] text-center ${isDark ? 'text-white' : 'text-[#757575]'}`}>No recordings retained. Practice is safe.</p>
                        </div>
                    </div>

                    {/* Continue Button */}
                    <div className="flex justify-center">
                        <Button disabled={!isSystemReady} className={`${!isSystemReady ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => navigate('/welcomeArea')}>
                            Continue to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemCheck;
