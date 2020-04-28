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

export default {
  nullToEmpty,
  emptyToNull,
};
