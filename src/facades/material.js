import tableService from '../services/tables';
import materialService from '../services/material';

import config from '../config';
import { helperUtils } from '../utils';

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

async function saveCoordinatesForMap(id, lat, lon, accessToken) {
  const coordinatesForMap = helperUtils.coordinatesToSave(lat, lon);

  const data = {
    coordinatesForMap,
  };
  await materialService.patchAttributes(id, data, accessToken);
}

export default {
  getCoordinates,
  getCoordinatesCount,
  saveCoordinatesForMap,
};
