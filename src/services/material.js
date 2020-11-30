import axios from './axios';
import Mustache from './mustache';

import config from '../config';

async function patchAttributes(id, data, accessToken) {
  const uri = Mustache.render(
    config.uris.materialUri.patchAttributesUri, { id, accessToken },
  );
  await axios.patch(uri, data);
}

export default {
  patchAttributes,
};
