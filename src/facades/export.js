import { getRequest } from '../services/backend';

import config from '../config';
import { WhereBuilder, functions } from '../utils/builders/where-builder';
import { filterUtils } from '../utils';

const {
  uris: {
    chromosomeDataUri,
    listOfSpeciesUri,
  },
  nomenclature: { filter: { filters } },
} = config;

const { inq } = functions;

const whereIdIn = (ids) => {
  const wb = new WhereBuilder();
  if (ids && ids.length > 0) {
    wb.add(inq('id', ...ids));
  }
  return wb.buildString();
};

async function getCdataForExport(ids, accessToken, format = undefined) {
  const where = whereIdIn(ids);
  const data = await getRequest(
    chromosomeDataUri.exportUri, { where }, accessToken,
  );
  if (format) {
    return data.map(format);
  }
  return data;
}

async function getChecklistForExport(ids, accessToken, format = undefined) {
  const where = whereIdIn(ids);
  const order = JSON.stringify(filterUtils.makeOrder(filters.listOfSpecies));
  const data = await getRequest(
    listOfSpeciesUri.exportUri, { where, order }, accessToken,
  );

  if (format) {
    return data.map(format);
  }
  return data;
}

export default {
  getCdataForExport,
  getChecklistForExport,
};
