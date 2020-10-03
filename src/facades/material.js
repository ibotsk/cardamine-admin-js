import tableService from '../services/tables';
import materialService from '../services/material';

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

async function saveCoordinatesForMap(id, lat, lon, accessToken) {
  let coordinatesForMap = null;

  // lat and lon can be 0
  if (lat !== null && lat !== undefined && lon !== null && lon !== undefined) {
    const coordinatesJSON = {
      coordinates: {
        lat,
        lon,
      },
    };

    coordinatesForMap = JSON.stringify(coordinatesJSON);
  }

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
