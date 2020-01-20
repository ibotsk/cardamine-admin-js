import keyBy from 'lodash.keyby';

import checklistService from '../services/checklist';

import helper from '../utils/helper';
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

    // const misidentifications = await checklistService.getMisidentificationsOf({ id, accessToken });
    // misidentifications.sort(helper.listOfSpeciesSorterLex);

    const misidentifications = await getMisidentificationsWithMetadata(id, accessToken);

    return {
        nomenclatoricSynonyms,
        taxonomicSynonyms,
        invalidDesignations,
        misidentifications
    };
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

const saveSpecies = ({ data, accessToken }) => checklistService.putSpecies({ data, accessToken });

const saveSpeciesAndSynonyms = async ({
    species,
    accessToken,
    nomenclatoricSynonyms,
    taxonomicSynonyms,
    invalidDesignations,
    misidentifications,
    isNomenclatoricSynonymsChanged = true,
    isTaxonomicSynonymsChanged = true,
    isInvalidDesignationsChanged = true,
    isMisidentificationsChanged = true
}) => {

    checklistService.putSpecies({ data: species, accessToken });
    submitSynonyms({
        id: species.id,
        accessToken,
        nomenclatoricSynonyms,
        taxonomicSynonyms,
        invalidDesignations,
        misidentifications,
        isNomenclatoricSynonymsChanged,
        isTaxonomicSynonymsChanged,
        isInvalidDesignationsChanged,
        isMisidentificationsChanged
    });
}

async function getMisidentificationsWithMetadata(id, accessToken) {

    const misidentifications = await checklistService.getMisidentificationsOf({ id, accessToken });
    misidentifications.sort(helper.listOfSpeciesSorterLex);

    const filter = { where: { syntype: config.mappings.synonym.misidentification.numType } };
    const allSynonyms = await checklistService.getAllSynonymsOf({ id, accessToken, filter: JSON.stringify(filter) });

    return enrichWithMetadata(misidentifications, allSynonyms);
}

function enrichWithMetadata(collection, metadataArray) {

    const idToMetadata = keyBy(metadataArray, 'idSynonym');
    collection.forEach(e => e.metadata = idToMetadata[e.id] || {});

    return collection;
}

async function submitSynonyms({
    id,
    nomenclatoricSynonyms,
    taxonomicSynonyms,
    invalidDesignations,
    misidentifications,
    isNomenclatoricSynonymsChanged,
    isTaxonomicSynonymsChanged,
    isInvalidDesignationsChanged,
    isMisidentificationsChanged,
    accessToken }) {
    // get synonyms to be deleted
    const originalSynonyms = await checklistService.getAllSynonymsOf({ id, accessToken });

    const toBeDeleted = [];

    // save new
    const toBeDeletedNomenclatoric = resolveChangesAndSaveSynonyms(isNomenclatoricSynonymsChanged, id, nomenclatoricSynonyms, config.mappings.synonym.nomenclatoric.numType, originalSynonyms, accessToken);
    const toBeDeletedTaxonomic = resolveChangesAndSaveSynonyms(isTaxonomicSynonymsChanged, id, taxonomicSynonyms, config.mappings.synonym.taxonomic.numType, originalSynonyms, accessToken);
    const toBeDeletedInvalid = resolveChangesAndSaveSynonyms(isInvalidDesignationsChanged, id, invalidDesignations, config.mappings.synonym.invalid.numType, originalSynonyms, accessToken);
    const toBeDeletedMisidentified = resolveChangesAndSaveSynonyms(isMisidentificationsChanged, id, misidentifications, config.mappings.synonym.misidentification.numType, originalSynonyms, accessToken);

    toBeDeleted.push(...toBeDeletedNomenclatoric, ...toBeDeletedTaxonomic, ...toBeDeletedInvalid, ...toBeDeletedMisidentified);

    // delete originals
    for (const syn of toBeDeleted) {
        checklistService.deleteSynonym({ id: syn.id, accessToken });
    }
}

function resolveChangesAndSaveSynonyms(isChanged, id, list, numType, originalSynonyms, accessToken) {
    if (!isChanged) {
        return [];
    }
    const toBeDeleted = originalSynonyms.filter(s => s.syntype === numType);

    saveSynonyms(id, list, numType, accessToken);

    return toBeDeleted;
}

function saveSynonyms(id, list, syntype, accessToken) {
    let i = 1;
    for (const s of list) {
        // anything else except ids, type ond order will be set from metadata (if such exist)
        const { id: metaId, idParent: metaIdParent, idSynonym: metaIdSynonym, syntype: metaSyntype, rorder: metaRorder, ...otherMetadata } = s.metadata || {};

        const data = {
            idParent: id,
            idSynonym: s.id,
            syntype,
            rorder: i,
            ...otherMetadata
        };
        i++;
        checklistService.postSynonym({ data, accessToken });
    }
};

export default {
    getAllSpecies,
    getSpeciesById,
    getSpeciesByIdWithFilter,
    getSynonyms,
    getBasionymsFor,
    saveSpecies,
    saveSpeciesAndSynonyms
}