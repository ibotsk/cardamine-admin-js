/* eslint-disable no-await-in-loop */
import { getRequest, putRequest } from '../services/backend';
import { utils } from '../utils';
import config from '../config';

const {
  uris: { personsUri },
} = config;

async function getPersonsByIdCurated(id, accessToken) {
  const data = await getRequest(personsUri.getByIdUri, { id }, accessToken);
  return utils.nullToEmpty(data);
}

async function getPersonsByName(names, accessToken, formatFound = undefined) {
  const keys = Object.keys(names);

  const result = {};
  for (const key of keys) {
    const name = names[key];

    if (!name) {
      result[key] = null;
    } else {
      const value = await getRequest(
        personsUri.getByNameUri, { name }, accessToken,
      );

      const found = formatFound ? formatFound(value) : value;

      result[key] = {
        term: {
          persName: name,
        },
        found,
      };
    }
  }
  return result;
}

async function savePerson(data, accessToken) {
  const response = await putRequest(personsUri.baseUri, data, {}, accessToken);
  return response.data;
}

export default {
  getPersonsByIdCurated,
  getPersonsByName,
  savePerson,
};
