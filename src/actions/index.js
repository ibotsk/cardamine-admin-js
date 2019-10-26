import {
    SET_AUTHENTICATED,
    UNSET_AUTHENTICATED,
    SET_PAGINATION,
    RESET_PAGINATION,
    SET_EXPORT_CDATA,
    RESET_EXPORT_CDATA
} from './action-types';

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

export const setExportCdata = ({ ids }) => ({
    type: SET_EXPORT_CDATA,
    ids
});

export const resetExportCdata = () => ({
    type: RESET_EXPORT_CDATA
});