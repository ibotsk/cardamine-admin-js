const isNotNullOrEmpty = (expression) => ({
  and: [
    { [expression]: { neq: null } },
    { [expression]: { neq: '' } },
  ],
});

const makeWhereFromFilter = (filters) => {
  const whereList = [];
  const keys = Object.keys(filters);
  for (const key of keys) {
    whereList.push({
      [key]: {
        like: `%${filters[key].filterVal}%`,
      },
    });
  }
  if (whereList.length > 1) {
    return { OR: whereList };
  }
  if (whereList.length === 1) {
    return whereList[0];
  }
  return {};
};

// displayType is id
// { displayType, paperAuthor, paperTitle, seriesSource, volume, issue, publisher, editor, year, pages, journalName }
const whereDataAll = (data) => {
  const and = Object.keys(data)
    .filter((k) => !!data[k])
    .map((k) => ({ [k]: data[k] }));

  if (and.length === 0) {
    return null;
  }

  return {
    and,
  };
};

/**
 * Makes where of the coordinates:
 * @param {boolean} dangerRows (coordinatesLat not empty && coordinatesLon not empty && coordinatesForMap empty)
    || (coordinatesGeoref not empty && coordinatesForMap empty)
 * @param {boolean} warningRows coordinatesLat empty && coordinatesLon empty && coordinatesGeoref empty && coordinatesForMap empty
 * @param {boolean} okRows coordinatesForMap not empty
 */
function whereCoordinates(dangerRows, warningRows, okRows) {
  const whereArr = [];
  if (dangerRows) {
    whereArr.push({
      or: [
        {
          and: [
            isNotNullOrEmpty('coordinatesLat'),
            isNotNullOrEmpty('coordinatesLon'),
            { coordinatesForMap: null },
          ],
        },
        {
          and: [
            { coordinatesGeoref: { neq: null } },
            { coordinatesForMap: null },
          ],
        },
      ],
    });
  }
  if (warningRows) {
    whereArr.push({
      and: [
        {
          or: [
            { coordinatesLat: null }, { coordinatesLat: '' },
          ],
        },
        {
          or: [
            { coordinatesLon: null }, { coordinatesLon: '' },
          ],
        },
        { coordinatesGeoref: null },
        { coordinatesForMap: null },
      ],
    });
  }
  if (okRows) {
    whereArr.push({ coordinatesForMap: { neq: null } });
  }

  if (whereArr.length === 0 || whereArr.length === 3) { // all three conditions means all records
    return {};
  }
  const where = whereArr.length <= 1
    ? whereArr[0]
    : { or: whereArr };
  return where;
}

export default {
  makeWhereFromFilter,
  whereDataAll,
  whereCoordinates,
};
