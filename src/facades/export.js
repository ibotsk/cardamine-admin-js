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

async function getCdataForExport(ids, accessToken) {
  const whereObj = {
    or: ids.map((id) => ({ id })),
  };
  const where = JSON.stringify(whereObj);
  return getRequest(chromosomeDataUri.exportUri, { where }, accessToken);
}

async function getChecklistForExport(ids, accessToken, format = undefined) {
  const wb = new WhereBuilder();
  if (ids && ids.length > 0) {
    wb.add(inq('id', ids));
  }
  const where = wb.buildString();
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
