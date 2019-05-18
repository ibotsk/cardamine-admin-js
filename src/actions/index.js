import { SET_AUTHENTICATED, UNSET_AUTHENTICATED, SET_PAGINATION, RESET_PAGINATION } from './action-types';

export const setAuthenticated = token => ({
    type: SET_AUTHENTICATED,
    accessToken: token,
    isAuthenticated: true
});

export const unsetAuthenticated = () => ({
    type: UNSET_AUTHENTICATED
});

export const setPagination = ({ page, pageSize }) => ({
    type: SET_PAGINATION,
    page,
    pageSize
});

export const resetPagination = () => ({
    type: RESET_PAGINATION
});