import template from 'url-template';
import axios from './axios';

const getAll = async (uri, offset, where, limit, accessToken) => {
  const getAllUri = template.parse(uri).expand({ offset, where: JSON.stringify(where), limit, accessToken });
  const response = await axios.get(getAllUri);
  return response.data;
}

const getCount = async (uri, whereString, accessToken) => {
  const getCountUri = template.parse(uri).expand({ whereString, accessToken });
  const response = await axios.get(getCountUri);
  return response.data;
}

export default {
  getAll,
  getCount
}