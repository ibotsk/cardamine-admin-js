const isNotNullOrEmpty = (expression) => ({
  and: [
    { [expression]: { neq: null } },
    { [expression]: { neq: '' } },
  ],
});

/**
 * For resolving filter comparator. Supports LIKE and EQ.
 * Loopback mysql connector does not support case insensitive.
 * @param {*} comparator
 * @param {*} key
 * @param {*} value
 */
const resolveByComparator = (comparator, key, value) => {
  switch (comparator) {
    case '':
      return {};
    case 'LIKE':
      return {
        [key]: {
          like: `%25${value}%25`,
        },
      };
    case 'REGEXP':
      return {
        [key]: {
          regexp: value,
        },
      };
    case 'NEQ':
      // if (Array.isArray(value)) {
      //     return {
      //         and: value.map(v => ({
      //             [key]: {
      //                 neq: v
      //             }
      //         }))
      //     };
      // }
      return {
        [key]: {
          neq: value,
        },
      };
    case 'EQ':
    default:
      return {
        [key]: value,
      };
  }
};

const filterToWhereItem = (filter, key) => {
  let conjug = 'or';
  let { filterVal } = filter;
  if (filterVal.and) {
    conjug = 'and';
    filterVal = filterVal.and;
  }

  if (Array.isArray(filterVal) && filterVal.length > 1) {
    const valsOr = [];
    for (const val of filterVal) {
      let itemKey = key; let
        value = val;
      if (val && typeof val !== 'string') {
        itemKey = val.field;
        value = val.value;
      }
      valsOr.push(resolveByComparator(filter.comparator, itemKey, value));
    }
    return { [conjug]: valsOr };
  }
  return resolveByComparator(filter.comparator, key, filter.filterVal);
};

const makeWhereFromFilter = (filters) => {
  const whereItems = [];
  const keys = Object.keys(filters);
  for (const key of keys) {
    whereItems.push(filterToWhereItem(filters[key], key));
  }
  if (whereItems.length > 1) {
    return { OR: whereItems };
  }
  if (whereItems.length === 1) {
    return whereItems[0];
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
