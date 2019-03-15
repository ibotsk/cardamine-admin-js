import { SET_AUTHENTICATED, UNSET_AUTHENTICATED } from './action-types';

export const setAuthenticated = token => ({
    type: SET_AUTHENTICATED,
    accessToken: token,
    isAuthenticated: true
});

export const unsetAuthenticated = () => ({
    type: UNSET_AUTHENTICATED
});
