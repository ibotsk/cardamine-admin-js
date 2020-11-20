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

const jsonStringifySafe = (val) => {
  if (!val) {
    return null;
  }
  return typeof val === 'string' ? val : JSON.stringify(val);
};

export default {
  nullToEmpty,
  emptyToNull,
  jsonStringifySafe,
};
