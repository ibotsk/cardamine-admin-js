import axios from './axios';
import Mustache from './mustache';

async function getAll(uri, offset, where, limit, accessToken) {
  const getAllUri = Mustache.render(
    uri, {
      offset, where: JSON.stringify(where), limit, accessToken,
    },
  );
  const response = await axios.get(getAllUri);
  return response.data;
}

async function getCount(uri, whereString, accessToken) {
  const getCountUri = Mustache.render(uri, { whereString, accessToken });
  const response = await axios.get(getCountUri);
  return response.data;
}

export default {
  getAll,
  getCount,
};
