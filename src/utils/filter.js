import config from '../config';

const {
  nomenclature: { filter: filterConfig },
} = config;

const makeComplexFilter = (filterContent, { filter }) => {
  const { prefix = '', ...newFilterContent } = filterContent;

  const newFilterFields = filterConfig.filters[filter]
    .map((f) => `${prefix}${f}`);

  const { filterVal } = filterContent;
  if (typeof filterVal === 'string') {
    const newFilterValue = newFilterFields.map((f) => (
      { field: f, value: filterVal }
    ));
    newFilterContent.filterVal = newFilterValue;
  }

  return newFilterContent;
};

/**
 * Keys from input filters that are found in config.nomenclature.filter.columnMap are considered complex.
 * Complex filters are processed.
 * The other ones are left unchanged.
 * @param {object} filters
 */
function curateSearchFilters(filters) {
  const curatedFilters = { ...filters };

  for (const k of Object.keys(curatedFilters)) {
    const complexColumn = filterConfig.columnMap[k];
    if (complexColumn) {
      curatedFilters[k] = makeComplexFilter(filters[k], complexColumn);
    }
  }

  return curatedFilters;
}

/**
 * If sortField is found in the config.nomenclature.filter.filters,
 * then return an array of fields. Otherwise return string.
 * If prefix is not empty, prefix all fields with it.
 * @param {string} sortField
 * @param {string} prefix
 */
function curateSortFields(sortField, prefix = '') {
  if (!sortField) {
    return undefined;
  }

  const fields = filterConfig.filters[sortField];
  if (fields) {
    return fields.map((f) => `${prefix}${f}`);
  }
  return `${prefix}${sortField}`;
}

function makeOrder(sortFields, sortOrder = 'ASC', defaultField = undefined) {
  let soUpperCase = sortOrder.toUpperCase();
  if (soUpperCase !== 'ASC' && soUpperCase !== 'DESC') {
    soUpperCase = 'ASC';
  }

  const fields = [];
  if (sortFields) {
    if (!Array.isArray(sortFields)) {
      fields.push(sortFields);
    } else {
      fields.push(...sortFields);
    }
  }

  if (defaultField && !fields.includes(defaultField)) {
    fields.push(defaultField);
  }
  return fields.map((f) => `${f} ${soUpperCase}`);
}

function applyToFilters(filters, func) {
  const newFilters = { ...filters };

  for (const k of Object.keys(newFilters)) {
    newFilters[k] = func(k, newFilters[k]);
  }
  return newFilters;
}

export default {
  curateSearchFilters,
  curateSortFields,
  makeOrder,
  applyToFilters,
};
