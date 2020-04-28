import publicationsService from '../services/publications';
import utils from '../utils/utils';
import helper from '../utils/helper';
import whereHelper from '../utils/where';

async function getPublicationByIdCurated({ id, accessToken }) {
  const data = await publicationsService.getPublicationById({
    id,
    accessToken,
  });
  return utils.nullToEmpty(data);
}

async function getPublicationByAll(
  literatureData,
  accessToken,
  formatFound = undefined,
) {
  const where = whereHelper.whereDataAll(literatureData);
  if (!where) {
    return null;
  }
  const publication = await publicationsService.getPublicationByWhere({
    where: JSON.stringify(where),
    offset: 0,
    limit: 2,
    accessToken,
  });

  let found = publication;
  if (formatFound) {
    found = formatFound(found);
  }

  return {
    term: literatureData,
    found,
  };
}

async function savePublicationCurated({ data, accessToken }) {
  const toBeSaved = helper.publicationCurateFields(data);
  const response = await publicationsService.putPublication({
    data: toBeSaved,
    accessToken,
  });
  return response.data;
}

export default {
  getPublicationByIdCurated,
  getPublicationByAll,
  savePublicationCurated,
};
