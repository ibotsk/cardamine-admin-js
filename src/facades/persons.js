/* eslint-disable no-await-in-loop */
import { getRequest, putRequest } from '../services/backend';
import { utils } from '../utils';
import { WhereBuilder, functions } from '../utils/builders/where-builder';
import config from '../config';

const { eq } = functions;
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
      const where = new WhereBuilder().add(eq('persName', name)).buildString();
      const value = await getRequest(
        personsUri.getAllWWhereUri, { where }, accessToken,
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
  const response = await putRequest(
    personsUri.baseUri, data, undefined, accessToken,
  );
  return response.data;
}

export default {
  getPersonsByIdCurated,
  getPersonsByName,
  savePerson,
};
