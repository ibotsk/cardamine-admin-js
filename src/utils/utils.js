
const nullToEmpty = (obj) => {
    Object.keys(obj).forEach(k => obj[k] = (obj[k] ? obj[k] : ''));
    return obj;
}

export default { nullToEmpty };