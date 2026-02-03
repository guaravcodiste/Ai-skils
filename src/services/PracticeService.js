import AxiosRequest from '../utils/AxiosRequest';

const getPracticeTypes = async () => {
    const res = await AxiosRequest.get('/practice-types');
    return res;
};

const getPracticeTypeDetails = async practiceTypeId => {
    const res = await AxiosRequest.get(`/practice-types/${practiceTypeId}`);
    return res;
};

const savePracticeResult = (practiceTypeId, payload) => {
    return AxiosRequest.post(`/practice-types/${practiceTypeId}/result`, payload);
};

const getMyPracticeResults = () => {
    return AxiosRequest.get('/practice-types/me');
};

export { getPracticeTypes, getPracticeTypeDetails, savePracticeResult, getMyPracticeResults };
