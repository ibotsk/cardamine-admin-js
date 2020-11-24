import axios from './axios';
import Mustache from './mustache';

import config from '../config';

const { uris } = config;

async function getPublicationById({ id, accessToken }) {
  const getByIdUri = Mustache.render(
    uris.literaturesUri.getByIdUri, { id, accessToken },
  );
  const response = await axios.get(getByIdUri);
  return response.data;
}

async function getPublicationByWhere({
  where, offset, limit, accessToken,
}) {
  const getAllUri = Mustache.render(
    uris.literaturesUri.getAllWFilterUri, {
      offset, where, limit, accessToken,
    },
  );
  const response = await axios.get(getAllUri);
  return response.data;
}

async function putPublication({ data, accessToken }) {
  const literaturesUri = Mustache.render(
    uris.literaturesUri.baseUri, { accessToken },
  );
  return axios.put(literaturesUri, data);
}

export default {
  getPublicationById,
  getPublicationByWhere,
  putPublication,
};
