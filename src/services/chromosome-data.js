import template from 'url-template';
import axios from './axios';

import config from '../config/config';

/**
 * Calls get chromosome record by id, including material, reference and histories.
 * Returns objects chromrecord, material, reference, history.
 * @param {*} id
 * @param {*} accessToken
 */
async function getChromosomeRecordById(id, accessToken) {
  const getCdataByIdUri = template
    .parse(config.uris.chromosomeDataUri.getByIdUri)
    .expand({ id, accessToken });
  const response = await axios.get(getCdataByIdUri); // get chromosome record

  return response.data;
}

/**
 * Calls get all persons
 * @param {*} accessToken
 * @param {*} format Optional param, function to format data
 */
async function getAllPersons(accessToken, format) {
  const getAllPersonsUri = template
    .parse(config.uris.personsUri.getAllWOrderUri)
    .expand({ accessToken });
  const response = await axios.get(getAllPersonsUri);

  const persons = response.data;
  if (!format) {
    return persons;
  }

  return persons.map(format);
}

async function getAllWorld4s(accessToken, format) {
  const getAllWorld4sUri = template
    .parse(config.uris.worldl4Uri.getAllWFilterUri)
    .expand({ accessToken });
  const response = await axios.get(getAllWorld4sUri); // get all world4s

  const worlds = response.data;
  if (!format) {
    return worlds;
  }

  return worlds.map(format);
}

async function getAllLiteratures(accessToken, format) {
  const getAllLiteraturesUri = template
    .parse(config.uris.literaturesUri.getAllWOrderUri)
    .expand({ accessToken });
  const response = await axios.get(getAllLiteraturesUri); // get all publications

  const literatures = response.data;
  if (!format) {
    return literatures;
  }

  return literatures.map(format);
}

async function saveUpdateChromrecord(data, accessToken) {
  const cdataUri = template
    .parse(config.uris.chromosomeDataUri.baseUri)
    .expand({ accessToken });
  return axios.put(cdataUri, data);
}

async function saveUpdateMaterial(data, accessToken) {
  const materialUri = template
    .parse(config.uris.materialUri.baseUri)
    .expand({ accessToken });
  return axios.put(materialUri, data);
}

async function saveUpdateReference(data, accessToken) {
  const referenceUri = template
    .parse(config.uris.referenceUri.baseUri)
    .expand({ accessToken });
  return axios.put(referenceUri, data);
}

async function saveUpdateDna(data, accessToken) {
  const dnaUri = template
    .parse(config.uris.dnaUri.baseUri)
    .expand({ accessToken });
  return axios.put(dnaUri, data);
}

async function getForExport(where, accessToken) {
  const exportUri = template
    .parse(config.uris.chromosomeDataUri.exportUri)
    .expand({ where, accessToken });
  const response = await axios.get(exportUri);
  return response.data;
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
};
