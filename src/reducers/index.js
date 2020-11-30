import { combineReducers } from 'redux';
import authentication from './authentication';
import pagination from './pagination';
import exportData from './exportData';
import cdataRefresh from './cdata-refresh';

export default combineReducers({
  authentication,
  pagination,
  exportData,
  cdataRefresh,
});
