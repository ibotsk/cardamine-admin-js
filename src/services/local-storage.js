
const KEY_STATE = 'state';

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem(KEY_STATE);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = state => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(KEY_STATE, serializedState);
    } catch {
        // ignore write errors
    }
};

export const removeState = () => {
    try {
        localStorage.removeItem(KEY_STATE);
    } catch {
        // ignore
    }
};
