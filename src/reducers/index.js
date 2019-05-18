import { combineReducers } from 'redux';
import authentication from './authentication';
import pagination from './pagination';

export default combineReducers({
    authentication,
    pagination
});