import helper from './helper';

import importConfig from '../config/import';

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

export default {
    importCSV
};