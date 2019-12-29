import publicationsService from '../services/publications';
import utils from '../utils/utils';
import helper from '../utils/helper';
import whereHelper from '../utils/where';

const getPublicationByIdCurated = async ({ id, accessToken }) => {
    const data = await publicationsService.getPublicationById({ id, accessToken });
    return utils.nullToEmpty(data);
}

const getPublicationByAll = async (literatureData, accessToken) => {
    const where = whereHelper.whereDataAll(literatureData);
    if (!where) {
        return null;
    }
    const publication = await publicationsService.getPublicationByWhere({ where: JSON.stringify(where), offset: 0, limit: 2, accessToken });
    return {
        term: literatureData,
        found: publication
    };
}

const savePublicationCurated = async ({ data, accessToken }) => {
    const toBeSaved = helper.publicationCurateFields(data);
    await publicationsService.putPublication({ data: toBeSaved, accessToken });
}

export default {
    getPublicationByIdCurated,
    getPublicationByAll,
    savePublicationCurated
}