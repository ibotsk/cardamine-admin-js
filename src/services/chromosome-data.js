import template from 'url-template';
import axios from './axios';

import config from '../config/config';

/**
 * Calls get chromosome record by id, including material, reference and histories.
 * Returns objects chromrecord, material, reference, history.
 * @param {*} id 
 * @param {*} accessToken 
 */
const getChromosomeRecordById = async (id, accessToken) => {
    const getCdataByIdUri = template.parse(config.uris.chromosomeDataUri.getByIdUri).expand({ id, accessToken });
    const response = await axios.get(getCdataByIdUri); // get chromosome record

    return response.data;
}

/**
 * Calls get all persons
 * @param {*} accessToken 
 * @param {*} format Optional param, function to format data
 */
const getAllPersons = async (accessToken, format) => {
    const getAllPersonsUri = template.parse(config.uris.personsUri.getAllWOrderUri).expand({ accessToken });
    const response = await axios.get(getAllPersonsUri);

    const persons = response.data;
    if (!format) {
        return persons;
    }

    return persons.map(format);
}

const getAllWorld4s = async (accessToken, format) => {
    const getAllWorld4sUri = template.parse(config.uris.worldl4Uri.getAllWFilterUri).expand({ accessToken });
    const response = await axios.get(getAllWorld4sUri); // get all world4s

    const worlds = response.data;
    if (!format) {
        return worlds;
    }

    return worlds.map(format);
}

const getAllLiteratures = async (accessToken, format) => {
    const getAllLiteraturesUri = template.parse(config.uris.literaturesUri.getAllWOrderUri).expand({ accessToken });
    const response = await axios.get(getAllLiteraturesUri); // get all publications

    const literatures = response.data;
    if (!format) {
        return literatures;
    }

    return literatures.map(format);
}

const saveUpdateChromrecord = async (data, accessToken) => {
    const cdataUri = template.parse(config.uris.chromosomeDataUri.baseUri).expand({ accessToken });
    return await axios.put(cdataUri, data);
}

const saveUpdateMaterial = async (data, accessToken) => {
    const materialUri = template.parse(config.uris.materialUri.baseUri).expand({ accessToken });
    return await axios.put(materialUri, data);
}

const saveUpdateReference = async (data, accessToken) => {
    const referenceUri = template.parse(config.uris.referenceUri.baseUri).expand({ accessToken });
    return await axios.put(referenceUri, data);
}

export default {
    getChromosomeRecordById,
    getAllLiteratures,
    getAllPersons,
    getAllWorld4s,
    saveUpdateChromrecord,
    saveUpdateMaterial,
    saveUpdateReference
};