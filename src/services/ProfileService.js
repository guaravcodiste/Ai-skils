import AxiosRequest from '../utils/AxiosRequest';

const getProfile = async () => {
    const res = await AxiosRequest.get('/profile/me');
    return res;
};

export { getProfile };
