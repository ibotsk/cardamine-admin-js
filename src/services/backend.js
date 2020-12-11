import axios from './axios';
import Mustache from './mustache';

import { utils } from '../utils';

export async function getRequest(uri, params, accessToken) {
  const parsedUri = Mustache.render(uri, { ...params, accessToken });
  const response = await axios.get(parsedUri);
  return response.data;
}

export async function postRequest(uri, data, params, accessToken) {
  const parsedUri = Mustache.render(uri, { ...params, accessToken });
  const treatedData = utils.trimAndFixEmpty(data);
  return axios.post(parsedUri, treatedData);
}

export async function putRequest(uri, data, params, accessToken) {
  const parsedUri = Mustache.render(uri, { ...params, accessToken });
  const treatedData = utils.trimAndFixEmpty(data);
  return axios.put(parsedUri, treatedData);
}

export async function patchRequest(uri, data, params, accessToken) {
  const parsedUri = Mustache.render(uri, { ...params, accessToken });
  const treatedData = utils.trimAndFixEmpty(data);
  return axios.patch(parsedUri, treatedData);
}

export async function deleteRequest(uri, params, accessToken) {
  const parsedUri = Mustache.render(uri, { ...params, accessToken });
  return axios.delete(parsedUri);
}
