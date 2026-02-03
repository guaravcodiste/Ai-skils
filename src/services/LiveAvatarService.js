import AxiosRequest from '../utils/AxiosRequest';

const createLiveAvatarSessionToken = async payload => {
    const response = await AxiosRequest.post('/live-avatar/session-token', payload);
    return response;
};

const startLiveAvatarSession = async payload => {
    const response = await AxiosRequest.post('/live-avatar/start-session', payload);
    return response;
};

const stopLiveAvatarSession = async payload => {
    const response = await AxiosRequest.post('/live-avatar/stop-session', payload);
    return response;
};

const getSessionEvalutedResult = async session_id => {
    const response = await AxiosRequest.get(`/live-avatar/session/${session_id}/ai-result`);
    return response;
};

const saveSessionRating = async (session_id, payload) => {
    const response = await AxiosRequest.post(`/live-avatar/session/${session_id}/rating`, payload);
    return response;
};

const saveSessionMessage = async (payload, session_id) => {
    const response = await AxiosRequest.post(`/live-avatar/session/${session_id}/message`, payload);
    return response;
};

const incrementConversation = async session_id => {
    const response = await AxiosRequest.post(`/live-avatar/session/${session_id}/conversation`);
    return response;
};

export {
    createLiveAvatarSessionToken,
    startLiveAvatarSession,
    stopLiveAvatarSession,
    getSessionEvalutedResult,
    saveSessionRating,
    saveSessionMessage,
    incrementConversation,
};
