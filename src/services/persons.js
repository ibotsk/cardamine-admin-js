import axios from './axios';
import Mustache from './mustache';

import config from '../config';

const { uris } = config;

async function getPersonById({ id, accessToken }) {
  const getByIdUri = Mustache.render(
    uris.personsUri.getByIdUri, { id, accessToken },
  );
  const response = await axios.get(getByIdUri);
  return response.data;
}

async function getPersonByName({ name, accessToken }) {
  const getByNameUri = Mustache.render(
    uris.personsUri.getByNameUri, { name, accessToken },
  );
  const response = await axios.get(getByNameUri);
  return response.data;
}

async function putPerson({ data, accessToken }) {
  const personsUri = Mustache.render(
    uris.personsUri.baseUri, { accessToken },
  );
  return axios.put(personsUri, data);
}

export default {
  getPersonById,
  getPersonByName,
  putPerson,
};
