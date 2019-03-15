import { SET_AUTHENTICATED, UNSET_AUTHENTICATED } from '../actions/action-types';

const initialState = { accessToken: '', isAuthenticated: false };

const authentication = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                ...{
                    accessToken: action.accessToken,
                    isAuthenticated: action.isAuthenticated
                }
            };
        case UNSET_AUTHENTICATED:
            return {};
        default:
            return state
    }
}

export default authentication;