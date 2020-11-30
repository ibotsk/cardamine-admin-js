import axios from './axios';
import Mustache from './mustache';

import config from '../config';

async function getByDescription(description, accessToken) {
  const getAllWorld4sUri = Mustache.render(
    config.uris.worldl4Uri.getByDescription, { description, accessToken },
  );
  const response = await axios.get(getAllWorld4sUri); // get all world4s

  return response.data;
}

export default {
  getByDescription,
};
