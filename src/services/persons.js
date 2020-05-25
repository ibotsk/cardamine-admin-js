import template from 'url-template';
import axios from './axios';

import config from '../config/config';

async function getPersonById({ id, accessToken }) {
  const getByIdUri = template
    .parse(config.uris.personsUri.getByIdUri)
    .expand({ id, accessToken });
  const response = await axios.get(getByIdUri);
  return response.data;
}

async function getPersonByName({ name, accessToken }) {
  const getByNameUri = template
    .parse(config.uris.personsUri.getByNameUri)
    .expand({ name, accessToken });
  const response = await axios.get(getByNameUri);
  return response.data;
}

async function putPerson({ data, accessToken }) {
  const personsUri = template
    .parse(config.uris.personsUri.baseUri)
    .expand({ accessToken });
  return axios.put(personsUri, data);
}

export default {
  getPersonById,
  getPersonByName,
  putPerson,
};
