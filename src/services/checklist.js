import axios from 'axios';
import template from 'url-template';

import config from '../config/config';

const getAllSpecies = async (accessToken, format) => {
    const getAllListOfSpeciesUri = template.parse(config.uris.listOfSpeciesUri.getAllWOrderUri).expand({ accessToken });
    const response = await axios.get(getAllListOfSpeciesUri);

    const listOfSpeciess = response.data;
    if (!format) {
        return listOfSpeciess;
    }

    return listOfSpeciess.map(format);
}

export default { 
    getAllSpecies
}