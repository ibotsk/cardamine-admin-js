/* eslint-disable no-param-reassign */
import merge from 'lodash.merge';
import helper from './helper';

import config from '../config';

const { import: importConfig } = config;

const createObject = (configTemplate, rowData) => {
  const object = {};

  if (Number.isInteger(configTemplate)) {
    const value = rowData[configTemplate];
    return value.trim();
  }

  for (const prop of Object.keys(configTemplate)) {
    const index = configTemplate[prop];
    const value = rowData[index];
    object[prop] = value.trim();
  }
  return object;
};

const makeNameAsPublished = (rowData) => {
  const nameObj = createObject(
    importConfig.dataColumns.nameAsPublished,
    rowData,
  );
  return helper.listOfSpeciesString(nameObj);
};

const processRow = (row) => {
  if (row[0] === importConfig.ignoredRowSign) {
    return null;
  }

  const cdata = createObject(importConfig.dataColumns.cdata, row);
  const material = createObject(importConfig.dataColumns.material, row);
  const reference = createObject(importConfig.dataColumns.reference, row);
  const dna = createObject(importConfig.dataColumns.dna, row);

  const nameAsPublished = makeNameAsPublished(row);
  reference.nameAsPublished = nameAsPublished;

  const literature = createObject(
    importConfig.referenceColumns.literature,
    row,
  );
  const standardizedName = createObject(
    importConfig.referenceColumns.standardizedName,
    row,
  );
  const countedBy = createObject(importConfig.referenceColumns.countedBy, row);
  const collectedBy = createObject(
    importConfig.referenceColumns.collectedBy,
    row,
  );
  const identifiedBy = createObject(
    importConfig.referenceColumns.identifiedBy,
    row,
  );
  const checkedBy = createObject(importConfig.referenceColumns.checkedBy, row);
  const idWorld4 = createObject(importConfig.referenceColumns.idWorld4, row);

  return {
    main: {
      cdata,
      material,
      reference,
      dna,
    },
    references: {
      literature,
      standardizedName,
      countedBy,
      collectedBy,
      identifiedBy,
      checkedBy,
      idWorld4,
    },
  };
};

const processSimpleReport = (report, data, rowNum, formatKey = undefined) => {
  if (!data) {
    const empty = report[''] || [];
    empty.push(rowNum);
    report[''] = empty;
    return;
  }

  if (data.found.length === 0) {
    // report those that will be created
    let name = data.term;
    if (formatKey) {
      name = formatKey(name);
    }
    const inReportRows = report[name] || [];
    inReportRows.push(rowNum);
    report[name] = inReportRows;
  }
};

const addToPersonReport = (report, name, rowNum, role) => {
  const existingName = report[name] || {};

  const roles = existingName[rowNum] || [];
  roles.push(role);

  report[name] = {
    ...existingName,
    [rowNum]: roles,
  };
};

const processRowPersonsReport = (personsObj, rowNum) => {
  const keys = Object.keys(personsObj); // countedBy, identifiedBy atd

  const personsReport = {};

  for (const key of keys) {
    const val = personsObj[key];
    if (!val) {
      continue;
    }
    if (val.found.length === 0) {
      // report those that will be created
      const { persName } = val.term;
      addToPersonReport(personsReport, persName, rowNum, key);
    }
  }

  return personsReport;
};

// -------------------------------------------------------- //

/**
 * Prepare rows to import without label rows.
 * Ignored rows are null in the result.
 * @param {*} data
 */
function importCSV(data) {
  const dataToImport = [];
  const { ignoredRows } = importConfig;

  for (let i = 0; i < data.length; i += 1) {
    if (ignoredRows.includes(i)) {
      // skip ignored rows, row 0 are labels
      continue;
    }
    const row = data[i];
    if (row.length === 1) {
      // empty line -> end
      break;
    }
    const rowObjects = processRow(row);
    dataToImport.push(rowObjects);
  }

  return dataToImport;
}

function createReport(records) {
  const speciesReport = {};
  const publicationReport = {};
  let personsReport = {};

  for (const [i, { references }] of records.entries()) {
    const rowNum = i + 2; // 1st row in the file is header

    processSimpleReport(
      speciesReport,
      references.species,
      rowNum,
      helper.listOfSpeciesString,
    );
    processSimpleReport(
      publicationReport,
      references.publication,
      rowNum,
      helper.parsePublication,
    );

    const personsOneRow = processRowPersonsReport(references.persons, rowNum);
    personsReport = merge(personsReport, personsOneRow);
  }

  return {
    speciesReport,
    publicationReport,
    personsReport,
  };
}

export default {
  importCSV,
  createReport,
};
