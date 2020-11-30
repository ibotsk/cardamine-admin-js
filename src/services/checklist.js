import axios from './axios';
import Mustache from './mustache';

import config from '../config';

const { uris } = config;

async function getAllSpecies(accessToken, format) {
  const getAllListOfSpeciesUri = Mustache.render(
    uris.listOfSpeciesUri.getAllWOrderUri, { accessToken },
  );
  const response = await axios.get(getAllListOfSpeciesUri);

  const listOfSpeciess = response.data;
  if (!format) {
    return listOfSpeciess;
  }

  return listOfSpeciess.map(format);
}

async function getSpeciesByIdWithFilter({ id, accessToken }) {
  const getByIdUri = Mustache.render(
    uris.listOfSpeciesUri.getByIdWFilterUri, { id, accessToken },
  );
  const response = await axios.get(getByIdUri);
  return response.data;
}

async function getSpeciesById({ id, accessToken }) {
  const getByIdUri = Mustache.render(
    uris.listOfSpeciesUri.getByIdUri, { id, accessToken },
  );
  const response = await axios.get(getByIdUri);
  return response.data;
}

async function getSpeciesByAll({ where, accessToken }) {
  const getByAllUri = Mustache.render(
    uris.listOfSpeciesUri.getAllWFilterUri, { where, accessToken },
  );
  const response = await axios.get(getByAllUri);
  return response.data;
}

async function getBasionymFor({ id, accessToken }) {
  const getBasionymForUri = Mustache.render(
    uris.listOfSpeciesUri.getBasionymForUri, { id, accessToken },
  );
  const response = await axios.get(getBasionymForUri);
  return response.data;
}

async function getReplacedFor({ id, accessToken }) {
  const getReplacedForUri = Mustache.render(
    uris.listOfSpeciesUri.getReplacedForUri, { id, accessToken },
  );
  const response = await axios.get(getReplacedForUri);
  return response.data;
}

async function getNomenNovumFor({ id, accessToken }) {
  const getNomenNovumForUri = Mustache.render(
    uris.listOfSpeciesUri.getNomenNovumForUri, { id, accessToken },
  );
  const response = await axios.get(getNomenNovumForUri);
  return response.data;
}

/**
 * The result is ordered by id, the sorting from uri is not taken into account
 * @param {*} id
 * @param {*} accessToken
 */
async function getSynonymsNomenclatoricOf({ id, accessToken }) {
  const getSynonymsNomenclatoricUri = Mustache.render(
    uris.listOfSpeciesUri.getNomenclatoricSynonymsUri, { id, accessToken },
  );
  const response = await axios.get(getSynonymsNomenclatoricUri);
  return response.data;
}

// same
async function getSynonymsTaxonomicOf({ id, accessToken }) {
  const getSynonymsTaxonomicUri = Mustache.render(
    uris.listOfSpeciesUri.getTaxonomicSynonymsUri, { id, accessToken },
  );
  const response = await axios.get(getSynonymsTaxonomicUri);
  return response.data;
}

// same
async function getInvalidDesignationsOf({ id, accessToken }) {
  const getInvalidDesignationsUri = Mustache.render(
    uris.listOfSpeciesUri.getInvalidSynonymsUri, { id, accessToken },
  );
  const response = await axios.get(getInvalidDesignationsUri);
  return response.data;
}

async function getMisidentificationsOf({ id, accessToken }) {
  const getMisidentificationsUri = Mustache.render(
    uris.listOfSpeciesUri.getMisidentificationUri, { id, accessToken },
  );
  const response = await axios.get(getMisidentificationsUri);
  return response.data;
}

/**
 *
 * @param {{ id: string, filter: string, accessToken: string }} param0
 */
async function getAllSynonymsOf({ id, filter = '{}', accessToken }) {
  const losIsParentOfSynonymsUri = Mustache.render(
    uris.listOfSpeciesUri.getSynonymsOfParent, { id, filter, accessToken },
  );
  const response = await axios.get(losIsParentOfSynonymsUri);
  return response.data;
}

async function postSynonym({ data, accessToken }) {
  const synonymsUri = Mustache.render(
    uris.synonymsUri.baseUri, { accessToken },
  );
  axios.post(synonymsUri, data);
}

async function putSynonym({ data, accessToken }) {
  const synonymsUri = Mustache.render(
    uris.synonymsUri.baseUri, { accessToken },
  );
  axios.put(synonymsUri, data);
}

async function deleteSynonym({ id, accessToken }) {
  const synonymsByIdUri = Mustache.render(
    uris.synonymsUri.synonymsByIdUri, { id, accessToken },
  );
  axios.delete(synonymsByIdUri);
}

async function putSpecies({ data, accessToken }) {
  const losUri = Mustache.render(
    uris.listOfSpeciesUri.baseUri, { accessToken },
  );
  return axios.put(losUri, data);
}

async function deleteSpecies({ id, accessToken }) {
  const losUri = Mustache.render(
    uris.listOfSpeciesUri.getByIdUri, { id, accessToken },
  );
  axios.delete(losUri);
}

export default {
  getAllSpecies,
  getSpeciesById,
  getSpeciesByIdWithFilter,
  getSpeciesByAll,
  getBasionymFor,
  getReplacedFor,
  getNomenNovumFor,
  getSynonymsNomenclatoricOf,
  getSynonymsTaxonomicOf,
  getInvalidDesignationsOf,
  getMisidentificationsOf,
  getAllSynonymsOf,
  postSynonym,
  putSynonym,
  deleteSynonym,
  putSpecies,
  deleteSpecies,
};
