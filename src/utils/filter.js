import config from '../config';

function curateSortFields(sortField) {
  const fields = config.nomenclature.filter[sortField];
  if (fields) {
    return fields;
  }
  return sortField;
}

function makeOrder(sortFields, sortOrder = 'ASC') {
  let soUpperCase = sortOrder.toUpperCase();
  if (soUpperCase !== 'ASC' && soUpperCase !== 'DESC') {
    soUpperCase = 'ASC';
  }
  if (Array.isArray(sortFields)) {
    return sortFields.map((f) => `${f} ${soUpperCase}`);
  }
  return [`${sortFields} ${soUpperCase}`];
}

export default {
  curateSortFields,
  makeOrder,
};
