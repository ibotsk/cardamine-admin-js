import publicationsService from '../services/publications';
import utils from '../utils/utils';
import helper from '../utils/helper';

const getPublicationByIdCurated = async ({ id, accessToken }) => {
    const data = await publicationsService.getPublicationById({ id, accessToken });
    return utils.nullToEmpty(data);
}

const savePublicationCurated = async ({ data, accessToken }) => {
    const toBeSaved = helper.publicationCurateFields(data);
    await publicationsService.putPublication({ data: toBeSaved, accessToken });
}

export default {
    getPublicationByIdCurated,
    savePublicationCurated
}