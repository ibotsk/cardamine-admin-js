
const nullToEmpty = (obj) => {
    Object.keys(obj).forEach(k => obj[k] = (obj[k] ? obj[k] : ''));
    return obj;
}

const emptyToNull = obj => {
    return Object.keys(obj).map(k => obj[k] = (obj[k] === '' ? null : obj[k]));
}

export default {
    nullToEmpty,
    emptyToNull
};