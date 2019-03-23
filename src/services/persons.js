import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const getPersonById = async ({ id, accessToken }) => {
    const getByIdUri = template.parse(config.uris.personsUri.getByIdUri).expand({ id, accessToken });
    const response = await axios.get(getByIdUri);
    return response.data;
}

const putPerson = async ({ data, accessToken }) => {
    const personsUri = template.parse(config.uris.personsUri.baseUri).expand({ accessToken });
    await axios.put(personsUri, data);
}

export default {
    getPersonById,
    putPerson
}