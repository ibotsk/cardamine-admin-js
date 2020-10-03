import tableService from '../services/tables';

import config from '../config/config';

const { uris: { materialUri } } = config;

async function getCoordinates(
  accessToken, where = {}, offset = 0, limit = 20,
) {
  return tableService.getAll(
    materialUri.getCoordinatesUri, offset, where, limit, accessToken,
  );
}

async function getCoordinatesCount(where = {}, accessToken) {
  const whereString = JSON.stringify(where);
  const { count } = await tableService.getCount(
    materialUri.countUri, whereString, accessToken,
  );
  return count;
}

export default {
  getCoordinates,
  getCoordinatesCount,
};
