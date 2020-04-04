import checklistService from '../services/checklist';

import helper from '../utils/helper';
import whereHelper from '../utils/where';

const getAllSpecies = async accessToken => {
  return await checklistService.getAllSpecies(accessToken);
}

const getSpeciesByIdWithFilter = async (id, accessToken) => {
  return await checklistService.getSpeciesByIdWithFilter({ id, accessToken });
}

const getSpeciesById = async ({ id, accessToken }) => {
  return await checklistService.getSpeciesById({ id, accessToken });
}

const getSynonyms = async (id, accessToken) => {

  const nomenclatoricSynonyms = await checklistService.getSynonymsNomenclatoricOf({ id, accessToken });
  nomenclatoricSynonyms.sort(helper.listOfSpeciesSorterLex);

  const taxonomicSynonyms = await checklistService.getSynonymsTaxonomicOf({ id, accessToken });
  taxonomicSynonyms.sort(helper.listOfSpeciesSorterLex);

  const invalidDesignations = await checklistService.getInvalidDesignationsOf({ id, accessToken });
  invalidDesignations.sort(helper.listOfSpeciesSorterLex);

  const misidentifications = await checklistService.getMisidentificationsOf({ id, accessToken });
  misidentifications.sort(helper.listOfSpeciesSorterLex);

  return {
    nomenclatoricSynonyms,
    taxonomicSynonyms,
    invalidDesignations,
    misidentifications
  };
}

const getBasionymsFor = async (id, accessToken) => {
  const basionymFor = await checklistService.getBasionymFor({ id, accessToken });
  const replacedFor = await checklistService.getReplacedFor({ id, accessToken });
  const nomenNovumFor = await checklistService.getNomenNovumFor({ id, accessToken });
  return {
    basionymFor,
    replacedFor,
    nomenNovumFor
  }
}

const getSpeciesByAll = async (data, accessToken, formatFound = undefined) => {
  const where = whereHelper.whereDataAll(data);

  if (!where) {
    return null;
  }

  const species = await checklistService.getSpeciesByAll({ where: JSON.stringify(where), accessToken });

  let found = species;
  if (formatFound) {
    found = formatFound(found);
  }

  return {
    term: data,
    found
  }
}

const saveSpecies = async ({ data, accessToken }) => checklistService.putSpecies({ data, accessToken });

const saveSpeciesAndSynonyms = async ({
  species,
  accessToken,
  synonyms,
  deletedSynonyms = []
}) => {

  checklistService.putSpecies({ data: species, accessToken });
  submitSynonyms({
    accessToken,
    synonyms,
    deletedSynonyms
  });
};

const deleteSpecies = async ({ id, accessToken }) => checklistService.deleteSpecies({ id, accessToken });

function createSynonym(idParent, idSynonym, syntype) {
  return {
    idParent,
    idSynonym,
    syntype
  };
}

async function submitSynonyms({
  synonyms,
  deletedSynonyms,
  accessToken }) {

  const typeOfSynonyms = Object.keys(synonyms);
  for (const key of typeOfSynonyms) {

    setSynonymOrder(synonyms[key]);

    for (const synonym of synonyms[key]) {
      checklistService.putSynonym({ data: synonym, accessToken });
    }
  }

  // delete
  for (const id of deletedSynonyms) {
    checklistService.deleteSynonym({ id, accessToken });
  }
}

// for synonyms of one type
function setSynonymOrder(synonyms) {
  for (const [i, s] of synonyms.entries()) {
    s.rorder = i + 1;
  }
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
  createSynonym
}