import { getRequest, patchRequest } from '../services/backend';

import config from '../config';
import { helperUtils } from '../utils';

const { uris: { materialUri } } = config;

async function getCoordinates(
  accessToken, whereObj = {}, offset = 0, limit = 20,
) {
  const where = JSON.stringify(whereObj);
  return getRequest(
    materialUri.getCoordinatesUri, { offset, limit, where }, accessToken,
  );
}

async function getCoordinatesCount(where = {}, accessToken) {
  const whereString = JSON.stringify(where);
  const { count } = await getRequest(
    materialUri.countUri, { whereString }, accessToken,
  );
  return count;
}

async function saveCoordinatesForMap(id, lat, lon, accessToken) {
  const coordinatesForMap = helperUtils.coordinatesToSave(lat, lon);

  const data = {
    coordinatesForMap,
  };
  return patchRequest(
    materialUri.patchAttributesUri, data, { id }, accessToken,
  );
}

export default {
  getCoordinates,
  getCoordinatesCount,
  saveCoordinatesForMap,
};
