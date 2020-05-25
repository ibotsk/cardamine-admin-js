import axios from 'axios';

import responseHandler from './response-handler';

axios.interceptors.response.use(
  (res) => res,
  (error) => {
    responseHandler.handleAxiosError(error);
    return Promise.reject(error);
  },
);

export default axios;
