import { SET_EXPORT_CDATA, RESET_EXPORT_CDATA } from '../actions/action-types';

const initialState = { cdata: [] };

const exportData = (state = initialState, action) => {
  switch (action.type) {
    case SET_EXPORT_CDATA:
      return {
        ...state,
        ...{
          cdata: action.ids,
        },
      };
    case RESET_EXPORT_CDATA:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};

export default exportData;
