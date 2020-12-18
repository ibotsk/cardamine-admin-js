import stringify from 'csv-stringify';
import download from 'downloadjs';

import config from '../../../config';

const {
  export: {
    options: optionsConfig,
    chromdata: {
      columns: columnsConfig,
    },
  },
} = config;

function createKeyHeaderColumns(chosenColumnsInOrder) {
  return chosenColumnsInOrder.map((col) => ({
    key: col,
    header: columnsConfig[col].name,
  }));
}

/**
 * @param {array<object>} records array of objects to export
 * @param {array<string>} chosenColumnsInOrder array of 
 *  where keyVal is key of object from records and headerVal is title of column
 * @param {object} options
 */
async function createAndDownload(records, chosenColumnsInOrder, options = {}) {
  const { delimiter = optionsConfig.separator } = options;
  const headerColumns = createKeyHeaderColumns(chosenColumnsInOrder);

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
    new Blob([stringContentToDownload]), // must be as Blob for the correct encoding
    'chromosomes.csv',
    'text/csv',
  );
}

export default {
  createAndDownload,
};
