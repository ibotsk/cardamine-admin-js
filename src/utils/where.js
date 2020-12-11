import { WhereBuilder, functions } from './builders/where-builder';

const {
  eq, neq, likep, regexp, and, or,
} = functions;

const isNotNullOrEmpty = (expression) => (
  and(
    neq(expression, null),
    neq(expression, ''),
  )
);

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
      return likep(key, value);
    case 'REGEXP':
      return regexp(key, value);
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
      return neq(key, value);
    case 'EQ':
    default:
      return eq(key, value);
  }
};

const filterToWhereItem = (filter, key) => {
  let conjug = or;
  let { filterVal } = filter;
  if (filterVal.and) {
    conjug = and;
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
    return conjug(...valsOr);
  }
  return resolveByComparator(filter.comparator, key, filter.filterVal);
};

const makeWhereFromFilter = (filters) => {
  const whereItems = [];
  const keys = Object.keys(filters);
  for (const key of keys) {
    whereItems.push(filterToWhereItem(filters[key], key));
  }
  const andItems = and(...whereItems);

  const wb = new WhereBuilder();
  return wb.add(andItems).build();
};

// displayType is id
// { displayType, paperAuthor, paperTitle, seriesSource, volume, issue, publisher, editor, year, pages, journalName }
const whereDataAll = (data) => {
  const andItems = Object.keys(data)
    .filter((k) => !!data[k])
    .map((k) => eq(k, data[k]));

  if (andItems.length === 0) {
    return null;
  }
  const wb = new WhereBuilder();
  return wb.add(and(...andItems)).build();
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
    whereArr.push(
      or(
        and(
          isNotNullOrEmpty('coordinatesLat'),
          isNotNullOrEmpty('coordinatesLon'),
          eq('coordinatesForMap', null),
        ),
        and(
          neq('coordinatesGeoref', null),
          eq('coordinatesForMap', null),
        ),
      ),
    );
  }
  if (warningRows) {
    whereArr.push(
      and(
        or(
          eq('coordinatesLat', null),
          eq('coordinatesLat', ''),
        ),
        or(
          eq('coordinatesLon', null),
          eq('coordinatesLon', ''),
        ),
        eq('coordinatesGeoref', null),
        eq('coordinatesForMap', null),
      ),
    );
  }
  if (okRows) {
    whereArr.push(neq('coordinatesForMap', null));
  }

  if (whereArr.length === 0 || whereArr.length === 3) { // all three conditions means all records
    return {};
  }
  return or(...whereArr);
}

export default {
  makeWhereFromFilter,
  whereDataAll,
  whereCoordinates,
};
