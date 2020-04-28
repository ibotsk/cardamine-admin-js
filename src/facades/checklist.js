import checklistService from '../services/checklist';

import helper from '../utils/helper';
import whereHelper from '../utils/where';
import config from '../config/config';

// for synonyms of one type
const setSynonymOrder = (synonyms) => {
  for (const [i, s] of synonyms.entries()) {
    s.rorder = i + 1;
  }
};

const submitSynonyms = async ({ synonyms, deletedSynonyms, accessToken }) => {
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
};

// -------------------------------------------------------- //

async function getAllSpecies(accessToken) {
  return checklistService.getAllSpecies(accessToken);
}

async function getSpeciesByIdWithFilter(id, accessToken) {
  return checklistService.getSpeciesByIdWithFilter({ id, accessToken });
}

async function getSpeciesById({ id, accessToken }) {
  return checklistService.getSpeciesById({ id, accessToken });
}

async function getSynonyms(id, accessToken) {
  const nomenclatoricSynonyms = await checklistService.getSynonymsNomenclatoricOf(
    { id, accessToken }
  );
  nomenclatoricSynonyms.sort(helper.listOfSpeciesSorterLex);

  const taxonomicSynonyms = await checklistService.getSynonymsTaxonomicOf({
    id,
    accessToken,
  });
  taxonomicSynonyms.sort(helper.listOfSpeciesSorterLex);

  const invalidDesignations = await checklistService.getInvalidDesignationsOf({
    id,
    accessToken,
  });
  invalidDesignations.sort(helper.listOfSpeciesSorterLex);

  const misidentifications = await checklistService.getMisidentificationsOf({
    id,
    accessToken,
  });
  misidentifications.sort(helper.listOfSpeciesSorterLex);

  return {
    nomenclatoricSynonyms,
    taxonomicSynonyms,
    invalidDesignations,
    misidentifications,
  };
}

async function getBasionymsFor(id, accessToken) {
  const basionymFor = await checklistService.getBasionymFor({
    id,
    accessToken,
  });
  const replacedFor = await checklistService.getReplacedFor({
    id,
    accessToken,
  });
  const nomenNovumFor = await checklistService.getNomenNovumFor({
    id,
    accessToken,
  });
  return {
    basionymFor,
    replacedFor,
    nomenNovumFor,
  };
}

async function getSpeciesByAll(data, accessToken, formatFound = undefined) {
  const where = whereHelper.whereDataAll(data);

  if (!where) {
    return null;
  }

  const species = await checklistService.getSpeciesByAll({
    where: JSON.stringify(where),
    accessToken,
  });

  let found = species;
  if (formatFound) {
    found = formatFound(found);
  }

  return {
    term: data,
    found,
  };
}

async function saveSpecies({ data, accessToken }) {
  const curatedData = { ...data };
  if (!data.ntype) {
    curatedData.ntype = config.defaultLosType;
  }
  const response = await checklistService.putSpecies({
    data: curatedData,
    accessToken,
  });
  return response.data;
}

async function saveSpeciesAndSynonyms({
  species,
  accessToken,
  synonyms,
  deletedSynonyms = [],
}) {
  checklistService.putSpecies({ data: species, accessToken });
  submitSynonyms({
    accessToken,
    synonyms,
    deletedSynonyms,
  });
}

async function deleteSpecies({ id, accessToken }) {
  checklistService.deleteSpecies({ id, accessToken });
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
