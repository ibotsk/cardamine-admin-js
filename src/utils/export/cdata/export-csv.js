import get from 'lodash.get';
import helper from '../../helper';

const VALUE_NA = '-';

const createPublication = (data) => helper.parsePublication(data);

const createLosName = (name) => helper
  .listOfSpeciesString(name, { isPublication: true });

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

/**
 *
 * @param {*} data value of field, can be json
 * @param {*} fieldInfo field from config
 */
const handleCompositeField = (data, field, fieldInfo) => {
  if (!fieldInfo.composite) {
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

function createCsvData(dataToExport, fields, configfields) {
  const headers = fields.map((f) => ({
    label: configfields[f].name,
    key: f,
  }));

  const data = dataToExport.map((d) => {
    const obj = {};
    for (const f of fields) {
      const info = configfields[f];
      const fieldValue = getValue(d, info.column);
      obj[f] = handleCompositeField(fieldValue, f, info);
    }
    return obj;
  });

  return {
    data,
    headers,
  };
}

export default {
  createCsvData,
};
