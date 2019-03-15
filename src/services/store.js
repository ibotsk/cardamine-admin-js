import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';

import { loadState, saveState } from './local-storage';
import rootReducer from '../reducers';

const persistedState = loadState();

const store = createStore(
    rootReducer,
    persistedState,
    applyMiddleware(
        createLogger()
    )
);

store.subscribe(() => {
    saveState({
        authentication: store.getState().authentication
    });
});

export default store;