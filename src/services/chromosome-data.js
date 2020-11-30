import axios from './axios';
import Mustache from './mustache';

import config from '../config';

const { uris } = config;

/**
 * Calls get chromosome record by id, including material, reference and histories.
 * Returns objects chromrecord, material, reference, history.
 * @param {*} id
 * @param {*} accessToken
 */
async function getChromosomeRecordById(id, accessToken) {
  const getCdataByIdUri = Mustache.render(
    uris.chromosomeDataUri.getByIdUri, { id, accessToken },
  );
  const response = await axios.get(getCdataByIdUri); // get chromosome record

  return response.data;
}

/**
 * Calls get all persons
 * @param {*} accessToken
 * @param {*} format Optional param, function to format data
 */
async function getAllPersons(accessToken, format) {
  const getAllPersonsUri = Mustache.render(
    uris.personsUri.getAllWOrderUri, { accessToken },
  );
  const response = await axios.get(getAllPersonsUri);

  const persons = response.data;
  if (!format) {
    return persons;
  }

  return persons.map(format);
}

async function getAllWorld4s(accessToken, format) {
  const getAllWorld4sUri = Mustache.render(
    uris.worldl4Uri.getAllWFilterUri, { accessToken },
  );
  const response = await axios.get(getAllWorld4sUri); // get all world4s

  const worlds = response.data;
  if (!format) {
    return worlds;
  }

  return worlds.map(format);
}

async function getAllLiteratures(accessToken, format) {
  const getAllLiteraturesUri = Mustache.render(
    uris.literaturesUri.getAllWOrderUri, { accessToken },
  );
  const response = await axios.get(getAllLiteraturesUri); // get all publications

  const literatures = response.data;
  if (!format) {
    return literatures;
  }

  return literatures.map(format);
}

async function saveUpdateChromrecord(data, accessToken) {
  const cdataUri = Mustache.render(
    uris.chromosomeDataUri.baseUri, { accessToken },
  );
  return axios.put(cdataUri, data);
}

async function saveUpdateMaterial(data, accessToken) {
  const materialUri = Mustache.render(
    uris.materialUri.baseUri, { accessToken },
  );
  return axios.put(materialUri, data);
}

async function saveUpdateReference(data, accessToken) {
  const referenceUri = Mustache.render(
    uris.referenceUri.baseUri, { accessToken },
  );
  return axios.put(referenceUri, data);
}

async function saveUpdateDna(data, accessToken) {
  const dnaUri = Mustache.render(
    uris.dnaUri.baseUri, { accessToken },
  );
  return axios.put(dnaUri, data);
}

async function getForExport(where, accessToken) {
  const exportUri = Mustache.render(
    uris.chromosomeDataUri.exportUri, { where, accessToken },
  );
  const response = await axios.get(exportUri);
  return response.data;
}

async function refreshAdminView(accessToken) {
  const refreshUri = Mustache.render(
    uris.chromosomeDataUri.refreshAdminViewUri, { accessToken },
  );
  return axios.post(refreshUri);
}

export default {
  getChromosomeRecordById,
  getAllLiteratures,
  getAllPersons,
  getAllWorld4s,
  getForExport,
  saveUpdateChromrecord,
  saveUpdateMaterial,
  saveUpdateReference,
  saveUpdateDna,
  refreshAdminView
};
