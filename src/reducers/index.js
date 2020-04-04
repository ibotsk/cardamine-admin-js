import { combineReducers } from 'redux';
import authentication from './authentication';
import pagination from './pagination';
import exportData from './exportData';

export default combineReducers({
  authentication,
  pagination,
  exportData
});