
const nullToEmpty = (obj) => {
    const newObj = {};
    Object.keys(obj).map(k => newObj[k] = (obj[k] ? obj[k] : ''));
    return newObj;
}

export default { nullToEmpty };