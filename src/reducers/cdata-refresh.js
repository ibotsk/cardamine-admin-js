import {
  SET_CDATA_NEEDS_REFRESH,
} from '../actions/action-types';

const initialState = { needsRefresh: false };

const cdataRefresh = (state = initialState, action) => {
  switch (action.type) {
    case SET_CDATA_NEEDS_REFRESH:
      return {
        ...state,
        ...{
          needsRefresh: action.needsRefresh,
        },
      };
    default:
      return state;
  }
};

export default cdataRefresh;
