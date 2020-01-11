import helper from '../utils/helper';
import importUtils from '../utils/import';

import checklistFacade from './checklist';
import publicationsFacade from './publications';
import personsFacade from './persons';
import world4Facade from './world4';

const loadData = async (data, accessToken, increase = undefined) => {

    const dataToImport = importUtils.importCSV(data);

    const records = [];

    const total = data.length - 1;
    let i = 1;
    for (const row of dataToImport) {
        const { literature: refLiterature, standardizedName: refStandardizedName, idWorld4: refWorld4, ...refPersons } = row.references;

        let idWorld4 = null;
        if (refWorld4) {
            // world 4 must be present in the database, if not, it will not be created
            idWorld4 = await world4Facade.getOneByDescription(refWorld4, accessToken, getIdOfFound);
        }

        const species = await checklistFacade.getSpeciesByAll(refStandardizedName, accessToken, getIdOfFound);

        const literatureData = helper.publicationCurateStringDisplayType(refLiterature);
        const publication = await publicationsFacade.getPublicationByAll(literatureData, accessToken, getIdOfFound);

        const persons = await personsFacade.getPersonsByName(refPersons, accessToken, getIdOfFound);

        const record = {
            main: row.main,
            references: {
                species,
                publication,
                persons,
                idWorld4
            }
        };

        records.push(record);

        if (increase) {
            increase(i, total);
        }
        i++;
    }

    return {
        count: dataToImport.length,
        records
    };
};

const importData = async (records, accessToken) => {

    const newlyCreatedRefs = {};

    for (const { main, references } of records) {
        const { cdata, material, reference, dna } = main;
        const { species, publication, persons, idWorld4 } = references;
        const { countedBy, collectedBy, identifiedBy, checkedBy } = persons;

        await processCdata(cdata, countedBy, newlyCreatedRefs, accessToken);
        await processMaterial(material, collectedBy, identifiedBy, checkedBy, undefined, newlyCreatedRefs, accessToken);

        // TODO: processMaterial - add idWorld4
        // TODO: processReference - publication id and standardized name id
    }

    // TODO: finish import

};

function getIdOfFound(found) {
    if (found && found.length !== 0) {
        return found.map(f => f.id);
    }

    return found;
}

async function processCdata(cdata, countedBy, referenceMap, accessToken) {
    const value = await processPerson(countedBy, referenceMap, accessToken)
    cdata.countedBy = value;
}

async function processMaterial(material, collectedBy, identifiedBy, checkedBy, idWorld4, referenceMap, accessToken) {
    const collectedByValue = await processPerson(collectedBy, referenceMap, accessToken);
    const identifiedByValue = await processPerson(identifiedBy, referenceMap, accessToken);
    const checkedByValue = await processPerson(checkedBy, referenceMap, accessToken);

    material.collectedBy = collectedByValue;
    material.identifiedBy = identifiedByValue;
    material.checkedBy = checkedByValue;
}

async function processPerson(person, referenceMap, accessToken) {
    if (!person) {
        return undefined;
    }

    const { term, found } = person;

    let value;
    if (found.length === 0) {
        value = referenceMap[term];

        if (!value) {
            const { id } = await personsFacade.savePerson({
                data: {
                    persName: term
                }, accessToken
            });
            referenceMap[term] = id;
            value = id;
        }
    } else {
        value = found[0];
    }

    return value;
}

export default {
    loadData,
    importData
};