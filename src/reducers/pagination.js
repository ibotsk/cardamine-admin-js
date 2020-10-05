import { SET_PAGINATION, RESET_PAGINATION } from '../actions/action-types';
import config from '../config';

const initialState = {
  page: config.pagination.pageStartIndex,
  pageSize: config.pagination.sizePerPageList[0].value,
};

const pagination = (state = initialState, action) => {
  switch (action.type) {
    case SET_PAGINATION:
      return {
        ...state,
        ...{
          page: action.page,
          pageSize: action.pageSize,
        },
      };
    case RESET_PAGINATION:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};

export default pagination;
