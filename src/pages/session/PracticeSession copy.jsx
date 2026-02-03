import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { LIVEAVATAR_LANG, LIVEAVATAR_MODE } from '../../enum/liveAvatar';
import { createLiveAvatarSessionToken, incrementConversation, startLiveAvatarSession, stopLiveAvatarSession } from '../../services/LiveAvatarService';
import { MicrophoneIcon, PauseIcon, PlayIcon, SendIcon, SpeechIcon, StopIcon, TranscriptUserIcon } from '../../common/Icons.jsx';
import { getUserFullName } from '../../utils/user.js';
import { getPracticeTypeDetails } from '../../services/PracticeService.js';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';

const PracticeSession = () => {
    const { isDark } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const params = useParams();
    const practice_id = params.practice_id;
    const context_id = params?.context_id;

    const [inputMode, setInputMode] = useState('voice');
    const [isPaused, setIsPaused] = useState(false);
    const [sessionToken, setSessionToken] = useState('');
    const [sessionId, setSessionId] = useState(''); // Session ID from DB
    const [liveAvatarSessionId, setLiveAvatarSessionId] = useState(''); // Session ID from LiveAvatar service
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMicEnabled, setIsMicEnabled] = useState(false);
    const [micPermissionGranted, setMicPermissionGranted] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [statusLog, setStatusLog] = useState([]);
    const [practice, setPractice] = useState(null);
    const [isEndingSession, setIsEndingSession] = useState(false);

    const videoRef = useRef(null);
    const videoContainerRef = useRef(null);
    const roomRef = useRef(null);
    const audioTrackRef = useRef(null);
    const videoTrackRef = useRef(null);
    const localAudioTrackRef = useRef(null);
    const videoElementRef = useRef(null);
    const chatContainerRef = useRef(null);
    const isStartingSessionRef = useRef(false);
    const hasStartedSessionRef = useRef(false);
    const sessionIdRef = useRef('');

    useEffect(() => {
        const fetchPracticeDetails = async () => {
            try {
                const res = await getPracticeTypeDetails(practice_id);
                const practice = res.data.data;
                setPractice(practice);
            } catch (error) {
                toast.error(error?.response?.data?.message || 'An error occurred while fetching practice details.');
            }
        };
        fetchPracticeDetails();
    }, [practice_id]);

    useEffect(() => {
        if (practice?.assessment?.id && !isStartingSessionRef.current) {
            handleStartSession();
        }
    }, [practice_id, practice]);

    useEffect(() => {
        if (window.LivekitClient) {
            addStatus('LiveKit SDK already loaded');
            return;
        }

        const script = document.createElement('script');
        script.id = 'livekit-sdk';
        script.src = 'https://cdn.jsdelivr.net/npm/livekit-client/dist/livekit-client.umd.min.js';
        script.async = true;
        script.onload = () => {
            addStatus('LiveKit SDK loaded');
        };
        script.onerror = () => {
            setError('Failed to load LiveKit SDK');
            addStatus('Error: Failed to load LiveKit SDK');
        };
        document.body.appendChild(script);

        return () => {};
    }, []);

    useEffect(() => {
        if (!isSessionActive) {
            setSessionDuration(0);
            return;
        }

        const startTime = Date.now();

        const timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            setSessionDuration(elapsed);

            // Auto-end session at 8 minutes (480 seconds)
            if (elapsed >= 480) {
                clearInterval(timerInterval);
                handleEndSession();
            }
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [isSessionActive]);

    useEffect(() => {
        return () => {
            cleanupTracks();
            if (roomRef.current) {
                roomRef.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const cleanupVideoElement = () => {
        if (videoElementRef.current) {
            try {
                videoElementRef.current.pause();
                videoElementRef.current.srcObject = null;
                videoElementRef.current.src = '';
                if (videoElementRef.current.parentNode) {
                    videoElementRef.current.parentNode.removeChild(videoElementRef.current);
                }
            } catch (e) {
                console.error('Error cleaning up video element:', e);
            }
            videoElementRef.current = null;
        }
    };

    const cleanupTracks = () => {
        if (videoTrackRef.current) {
            try {
                videoTrackRef.current.detach();
            } catch (e) {
                console.error('Error detaching video track:', e);
            }
            videoTrackRef.current = null;
        }

        if (audioTrackRef.current) {
            try {
                audioTrackRef.current.detach();
            } catch (e) {
                console.error('Error detaching audio track:', e);
            }
            audioTrackRef.current = null;
        }

        if (localAudioTrackRef.current) {
            try {
                localAudioTrackRef.current.stop();
            } catch (e) {
                console.error('Error stopping local audio:', e);
            }
            localAudioTrackRef.current = null;
        }

        cleanupVideoElement();
    };

    const enableMicrophone = async () => {
        // if (!roomRef.current || !isSessionActive) {
        //     alert('Please start a session first');
        //     return;
        // }
        try {
            addStatus('Requesting microphone access...');
            const audioTrack = await window.LivekitClient.createLocalAudioTrack({
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            });
            localAudioTrackRef.current = audioTrack;
            await roomRef.current.localParticipant.publishTrack(audioTrack);
            setIsMicEnabled(true);
            setMicPermissionGranted(true);

            addStatus('Microphone enabled and published to room');
        } catch (err) {
            addStatus(`Microphone error: ${err.message}`);
            toast.error(`Failed to enable microphone: ${err.message}`);
        }
    };

    const disableMicrophone = async () => {
        if (!localAudioTrackRef.current) return;
        try {
            addStatus('Disabling microphone...');
            if (roomRef.current && roomRef.current.localParticipant) {
                await roomRef.current.localParticipant.unpublishTrack(localAudioTrackRef.current);
            }
            localAudioTrackRef.current.stop();
            localAudioTrackRef.current = null;
            setIsMicEnabled(false);
            addStatus('Microphone disabled');
        } catch (err) {
            toast.error(`Failed to disable microphone`);
            addStatus(`Error disabling microphone: ${err.message}`);
        }
    };

    const handleStartSession = async () => {
        isStartingSessionRef.current = true;
        try {
            setIsLoading(true);
            setError('');
            setChatMessages([]);
            addStatus('Creating session token...');

            const payload = {
                mode: LIVEAVATAR_MODE.FULL,
                avatarId: practice?.avatar?.avatarId,
                contextId: context_id,
                language: LIVEAVATAR_LANG.ENGLISH,
                assessmentId: practice?.assessment?.id,
                voiceId: undefined,
                // avatarId: import.meta.env.VITE_LIVEAVTAR_ID,
                // contextId: import.meta.env.VITE_LIVEAVTAR_CONTEXT_ID,
            };

            const tokenRes = await createLiveAvatarSessionToken(payload);
            const tokenData = await tokenRes.data?.data;
            if (!tokenData.liveavatar.data) {
                throw new Error(tokenData.error || 'Failed to get session token');
            }

            const { sessionUniqueId: dbSessionId } = tokenData;
            const { session_id, session_token } = tokenData.liveavatar.data;
            setSessionToken(session_token);
            setSessionId(dbSessionId);
            sessionIdRef.current = dbSessionId;
            setLiveAvatarSessionId(session_id);
            addStatus(`Session token created of LiveAvatar: ${session_id}`);
            addStatus('Starting session...');

            const startRes = await startLiveAvatarSession({ sessionToken: session_token, sessionId: dbSessionId, liveAvatarSessionId: session_id });

            const startData = startRes.data?.data;

            if (!startData.data) {
                throw new Error(startData.error || 'Failed to start session');
            }

            const { livekit_url, livekit_client_token } = startData.data;
            addStatus('Session started successfully');

            if (!window.LivekitClient) {
                throw new Error('LiveKit SDK not loaded');
            }

            await connectToLiveKit(livekit_url, livekit_client_token);
            setIsSessionActive(true);
            // setIsMicEnabled(true);
            await enableMicrophone();
            addChatMessage("Hi there! Thanks for joining this session. I'm looking forward to our conversation today.", 'avatar');
        } catch (err) {
            const errorMsg = err.message || 'Failed to start session';
            setError(errorMsg);
            addStatus(`Error: ${errorMsg}`);
            toast.error(err?.response?.data?.message || errorMsg);
            hasStartedSessionRef.current = false;
        } finally {
            setIsLoading(false);
            isStartingSessionRef.current = false;
        }
    };

    const addStatus = message => {
        const timestamp = new Date().toLocaleTimeString();
        setStatusLog(prev => [...prev, `[${timestamp}] ${message}`]);
        console.log(`[${timestamp}] ${message}`);
    };

    const addChatMessage = (message, sender = 'user') => {
        const timestamp = new Date().toLocaleTimeString();
        setChatMessages(prev => [
            ...prev,
            {
                text: message,
                sender,
                timestamp,
            },
        ]);
    };

    const handleEndSession = async () => {
        if (!sessionToken) {
            toast.error('No active session to end');
            return;
        }

        try {
            setIsEndingSession(true);
            addStatus('Stopping session...');
            if (isMicEnabled && localAudioTrackRef.current) {
                await disableMicrophone();
            }
            cleanupTracks();

            if (roomRef.current) {
                try {
                    await roomRef.current.disconnect();
                } catch (e) {
                    console.error('Error disconnecting room:', e);
                }
                roomRef.current = null;
            }

            await stopLiveAvatarSession({ sessionToken, sessionId, liveAvatarSessionId });
            hasStartedSessionRef.current = false;
            isStartingSessionRef.current = false;
            navigate(`/session-feedback/${practice_id}/session/${sessionId}`);

            setSessionToken('');
            setSessionId('');
            setLiveAvatarSessionId('');
            setIsSessionActive(false);
            setMicPermissionGranted(false);
            setIsMicEnabled(false);
            addStatus('Session stopped');
        } catch (err) {
            toast.error('Failed to stop session');
            addStatus(`Error: ${err.message}`);
        } finally {
            setIsEndingSession(false);
        }
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !isSessionActive) return;

        if (inputMode !== 'text') {
            toast.error('Switch to Text mode to send messages');
            return;
        }

        const message = messageInput.trim();
        setMessageInput('');
        setIsSendingMessage(true);

        try {
            addStatus(`Sending message: ${message}`);
            if (!roomRef.current) {
                throw new Error('Room not connected');
            }

            const encoder = new TextEncoder();

            const event = {
                event_type: 'avatar.speak_response',
                text: message,
            };

            await roomRef.current.localParticipant.publishData(encoder.encode(JSON.stringify(event)), {
                reliable: true,
                topic: 'agent-control',
            });

            addStatus('Message sent successfully via LiveKit');
        } catch (err) {
            addStatus(`Error sending message: ${err.message}`);
            addChatMessage(`Error: ${err.message}`, 'system');
        } finally {
            setIsSendingMessage(false);
        }
    };

    const handleChatKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const connectToLiveKit = async (livekitUrl, livekitToken) => {
        try {
            addStatus('Connecting to LiveKit...');
            const LivekitClient = window.LivekitClient;

            roomRef.current = new LivekitClient.Room({
                adaptiveStream: true,
                dynacast: true,
            });

            roomRef.current.on(LivekitClient.RoomEvent.TrackSubscribed, (track, publication, participant) => {
                addStatus(`Track subscribed: ${track.kind} from ${participant.identity}`);

                if (track.kind === 'video') {
                    videoTrackRef.current = track;
                    cleanupVideoElement();

                    const videoElement = track.attach();

                    videoElement.style.position = 'absolute';
                    videoElement.style.inset = '0';
                    videoElement.style.width = '100%';
                    videoElement.style.height = '100%';
                    videoElement.style.objectFit = 'cover';
                    videoElement.style.objectPosition = '50% 20%';
                    videoElement.style.zIndex = '0';
                    videoElement.style.display = 'block';
                    videoElement.style.filter = 'hue-rotate(-90deg) saturate(0.2)';

                    videoElementRef.current = videoElement;

                    if (videoContainerRef.current) {
                        videoContainerRef.current.appendChild(videoElement);
                        addStatus('Video track attached');
                    }
                } else if (track.kind === 'audio') {
                    audioTrackRef.current = track;
                    track.attach();
                    addStatus('Audio track attached');
                }
            });

            roomRef.current.on(LivekitClient.RoomEvent.TrackUnsubscribed, track => {
                addStatus(`Track unsubscribed: ${track.kind}`);
                try {
                    track.detach();
                } catch (e) {
                    console.error('Error detaching track:', e);
                }
            });

            roomRef.current.on(LivekitClient.RoomEvent.Disconnected, reason => {
                addStatus(`Room disconnected: ${reason}`);
                cleanupTracks();
                setIsSessionActive(false);
                setIsMicEnabled(false);
                hasStartedSessionRef.current = false;
            });

            roomRef.current.on(LivekitClient.RoomEvent.ParticipantConnected, participant => {
                addStatus(`Participant connected: ${participant.identity}`);
            });

            roomRef.current.on(LivekitClient.RoomEvent.DataReceived, (payload, participant) => {
                try {
                    const data = new TextDecoder().decode(payload);
                    const message = JSON.parse(data);

                    // Enhanced logging to debug message types
                    console.log('LiveKit message received:', {
                        event_type: message.event_type,
                        type: message.type,
                        participant: participant?.identity,
                        message: message,
                    });

                    addStatus(`Data received: ${message.event_type || message.type || 'unknown'}`);

                    // Handle different event types
                    if (message.event_type === 'user.transcription') {
                        // User's speech transcript
                        if (message.text) {
                            addChatMessage(message.text, 'user');
                        }
                    } else if (message.event_type === 'user.speak_started') {
                        // User started speaking
                        addStatus('User started speaking');
                    } else if (message.event_type === 'user.speak_ended') {
                        // User stopped speaking
                        addStatus('User stopped speaking');
                    } else if (
                        message.type === 'text_response' ||
                        message.type === 'response' ||
                        message.type === 'agent_response' ||
                        message.event_type === 'avatar.start_talking' ||
                        message.event_type === 'avatar.stop_talking'
                    ) {
                        // Avatar/agent responses
                        if (message.text || message.content) {
                            addChatMessage(message.text || message.content, 'avatar');
                        }
                        if (message.event_type === 'avatar.start_talking') {
                            addStatus('Avatar started speaking');
                        } else if (message.event_type === 'avatar.stop_talking') {
                            addStatus('Avatar stopped speaking');
                        }
                    } else if (message.text || message.content) {
                        // Fallback for other text messages
                        addChatMessage(message.text || message.content, 'avatar');
                    }

                    console.log('sessionId', sessionId);
                    if (message.event_type === 'user.transcription' || message.event_type === 'avatar.stop_talking') {
                        // void incrementConversation(sessionId);
                        incrementConversation(sessionIdRef.current || sessionId);
                    }
                } catch (e) {
                    console.error('Error parsing data:', e);
                }
            });

            await roomRef.current.connect(livekitUrl, livekitToken);
            addStatus('Connected to LiveKit room');
        } catch (err) {
            toast.error('Failed to connect to LiveKit');
            addStatus(`LiveKit error: ${err.message}`);
            throw err;
        }
    };

    const formatDuration = seconds => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const switchInputMode = async mode => {
        if (!isSessionActive) return;
        if (mode === 'voice') {
            setInputMode('voice');
            // Enable mic if not already enabled
            if (!isMicEnabled) {
                await enableMicrophone();
            }
            addStatus('Switched to Voice mode');
        }

        if (mode === 'text') {
            setInputMode('text');
            // Disable mic if enabled
            if (isMicEnabled) {
                await disableMicrophone();
            }
            addStatus('Switched to Text mode');
        }
    };

    const getKnowledgeBaseNameByContextId = contextId => {
        const match = practice?.competencies?.find(item => item.knowledgeBase?.contextId === contextId);
        return match?.knowledgeBase?.name ?? null;
    };

    console.log(practice);

    // Check if timer is at or past 7 minutes (warning zone)
    const isInWarningZone = sessionDuration >= 420; // 7 minutes = 420 seconds
    const isTimerExpired = sessionDuration >= 480; // 8 minutes = 480 seconds

    return (
        <>
            <style>{`
        .live-transcript-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .live-transcript-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .live-transcript-scroll::-webkit-scrollbar-thumb {
          background-color: ${isDark ? '#4a4a4a' : '#cbd5e1'};
          border-radius: 3px;
        }
        .live-transcript-scroll::-webkit-scrollbar-thumb:hover {
          background-color: ${isDark ? '#5a5a5a' : '#94a3b8'};
        }
        
        @keyframes gentle-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.02);
          }
        }
        
        .timer-pulse {
          animation: gentle-pulse 2s ease-in-out infinite;
        }
      `}</style>
            <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#131313]' : 'bg-[#EAEAEA]'}`}>
                <div className="max-w-[1440px] mx-auto flex flex-col flex-1 w-full">
                    <Header />

                    <div className="p-[16px] md:p-[26px] pt-0 md:pt-0 flex-1">
                        <div
                            className={`rounded-[20px] border backdrop-blur-lg mb-[22px] md:mb-[12px] p-[24px] md:p-[20px] flex justify-between items-center flex-col md:flex-row ${
                                isDark ? 'bg-[#1b1b1b] border-[#ffffff1a]' : 'bg-white border-[#EEEEEE]'
                            }`}
                        >
                            <div className="mb-[22px] md:mb-0">
                                <h1
                                    className={`text-[28px] font-semibold mb-[12px] md:mb-0 text-center md:text-left leading-[38px] ${
                                        isDark ? 'text-white' : 'text-[#000000]'
                                    }`}
                                >
                                    {/* Practice Session */}
                                    Your mission for today - {practice?.name}
                                </h1>
                                <p className={`text-[12px] md:font-[14px] font-medium text-center md:text-left ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                                    Mastery in {getKnowledgeBaseNameByContextId(context_id)}
                                </p>
                            </div>

                            <div className="flex gap-[18px] md:gap-[14px] items-center flex-wrap justify-center">
                                <div
                                    className={`flex-1 px-[34px] md:px-[34px] py-3 md:py-[8px] rounded-full border transition-all duration-300 ${
                                        isInWarningZone ? 'border-[#F59E0B] bg-[#F59E0B] timer-pulse' : 'border-[#DCD6CE] bg-[#908471]'
                                    }`}
                                >
                                    <p className="text-[14px] md:text-[12px] text-white text-center font-semibold">{formatDuration(sessionDuration)}</p>
                                </div>

                                {/* Wrap it up message */}
                                {isInWarningZone && !isTimerExpired && (
                                    <div className="px-4 py-2 rounded-full bg-[#FEF3C7] border border-[#F59E0B] animate-pulse">
                                        <p className="text-[12px] font-semibold text-[#92400E] whitespace-nowrap">⏰ Wrap it up!</p>
                                    </div>
                                )}
                                {/* <div className="flex-1 px-[34px] md:px-[34px] py-3 md:py-[8px] rounded-full border border-[#DCD6CE] bg-[#908471]">
                                    <p className="text-[14px] md:text-[12px] text-white text-center">{formatDuration(sessionDuration)}</p>
                                </div> */}
                                <button
                                    onClick={handleEndSession}
                                    disabled={!isSessionActive}
                                    className={`px-4 md:px-[34px] py-3 md:py-[8px] rounded-full border border-[#FF0000] bg-[#930A0A] whitespace-nowrap flex items-center gap-2 text-[14px] md:text-[12px] text-white text-center ${
                                        !isSessionActive ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <StopIcon />
                                    {isEndingSession ? 'Ending Session...' : 'End Session'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-4 gap-[10px] md:gap-[14px] lg:items-stretch">
                            {/* Left Column - Video Player */}
                            <div className="lg:col-span-3 xl:col-span-3 flex flex-col h-full min-h-0">
                                {isLoading ? (
                                    <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-black aspect-video w-full h-full flex flex-col items-center justify-center backdrop-blur-sm bg-black/80">
                                        <div className="flex flex-col items-center gap-4">
                                            <Spinner />
                                            <div className="text-center">
                                                <p className="text-white text-lg font-semibold mb-1">Starting Session</p>
                                                <p className="text-gray-400 text-sm animate-pulse">Please wait while we connect you...</p>
                                            </div>

                                            {statusLog.length > 0 && (
                                                <div className="mt-4 px-6 py-3 bg-black/50 rounded-lg max-w-md hidden">
                                                    <p className="text-[#CAD3AC] text-xs text-center">{statusLog[statusLog.length - 1].split('] ')[1]}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div ref={videoContainerRef} className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-black aspect-video w-full h-full">
                                        {isSessionActive && (
                                            <>
                                                <div className="absolute bottom-2 md:bottom-2 right-0 left-0   z-20 flex items-center justify-center gap-2 md:gap-4">
                                                    <button
                                                        onClick={isMicEnabled ? disableMicrophone : enableMicrophone}
                                                        className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                                                            isMicEnabled ? 'bg-[#FEF3C7]' : 'bg-white/20 backdrop-blur-sm'
                                                        }`}
                                                    >
                                                        <MicrophoneIcon />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setIsPaused(!isPaused);
                                                            handleEndSession();
                                                        }}
                                                        disabled={!isSessionActive}
                                                        className={`w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#FF6B35] flex items-center justify-center transition-all hover:opacity-80 ${
                                                            !isSessionActive ? 'opacity-50 cursor-not-allowed' : ''
                                                        }`}
                                                    >
                                                        {isPaused ? <PauseIcon /> : <PlayIcon />}
                                                    </button>
                                                </div>

                                                <div className="absolute bottom-2 md:bottom-2 right-2 md:right-2 z-20">
                                                    <div className="relative inline-flex rounded-full overflow-hidden bg-[#000000cc] p-0.5 md:p-1">
                                                        <button
                                                            onClick={() => switchInputMode('voice')}
                                                            className={`px-3 py-1 md:px-5 md:py-2 font-bold text-xs md:text-base text-white transition-all duration-200 rounded-full ${
                                                                inputMode === 'voice' ? 'bg-[#CAD3AC]' : ''
                                                            }`}
                                                        >
                                                            Voice
                                                        </button>
                                                        <button
                                                            onClick={() => switchInputMode('text')}
                                                            className={`px-3 py-1 md:px-5 md:py-2 font-bold text-xs md:text-base text-white transition-all duration-200 rounded-full ${
                                                                inputMode === 'text' ? 'bg-[#CAD3AC]' : ''
                                                            }`}
                                                        >
                                                            Text
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className="lg:col-span-2 xl:col-span-1 flex flex-col space-y-[12px] h-full min-h-0">
                                <div
                                    className={`rounded-[12px] md:rounded-[20px] border p-4 md:p-6 flex flex-col flex-1 min-h-0 overflow-hidden ${
                                        isDark ? 'bg-[#1b1b1b] border-[#ffffff1a]' : 'bg-white border-[#EEEEEE]'
                                    }`}
                                >
                                    <h3 className={`text-[18px] font-semibold mb-[16px] md:mb-[24px] flex-shrink-0 ${isDark ? 'text-white' : 'text-[#000000]'}`}>
                                        Live transcript
                                    </h3>
                                    <div
                                        className="space-y-3 md:space-y-4 overflow-y-auto flex-1 min-h-0 pr-2 live-transcript-scroll"
                                        ref={chatContainerRef}
                                        style={{
                                            maxHeight: '430px',
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: isDark ? '#4a4a4a transparent' : '#cbd5e1 transparent',
                                        }}
                                    >
                                        {chatMessages.length === 0 ? (
                                            <div className="flex items-start gap-[6px]">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2"></div>
                                                    <div
                                                        className={`text-[12px] leading-relaxed rounded-[12px] p-[6px] ${
                                                            isDark ? 'text-[#ffffff] bg-[#131313]' : 'text-[#475569] bg-[#F8FAFC]'
                                                        }`}
                                                    >
                                                        <p className="mb-2 list-decimal list-inside space-y-1 ml-2 mt-2">No messages yet. Start the conversation!</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            chatMessages.map((msg, index) => {
                                                return (
                                                    <div className="flex items-start gap-[6px]" key={index}>
                                                        <div className="w-[28px] h-[28px] md:w-[24px] md:h-[24px] rounded-full bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                                                            <TranscriptUserIcon />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className={`font-semibold text-[12px] ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                                                                    {msg.sender === 'avatar'
                                                                        ? practice?.avatar?.name
                                                                        : msg.sender === 'user'
                                                                        ? getUserFullName(user)
                                                                        : 'System'}
                                                                </span>
                                                                <span className={`text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#94A3B8]'}`}>{msg.timestamp}</span>
                                                            </div>
                                                            <div
                                                                className={`text-[12px] leading-relaxed rounded-[12px] p-[6px] ${
                                                                    isDark ? 'text-[#ffffff] bg-[#131313]' : 'text-[#475569] bg-[#F8FAFC]'
                                                                }`}
                                                            >
                                                                <p className="mb-2 list-decimal list-inside space-y-1 ml-2">{msg.text}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                <div className="relative flex-shrink-0">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={e => setMessageInput(e.target.value)}
                                        onKeyPress={handleChatKeyPress}
                                        disabled={!isSessionActive || isSendingMessage || inputMode === 'voice'}
                                        // placeholder="Message Sarah Chen..."
                                        placeholder={inputMode === 'voice' ? 'Listening...' : 'Type your message...'}
                                        className={`w-full px-4 md:px-6 py-3 md:py-4 rounded-full border text-[12px] ${
                                            isDark
                                                ? 'bg-[#1b1b1b] border-[#ffffff1a] text-white placeholder-[#757575]'
                                                : 'bg-white border-[#EEEEEE] text-[#475569] placeholder-[#757575]'
                                        } focus:outline-none focus:ring-2 focus:ring-[#908371] pr-24 md:pr-28 ${
                                            !isSessionActive || isSendingMessage ? 'opacity-50 cursor-not-allowed' : ''
                                        } `}
                                    />
                                    <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 md:gap-3">
                                        <button
                                            className="p-2 hover:opacity-70 transition-opacity"
                                            disabled={!isSessionActive || !messageInput.trim() || isSendingMessage}
                                        >
                                            <SpeechIcon />
                                        </button>
                                        <button
                                            disabled={!isSessionActive || !messageInput.trim() || isSendingMessage}
                                            onClick={handleSendMessage}
                                            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity ${
                                                isDark ? 'bg-white' : 'bg-black'
                                            } ${
                                                !isSessionActive || !messageInput.trim() || isSendingMessage
                                                    ? 'opacity-30 cursor-not-allowed'
                                                    : 'opacity-100 hover:opacity-80'
                                            }`}
                                        >
                                            {isSendingMessage ? <Spinner height={5} width={5} /> : <SendIcon isDark={isDark} />}
                                        </button>
                                    </div>
                                </div>

                                {/* <div className="rounded-[12px] md:rounded-[20px] border border-[#908471] p-[24px] bg-[#DCD6CE] flex-shrink-0">
                                    <h3 className="text-[20px] md:text-[18px] font-semibold text-[#000000] mb-[6px]">Session Tips</h3>
                                    <ul className="space-y-1 list-disc list-inside">
                                        <li className="text-[14px] md:text-[12px] font-light text-[#000000]">Speak naturally and clearly</li>
                                        <li className="text-[14px] md:text-[12px] font-light text-[#000000]">Take your time to think before responding</li>
                                        <li className="text-[14px] md:text-[12px] font-light text-[#000000]">Focus on understanding customer needs</li>
                                    </ul>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PracticeSession;
