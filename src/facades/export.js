import { getRequest } from '../services/backend';

import config from '../config';

const { uris: { chromosomeDataUri } } = config;

async function getForExport(ids, accessToken) {
  const whereObj = {
    or: ids.map((id) => ({ id })),
  };
  const where = JSON.stringify(whereObj);
  return getRequest(chromosomeDataUri.exportUri, { where }, accessToken);
}

export default {
  getForExport,
};
