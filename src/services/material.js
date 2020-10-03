import template from 'url-template';
import axios from './axios';

import config from '../config/config';

async function patchAttributes(id, data, accessToken) {
  const uri = template.parse(config.uris.materialUri.patchAttributesUri)
    .expand({ id, accessToken });
  await axios.patch(uri, data);
}

export default {
  patchAttributes,
};
