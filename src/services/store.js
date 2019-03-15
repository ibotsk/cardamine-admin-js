import { createStore } from 'redux';

import { loadState, saveState } from './local-storage';
import rootReducer from '../reducers';

const persistedState = loadState();

const store = createStore(
    rootReducer,
    persistedState
);

store.subscribe(() => {
    saveState({
        authentication: store.getState().authentication
    });
});

export default store;