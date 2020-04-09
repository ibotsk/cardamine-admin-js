import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const getByDescription = async (description, accessToken) => {
  const getAllWorld4sUri = template.parse(config.uris.worldl4Uri.getByDescription).expand({ description, accessToken });
  const response = await axios.get(getAllWorld4sUri); // get all world4s

  return response.data;
}

export default {
  getByDescription
}