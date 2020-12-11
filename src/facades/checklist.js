import { getRequest, putRequest, deleteRequest } from '../services/backend';

import { helperUtils, whereUtils } from '../utils';
import config from '../config';

const {
  uris: {
    synonymsUri,
    listOfSpeciesUri,
  },
} = config;

// for synonyms of one type
const setSynonymOrder = (synonyms) => {
  for (const [i, s] of synonyms.entries()) {
    s.rorder = i + 1;
  }
};

const submitSynonyms = async (synonyms, deletedSynonyms, accessToken) => {
  const typeOfSynonyms = Object.keys(synonyms);
  for (const key of typeOfSynonyms) {
    setSynonymOrder(synonyms[key]);

    // TODO: Promise.all
    for (const synonym of synonyms[key]) {
      putRequest(synonymsUri.baseUri, synonym, undefined, accessToken);
    }
  }

  // delete
  // TODO: Promise.all
  for (const id of deletedSynonyms) {
    deleteRequest(synonymsUri.synonymsByIdUri, { id }, accessToken);
  }
};

// -------------------------------------------------------- //

async function getAllSpecies(accessToken, format = undefined) {
  const response = await getRequest(
    listOfSpeciesUri.getAllWOrderUri, undefined, accessToken,
  );
  if (!format) {
    return response;
  }
  return response.map(format);
}

async function getSpeciesByIdWithFilter(id, accessToken) {
  return getRequest(
    listOfSpeciesUri.getByIdWFilterUri, { id }, accessToken,
  );
}

async function getSpeciesById({ id, accessToken }) {
  return getRequest(
    listOfSpeciesUri.getByIdUri, { id }, accessToken,
  );
}

async function getSynonyms(id, accessToken) {
  const nomenclatoricSynonyms = await getRequest(
    listOfSpeciesUri.getNomenclatoricSynonymsUri, { id }, accessToken,
  );
  nomenclatoricSynonyms.sort(helperUtils.listOfSpeciesSorterLex);

  const taxonomicSynonyms = await getRequest(
    listOfSpeciesUri.getTaxonomicSynonymsUri, { id }, accessToken,
  );
  taxonomicSynonyms.sort(helperUtils.listOfSpeciesSorterLex);

  const invalidDesignations = await getRequest(
    listOfSpeciesUri.getInvalidSynonymsUri, { id }, accessToken,
  );
  invalidDesignations.sort(helperUtils.listOfSpeciesSorterLex);

  const misidentifications = await getRequest(
    listOfSpeciesUri.getMisidentificationUri, { id }, accessToken,
  );
  misidentifications.sort(helperUtils.listOfSpeciesSorterLex);

  return {
    nomenclatoricSynonyms,
    taxonomicSynonyms,
    invalidDesignations,
    misidentifications,
  };
}

async function getBasionymsFor(id, accessToken) {
  const basionymFor = await getRequest(
    listOfSpeciesUri.getBasionymForUri, { id }, accessToken,
  );
  const replacedFor = await getRequest(
    listOfSpeciesUri.getReplacedForUri, { id }, accessToken,
  );
  const nomenNovumFor = await getRequest(
    listOfSpeciesUri.getNomenNovumForUri, { id }, accessToken,
  );
  return {
    basionymFor,
    replacedFor,
    nomenNovumFor,
  };
}

async function getSpeciesByAll(data, accessToken, formatFound = undefined) {
  const whereObj = whereUtils.whereDataAll(data);
  if (!whereObj) {
    return null;
  }

  const where = JSON.stringify(whereObj);
  const species = await getRequest(
    listOfSpeciesUri.getAllWFilterUri, { where }, accessToken,
  );

  let found = species;
  if (formatFound) {
    found = formatFound(found);
  }
  return {
    term: data,
    found,
  };
}

async function saveSpecies(data, accessToken) {
  const curatedData = { ...data };
  if (!data.ntype) {
    curatedData.ntype = config.constants.defaultLosType;
  }
  const response = await putRequest(
    listOfSpeciesUri.baseUri, curatedData, undefined, accessToken,
  );
  return response.data;
}

async function saveSpeciesAndSynonyms({
  species,
  accessToken,
  synonyms,
  deletedSynonyms = [],
}) {
  putRequest(
    listOfSpeciesUri.baseUri, species, undefined, accessToken,
  );
  submitSynonyms(
    synonyms,
    deletedSynonyms,
    accessToken,
  );
}

async function deleteSpecies(id, accessToken) {
  return deleteRequest(
    listOfSpeciesUri.getByIdUri, { id }, accessToken,
  );
}

function createSynonym(idParent, idSynonym, syntype) {
  return {
    idParent,
    idSynonym,
    syntype,
  };
}

export default {
  getAllSpecies,
  getSpeciesById,
  getSpeciesByIdWithFilter,
  getSpeciesByAll,
  getSynonyms,
  getBasionymsFor,
  saveSpecies,
  saveSpeciesAndSynonyms,
  deleteSpecies,
  createSynonym,
};
