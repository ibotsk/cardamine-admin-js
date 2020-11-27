import config from '../config';

function curateSortFields(sortField, prefix = '') {
  const fields = config.nomenclature.filter.filters[sortField];
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
  if (!Array.isArray(sortFields)) {
    fields.push(sortFields);
  } else {
    fields.push(...sortFields);
  }

  if (defaultField) {
    fields.push(defaultField);
  }
  return fields.map((f) => `${f} ${soUpperCase}`);
}

export default {
  curateSortFields,
  makeOrder,
};
