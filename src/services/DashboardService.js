import AxiosRequest from '../utils/AxiosRequest';

const getDashboardStats = async () => {
    const response = await AxiosRequest.get('/dashboard/stats');
    return response;
};

export { getDashboardStats };
