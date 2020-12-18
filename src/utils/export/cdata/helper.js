import get from 'lodash.get';
import helper from '../../helper';

import config from '../../../config';

const {
  export: {
    chromdata: {
      columns: columnsConfig,
      defaultOrder,
    },
  },
} = config;

const VALUE_NA = '';

const createPublication = (data) => helper.parsePublication(data);

const createLosName = (name) => helper
  .listOfSpeciesString(name, { isPublication: true });

/**
* bootstraps composite field handlers to their keys
* @param {*} data value of field, can be json
* @param {*} fieldInfo field from config
*/
const handleCompositeField = (data, field, composite) => {
  if (!composite) {
    return data;
  }
  switch (field) {
    case 'publicationFull':
      return createPublication(data);
    case 'originalIdentification':
    case 'latestRevision':
      return createLosName(data);
    default:
      return data;
  }
};

const getValue = (data, column) => {
  const fieldValue = get(data, column, VALUE_NA);
  if (fieldValue === false) {
    return 'FALSE';
  }
  if (!fieldValue || fieldValue === '') {
    return VALUE_NA;
  }
  return fieldValue;
};

function transformRecord(record) {
  return Object.keys(columnsConfig).reduce((prev, currentKey) => {
    const {
      column: columnPath,
      composite,
    } = columnsConfig[currentKey];
    const value = getValue(record, columnPath);
    const valueWithComposites = handleCompositeField(
      value, currentKey, composite,
    );
    return {
      ...prev,
      [currentKey]: valueWithComposites,
    };
  }, {});
}


function createChosenColumnsInOrder(chosenColumns) {
  return defaultOrder.filter((k) => chosenColumns.includes(k));
}

export default {
  transformRecord,
  createChosenColumnsInOrder,
};
