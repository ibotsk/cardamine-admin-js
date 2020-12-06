import axios from './axios';
import Mustache from './mustache';

export async function getRequest(uri, params, accessToken) {
  const parsedUri = Mustache.render(uri, { ...params, accessToken });
  const response = await axios.get(parsedUri);
  return response.data;
}

export async function postRequest(uri, data, params, accessToken) {
  const parsedUri = Mustache.render(uri, { ...params, accessToken });
  return axios.post(parsedUri, data);
}

export async function putRequest(uri, data, params, accessToken) {
  const parsedUri = Mustache.render(uri, { ...params, accessToken });
  return axios.put(parsedUri, data);
}

export async function patchRequest(uri, data, params, accessToken) {
  const parsedUri = Mustache.render(uri, { ...params, accessToken });
  return axios.patch(parsedUri, data);
}

export async function deleteRequest(uri, params, accessToken) {
  const parsedUri = Mustache.render(uri, { ...params, accessToken });
  return axios.delete(parsedUri);
}
