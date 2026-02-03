import axios from 'axios';

const { CancelToken } = axios;
const _cancelToken = {};

const AxiosRequest = axios.create({
    baseURL: `${import.meta.env.VITE_NODE_ENDPOINT}`,
    timeout: 60000,
});

AxiosRequest.interceptors.request.use(
    config => {
        try {
            const { cancelToken } = config;
            if (cancelToken) {
                if (_cancelToken[cancelToken]) {
                    const source = _cancelToken[cancelToken];
                    delete _cancelToken[cancelToken];
                    source.cancel();
                }

                const source = CancelToken.source();
                config.cancelToken = source.token;
                _cancelToken[cancelToken] = source;
            }

            const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            config.headers.Authorization = `Bearer ${accessToken}`;
            return config;
        } catch (err) {
            console.log('err', err);
        }
    },
    error => {
        console.log('error', error);
        Promise.reject(error);
    },
);

AxiosRequest.interceptors.response.use(
    response => {
        const { cancelToken } = response.config;
        if (cancelToken) {
            delete _cancelToken[response.config.cancelToken];
        }
        return response;
    },
    error => {
        if (!error.response) {
            if (error.code === 'ECONNABORTED') {
                return Promise.reject(new Error('The service is temporarily unavailable. Please try again later.'));
            }
        }
        return Promise.reject(error);
    },
);

export default AxiosRequest;
