import axios from 'axios';

import { handleAxiosError } from './response-handler';

axios.interceptors.response.use(
    res => res,
    error => {
        handleAxiosError(error);
        return Promise.reject(error);
    }
);

export default axios;