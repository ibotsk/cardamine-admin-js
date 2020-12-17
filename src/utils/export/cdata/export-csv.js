import stringify from 'csv-stringify';
import download from 'downloadjs';

import config from '../../../config';

const {
  export: {
    options: optionsConfig,
    chromdata: { defaultOrder, columns },
  },
} = config;

/**
 * Creates array of { key: '<keyVal>', header: '<headerVal>' }
 * @param {array<string>} chosenColumns
 */
function createHeaderColumns(chosenColumns) {
  const chosenColumnsInOrder = defaultOrder
    .filter((k) => chosenColumns.includes(k));

  return chosenColumnsInOrder.map((col) => ({
    key: col,
    header: columns[col].name,
  }));
}

/**
 * @param {array<object>} records array of objects to export
 * @param {array<object>} headerColumns array of { key: '<keyVal>', header: '<headerVal>' }
 *  where keyVal is key of object from records and headerVal is title of column
 * @param {object} options
 */
async function createAndDownload(records, headerColumns, options = {}) {
  const { delimiter = optionsConfig.separator } = options;

  const dataToDownload = [];
  const stringifier = stringify({
    delimiter,
    quoted_string: true,
    // header columns must be in order in which they will appear in the file
    header: true,
    columns: headerColumns,
  });
  stringifier.on('readable', () => {
    let row = stringifier.read();
    while (row) {
      dataToDownload.push(row);
      row = stringifier.read();
    }
  });
  const stringifiedPromise = new Promise((resolve, reject) => {
    stringifier.on('error', (err) => reject(err));
    stringifier.on('finish', () => resolve(dataToDownload.join('')));
  });

  for (const record of records) {
    stringifier.write(record);
  }
  stringifier.end();

  const stringContentToDownload = await stringifiedPromise;
  return download(
    stringContentToDownload,
    'chromosomes.csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  );
}

export default {
  createHeaderColumns,
  createAndDownload,
};
