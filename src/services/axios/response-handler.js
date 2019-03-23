import { removeState } from '../local-storage';

const HTTP_UNAUTHORIZED = 401;

export const handleAxiosError = error => {
    if (!error.response) {
        return;
    }
    switch (error.response.status) {
        case HTTP_UNAUTHORIZED:
            removeState();
            window.location.reload(true);
            break;
        default:
            break;
    }
}
