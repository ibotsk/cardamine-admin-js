import helper from './helper';

import importConfig from '../config/import';

import merge from 'lodash.merge';

function importCSV(data) {

  const dataToImport = [];

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      continue;
    }
    const row = data[i];
    if (row.length === 1) { // empty line -> end
      break;
    }
    const rowObjects = processRow(row);
    dataToImport.push(rowObjects);
  }

  return dataToImport;
}

function createReport(records) {

  let speciesReport = {};
  let publicationReport = {};
  let personsReport = {};

  for (const [i, { references }] of records.entries()) {
    const rowNum = i + 2; // 1st row in the file is header

    processSimpleReport(speciesReport, references.species, rowNum, helper.listOfSpeciesString);
    processSimpleReport(publicationReport, references.publication, rowNum, helper.parsePublication);

    const personsOneRow = processRowPersonsReport(references.persons, rowNum);
    personsReport = merge(personsReport, personsOneRow);

  }

  return {
    speciesReport,
    publicationReport,
    personsReport
  };
}

// -----------------------------------------//
// -----------------------------------------//
// -----------------------------------------//

function processRow(row) {

  const cdata = createObject(importConfig.dataColumns.cdata, row);
  const material = createObject(importConfig.dataColumns.material, row);
  const reference = createObject(importConfig.dataColumns.reference, row);
  const dna = createObject(importConfig.dataColumns.dna, row);

  const nameAsPublished = makeNameAsPublished(row);
  reference.nameAsPublished = nameAsPublished;

  const literature = createObject(importConfig.referenceColumns.literature, row);
  const standardizedName = createObject(importConfig.referenceColumns.standardizedName, row);
  const countedBy = createObject(importConfig.referenceColumns.countedBy, row);
  const collectedBy = createObject(importConfig.referenceColumns.collectedBy, row);
  const identifiedBy = createObject(importConfig.referenceColumns.identifiedBy, row);
  const checkedBy = createObject(importConfig.referenceColumns.checkedBy, row);
  const idWorld4 = createObject(importConfig.referenceColumns.idWorld4, row);

  return {
    main: {
      cdata,
      material,
      reference,
      dna
    },
    references: {
      literature,
      standardizedName,
      countedBy,
      collectedBy,
      identifiedBy,
      checkedBy,
      idWorld4
    }
  };
}

function createObject(configTemplate, rowData) {

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
}

function makeNameAsPublished(rowData) {
  const nameObj = createObject(importConfig.dataColumns.nameAsPublished, rowData);
  return helper.listOfSpeciesString(nameObj);
}

function processSimpleReport(report, data, rowNum, formatKey = undefined) {

  if (!data) {
    const empty = report[""] || [];
    empty.push(rowNum);
    report[""] = empty;
    return;
  }

  if (data.found.length === 0) { // report those that will be created
    let name = data.term;
    if (formatKey) {
      name = formatKey(name);
    }
    const inReportRows = report[name] || [];
    inReportRows.push(rowNum);
    report[name] = inReportRows;
  }

}

function processRowPersonsReport(personsObj, rowNum) {
  const keys = Object.keys(personsObj); // countedBy, identifiedBy atd

  const personsReport = {};

  for (const key of keys) {
    const val = personsObj[key];
    if (!val) {
      continue;
    }
    if (val.found.length === 0) { // report those that will be created
      const personName = val.term;
      addToPersonReport(personsReport, personName, rowNum, key);
    }
  }

  return personsReport;
}

function addToPersonReport(report, name, rowNum, role) {
  const existingName = report[name] || {};

  const roles = existingName[rowNum] || [];
  roles.push(role);

  report[name] = {
    ...existingName,
    [rowNum]: roles
  };
}

export default {
  importCSV,
  createReport
};