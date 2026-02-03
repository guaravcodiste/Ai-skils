import AxiosRequest from '../utils/AxiosRequest';

const login = async payload => {
    const response = await AxiosRequest.post('/auth/login', payload);
    return response;
};

const forgetPassword = async payload => {
    const response = await AxiosRequest.post('/auth/forgot-password', payload);
    return response;
};

const resetPassword = async payload => {
    const response = await AxiosRequest.post('/auth/reset-password', payload);
    return response;
};

const verifyToken = async token => {
    const response = await AxiosRequest.get(`/auth/verify-token/${token}`);
    return response;
};

const setPassword = async payload => {
    const response = await AxiosRequest.post('/auth/set-password', payload);
    return response;
};

export { login, forgetPassword, resetPassword, verifyToken, setPassword };
