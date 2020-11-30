import { createStore } from 'redux';

import { loadState, saveState } from './local-storage';
import rootReducer from '../reducers';

const persistedState = loadState();

const store = createStore(rootReducer, persistedState);

store.subscribe(() => {
  saveState({
    cdataRefresh: store.getState().cdataRefresh,
    authentication: store.getState().authentication,
    pagination: store.getState().pagination,
    exportData: store.getState().exportData,
  });
});

export default store;
