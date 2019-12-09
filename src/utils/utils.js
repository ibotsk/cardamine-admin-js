
const nullToEmpty = (obj) => {
    const newObj = {};
    Object.keys(obj).map(k => newObj[k] = (obj[k] ? obj[k] : ''));
    return newObj;
}

const emptyToNull = obj => {
    return Object.keys(obj).map(k => obj[k] = (obj[k] === '' ? null : obj[k]));
}

export default {
    nullToEmpty,
    emptyToNull
};