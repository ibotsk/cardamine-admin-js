const trimObj = (obj) => Object.keys(obj).reduce(
  (prev, curr) => ({
    ...prev,
    [curr]: (typeof obj[curr] === 'string') ? obj[curr].trim() : obj[curr],
  }),
  {},
);

const nullToEmpty = (obj) => Object.keys(obj).reduce(
  (prev, curr) => ({
    ...prev,
    [curr]: obj[curr] ? obj[curr] : '',
  }),
  {},
);

const emptyToNull = (obj) => Object.keys(obj).reduce(
  (prev, curr) => ({
    ...prev,
    [curr]: obj[curr] === '' ? null : obj[curr],
  }),
  {},
);

/** only highest level */
const trimAndFixEmpty = (obj) => {
  if (!obj) {
    return obj;
  }
  const trimmed = trimObj(obj);
  return emptyToNull(trimmed);
};

const jsonStringifySafe = (val) => {
  if (!val) {
    return null;
  }
  return typeof val === 'string' ? val : JSON.stringify(val);
};

/**
 * From data extract such keys and values, where keys start with str.
 * Keys in the new object are without str prefix.
 * @param {object} data
 * @param {string} str
 */
const getObjWKeysThatStartWithStr = (data, str) => (
  Object.keys(data)
    .filter((k) => k.indexOf(str) === 0)
    .reduce((newData, k) => {
      const newKey = k.replace(str, '');
      return {
        ...newData,
        [newKey]: data[k],
      };
    }, {})
);

export default {
  nullToEmpty,
  emptyToNull,
  jsonStringifySafe,
  getObjWKeysThatStartWithStr,
  trimAndFixEmpty,
};
