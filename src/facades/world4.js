import { getRequest } from '../services/backend';

import config from '../config';

const {
  uris: { worldl4Uri },
} = config;

async function getOneByDescription(
  description,
  accessToken,
  formatFound = undefined,
) {
  const data = await getRequest(
    worldl4Uri.getByDescription, { description: description.trim() },
    accessToken,
  );

  if (data.length < 1) {
    return null;
  }
  if (data.length > 1) {
    throw new Error(`More than one World 4 found for "${description}"`);
  }

  const found = formatFound ? formatFound(data) : data;

  return {
    term: description,
    found,
  };
}

export default {
  getOneByDescription,
};
