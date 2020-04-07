const makeWhereFromFilter = (filters) => {
  const whereList = [];
  const keys = Object.keys(filters);
  for (const key of keys) {
    whereList.push({
      [key]: {
        like: `%${filters[key].filterVal}%`
      }
    });
  }
  if (whereList.length > 1) {
    return { 'OR': whereList };
  }
  if (whereList.length === 1) {
    return whereList[0];
  }
  return {};
};

// displayType is id
// { displayType, paperAuthor, paperTitle, seriesSource, volume, issue, publisher, editor, year, pages, journalName }
const whereDataAll = (data) => {

  const and = Object.keys(data).filter(k => data[k] ? true : false).map(k => ({ [k]: data[k] }));

  if (and.length === 0) {
    return null;
  }

  return {
    and
  };
}

export default {
  makeWhereFromFilter,
  whereDataAll
};