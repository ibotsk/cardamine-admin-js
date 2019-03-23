import template from 'url-template';
import axios from './axios';

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

const getSpeciesById = async (id, accessToken) => {
    const getByIdUri = template.parse(config.uris.listOfSpeciesUri.getByIdWFilterUri).expand({ id, accessToken });
    const response = await axios.get(getByIdUri);
    return response.data;
}

const getBasionymFor = async (id, accessToken) => {
    const getBasionymForUri = template.parse(config.uris.listOfSpeciesUri.getBasionymForUri).expand({ id, accessToken });
    const response = await axios.get(getBasionymForUri);
    return response.data;
}

const getReplacedFor = async (id, accessToken) => {
    const getReplacedForUri = template.parse(config.uris.listOfSpeciesUri.getReplacedForUri).expand({ id, accessToken });
    const response = await axios.get(getReplacedForUri);
    return response.data;
}

const getNomenNovumFor = async (id, accessToken) => {
    const getNomenNovumForUri = template.parse(config.uris.listOfSpeciesUri.getNomenNovumForUri).expand({ id, accessToken });
    const response = await axios.get(getNomenNovumForUri);
    return response.data;
}

/**
 * The result is ordered by id, the sorting from uri is not taken into account
 * @param {*} id 
 * @param {*} accessToken 
 */
const getSynonymsNomenclatoricOf = async (id, accessToken) => {
    const getSynonymsNomenclatoricUri = template.parse(config.uris.listOfSpeciesUri.getNomenclatoricSynonymsUri).expand({ id, accessToken });
    const response = await axios.get(getSynonymsNomenclatoricUri);
    return response.data;
}

// same
const getSynonymsTaxonomicOf = async (id, accessToken) => {
    const getSynonymsTaxonomicUri = template.parse(config.uris.listOfSpeciesUri.getTaxonomicSynonymsUri).expand({ id, accessToken });
    const response = await axios.get(getSynonymsTaxonomicUri);
    return response.data;
}

//same
const getInvalidDesignationsOf = async (id, accessToken) => {
    const getInvalidDesignationsUri = template.parse(config.uris.listOfSpeciesUri.getInvalidSynonymsUri).expand({ id, accessToken });
    const response = await axios.get(getInvalidDesignationsUri);
    return response.data;
}

const getAllSynonymsOf = async (id, accessToken) => {
    const losIsParentOfSynonymsUri = template.parse(config.uris.listOfSpeciesUri.getSynonymsOfParent).expand({ id, accessToken });
    const response = await axios.get(losIsParentOfSynonymsUri);
    return response.data;
}

const postSynonym = async (data, accessToken) => {
    const synonymsUri = template.parse(config.uris.synonymsUri.baseUri).expand({ accessToken });
    await axios.post(synonymsUri, data);
}

const deleteSynonym = async (id, accessToken) => {
    const synonymsByIdUri = template.parse(config.uris.synonymsUri.synonymsByIdUri).expand({ id, accessToken });
    await axios.delete(synonymsByIdUri);
}

const putSpecies = async (data, accessToken) => {
    const losUri = template.parse(config.uris.listOfSpeciesUri.baseUri).expand({ accessToken });
    await axios.put(losUri, data);
}

export default {
    getAllSpecies,
    getSpeciesById,
    getBasionymFor,
    getReplacedFor,
    getNomenNovumFor,
    getSynonymsNomenclatoricOf,
    getSynonymsTaxonomicOf,
    getInvalidDesignationsOf,
    getAllSynonymsOf,
    postSynonym,
    deleteSynonym,
    putSpecies
}