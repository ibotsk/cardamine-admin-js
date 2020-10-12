/* eslint-disable no-await-in-loop */
import { helperUtils, importUtils } from '../utils';

import checklistFacade from './checklist';
import publicationsFacade from './publications';
import personsFacade from './persons';
import world4Facade from './world4';
import chromRecordFacade from './crecord';

const formatTermAsPersName = (term) => term.persName;
const formatTermAsPublication = (term) => helperUtils.parsePublication(term);
const formatTermAsSpeciesName = (term) => helperUtils.listOfSpeciesString(term);

const { savePerson } = personsFacade;
const savePublication = publicationsFacade.savePublicationCurated;
const { saveSpecies } = checklistFacade;

const getIdOfFound = (found) => {
  if (found && found.length !== 0) {
    return found.map((f) => f.id);
  }

  return found;
};

const mergeCoordinatesGeoref = (lat, lon) => {
  const latDot = lat.replace(',', '.');
  const lonDot = lon.replace(',', '.');

  // empty cell is ''
  if (latDot === '' || lonDot === ''
    || Number.isNaN(latDot) || Number.isNaN(lonDot)) {
    return null;
  }

  return helperUtils.coordinatesToSave(latDot, lonDot);
};

/**
 * If needed, it creates a record referenced by imported rows:
 * - person, publication, species
 * @param {*} record
 * @param {*} referenceMap is directly changed
 * @param {*} accessToken
 * @param {*} formatTerm function that maps object term to a string
 */
const processReferencedRecord = async (
  record,
  referenceMap,
  accessToken,
  saveFunction,
  formatTerm = (term) => term,
) => {
  if (!record) {
    return null;
  }

  // term contains full object to be created
  const { term, found } = record;

  let value;
  if (found.length === 0) {
    const formattedTerm = formatTerm(term);
    value = referenceMap[formattedTerm];

    if (!value) {
      const { id } = await saveFunction({
        data: term,
        accessToken,
      });
      // eslint-disable-next-line no-param-reassign
      referenceMap[formattedTerm] = id;
      value = id;
    }
  } else {
    const [firstFound] = found;
    value = firstFound;
  }

  return value;
};

const processCdata = async (cdata, countedBy, referenceMap, accessToken) => {
  const value = await processReferencedRecord(
    countedBy,
    referenceMap.persons,
    accessToken,
    savePerson,
    formatTermAsPersName,
  );
  return {
    ...cdata,
    countedBy: value,
  };
};

/**
 *
 * @param {*} material
 * @param {*} collectedBy
 * @param {*} identifiedBy
 * @param {*} checkedBy
 * @param {*} idWorld4 if not empty, always take first element, else null
 * @param {*} referenceMap
 * @param {*} accessToken
 */
const processMaterial = async (
  material,
  collectedBy,
  identifiedBy,
  checkedBy,
  idWorld4,
  referenceMap,
  accessToken,
) => {
  const collectedByValue = await processReferencedRecord(
    collectedBy,
    referenceMap.persons,
    accessToken,
    savePerson,
    formatTermAsPersName,
  );
  const identifiedByValue = await processReferencedRecord(
    identifiedBy,
    referenceMap.persons,
    accessToken,
    savePerson,
    formatTermAsPersName,
  );
  const checkedByValue = await processReferencedRecord(
    checkedBy,
    referenceMap.persons,
    accessToken,
    savePerson,
    formatTermAsPersName,
  );

  let idWorld4Value = null;
  if (idWorld4) {
    const { found } = idWorld4;
    if (found.length > 0) {
      const [firstFound] = found;
      idWorld4Value = firstFound;
    }
  }

  const { coordinatesGeorefLat, coordinatesGeorefLon } = material;
  const coordinatesGeoref = mergeCoordinatesGeoref(
    coordinatesGeorefLat, coordinatesGeorefLon,
  );
  delete material.coordinatesGeorefLat;
  delete material.coordinatesGeorefLon;

  return {
    ...material,
    coordinatesGeoref,
    collectedBy: collectedByValue,
    identifiedBy: identifiedByValue,
    checkedBy: checkedByValue,
    idWorld4: idWorld4Value,
  };
};

const processReference = async (
  reference,
  species,
  publication,
  referenceMap,
  accessToken,
) => {
  const idPublicationValue = await processReferencedRecord(
    publication,
    referenceMap.publications,
    accessToken,
    savePublication,
    formatTermAsPublication,
  );
  const idStandardisedNameValue = await processReferencedRecord(
    species,
    referenceMap.species,
    accessToken,
    saveSpecies,
    formatTermAsSpeciesName,
  );

  return {
    ...reference,
    idLiterature: idPublicationValue,
    idStandardisedName: idStandardisedNameValue,
  };
};

// -------------------------------------------------------- //

async function loadData(data, accessToken, increase = undefined) {
  const dataToImport = importUtils.importCSV(data);
  const records = [];

  const total = dataToImport.length;
  let i = 1;
  for (const row of dataToImport) {
    if (row) {
      // skip null rows -> ignored
      const {
        literature: refLiterature,
        standardizedName: refStandardizedName,
        idWorld4: refWorld4,
        ...refPersons
      } = row.references;

      let idWorld4 = null;
      if (refWorld4) {
        // world 4 must be present in the database, if not, it will not be created
        idWorld4 = await world4Facade.getOneByDescription(
          refWorld4,
          accessToken,
          getIdOfFound,
        );
      }

      const species = await checklistFacade.getSpeciesByAll(
        refStandardizedName,
        accessToken,
        getIdOfFound,
      );

      const literatureData = helperUtils.publicationCurateStringDisplayType(
        refLiterature,
      );
      const publication = await publicationsFacade.getPublicationByAll(
        literatureData,
        accessToken,
        getIdOfFound,
      );

      const persons = await personsFacade.getPersonsByName(
        refPersons,
        accessToken,
        getIdOfFound,
      );

      const record = {
        main: row.main,
        references: {
          species,
          publication,
          persons,
          idWorld4,
        },
      };

      records.push(record);
    }

    // but count ignored rows anyway
    if (increase) {
      increase(i, total);
    }
    i += 1;
  }

  return {
    records,
    total,
  };
}

async function importData(records, accessToken, increase = undefined) {
  // an object to hold references created in this run.
  // exists for the reason to not call database get for every person, species, publication in every row
  const newlyCreatedRefs = {
    persons: {},
    publications: {},
    species: {},
  };

  let i = 1;

  for (const { main, references } of records) {
    const {
      cdata, material, reference, dna,
    } = main;
    const {
      species, publication, persons, idWorld4,
    } = references;
    const {
      countedBy, collectedBy, identifiedBy, checkedBy,
    } = persons;

    const cdataToSave = await processCdata(
      cdata,
      countedBy,
      newlyCreatedRefs,
      accessToken,
    );
    const materialToSave = await processMaterial(
      material,
      collectedBy,
      identifiedBy,
      checkedBy,
      idWorld4,
      newlyCreatedRefs,
      accessToken,
    );
    const referenceToSave = await processReference(
      reference,
      species,
      publication,
      newlyCreatedRefs,
      accessToken,
    );

    await chromRecordFacade.saveUpdateChromrecordWithAll(
      {
        chromrecord: cdataToSave,
        material: materialToSave,
        reference: referenceToSave,
        dna,
      },
      accessToken,
    );

    if (increase) {
      increase(i);
    }
    i += 1;
  }
}

export default {
  loadData,
  importData,
};
