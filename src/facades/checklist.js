import checklistService from '../services/checklist';

import helper from '../utils/helper';
import whereHelper from '../utils/where';
import config from '../config/config';

const getAllSpecies = async accessToken => {
    return await checklistService.getAllSpecies(accessToken);
}

const getSpeciesByIdWithFilter = async (id, accessToken) => {
    return await checklistService.getSpeciesByIdWithFilter({ id, accessToken });
}

const getSpeciesById = async ({ id, accessToken }) => {
    return await checklistService.getSpeciesById({ id, accessToken });
}

const getSynonyms = async (id, accessToken) => {

    const nomenclatoricSynonyms = await checklistService.getSynonymsNomenclatoricOf({ id, accessToken });
    nomenclatoricSynonyms.sort(helper.listOfSpeciesSorterLex);

    const taxonomicSynonyms = await checklistService.getSynonymsTaxonomicOf({ id, accessToken });
    taxonomicSynonyms.sort(helper.listOfSpeciesSorterLex);

    const invalidDesignations = await checklistService.getInvalidDesignationsOf({ id, accessToken });
    invalidDesignations.sort(helper.listOfSpeciesSorterLex);

    return { nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations };
}

const getBasionymsFor = async (id, accessToken) => {
    const basionymFor = await checklistService.getBasionymFor({ id, accessToken });
    const replacedFor = await checklistService.getReplacedFor({ id, accessToken });
    const nomenNovumFor = await checklistService.getNomenNovumFor({ id, accessToken });
    return {
        basionymFor,
        replacedFor,
        nomenNovumFor
    }
}

const getSpeciesByAll = async (data, accessToken) => {
    const where = whereHelper.whereDataAll(data);

    if (!where) {
        return null;
    }

    const species = await checklistService.getSpeciesByAll({ where: JSON.stringify(where), accessToken });
    return {
        term: data,
        found: species
    }
}

const saveSpecies = async ({ data, accessToken }) => {
    await checklistService.putSpecies({ data, accessToken });
}

const saveSynonyms = async ({ id, list, syntype, accessToken }) => {
    let i = 1;
    for (const s of list) {
        const data = {
            idParent: id,
            idSynonym: s.id,
            syntype,
            rorder: i
        };
        i++;
        await checklistService.postSynonym({ data, accessToken });
    }
}

const submitSynonyms = async ({
    id,
    nomenclatoricSynonyms,
    taxonomicSynonyms,
    invalidDesignations,
    isNomenclatoricSynonymsChanged,
    isTaxonomicSynonymsChanged,
    isInvalidDesignationsChanged,
    accessToken }) => {
    // get synonyms to be deleted
    const originalSynonyms = await checklistService.getAllSynonymsOf({ id, accessToken });

    const toBeDeleted = [];

    // save new
    if (isNomenclatoricSynonymsChanged) {
        toBeDeleted.push(...originalSynonyms.filter(s => s.syntype === config.mappings.synonym.nomenclatoric.numType));
        await saveSynonyms({
            id,
            list: nomenclatoricSynonyms,
            syntype: config.mappings.synonym.nomenclatoric.numType,
            accessToken
        });
    }
    if (isTaxonomicSynonymsChanged) {
        toBeDeleted.push(...originalSynonyms.filter(s => s.syntype === config.mappings.synonym.taxonomic.numType));
        await saveSynonyms({
            id,
            list: taxonomicSynonyms,
            syntype: config.mappings.synonym.taxonomic.numType,
            accessToken
        });
    }
    if (isInvalidDesignationsChanged) {
        toBeDeleted.push(...originalSynonyms.filter(s => s.syntype === config.mappings.synonym.invalid.numType));
        await saveSynonyms({
            id,
            list: invalidDesignations,
            syntype: config.mappings.synonym.invalid.numType,
            accessToken
        });
    }

    // delete originals
    for (const syn of toBeDeleted) {
        // await axios.delete(synonymsByIdUri.expand({ id: syn.id, accessToken }));
        await checklistService.deleteSynonym({ id: syn.id, accessToken });
    }
}

const saveSpeciesAndSynonyms = async ({
    species,
    accessToken,
    nomenclatoricSynonyms,
    taxonomicSynonyms,
    invalidDesignations,
    isNomenclatoricSynonymsChanged = true,
    isTaxonomicSynonymsChanged = true,
    isInvalidDesignationsChanged = true }) => {

    await checklistService.putSpecies({ data: species, accessToken });
    await submitSynonyms({
        id: species.id,
        accessToken,
        nomenclatoricSynonyms,
        taxonomicSynonyms,
        invalidDesignations,
        isNomenclatoricSynonymsChanged,
        isTaxonomicSynonymsChanged,
        isInvalidDesignationsChanged
    });
}

export default {
    getAllSpecies,
    getSpeciesById,
    getSpeciesByIdWithFilter,
    getSpeciesByAll,
    getSynonyms,
    getBasionymsFor,
    saveSpecies,
    saveSynonyms,
    saveSpeciesAndSynonyms
}