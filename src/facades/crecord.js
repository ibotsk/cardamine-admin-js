import chromDataService from '../services/chromosome-data';
import checklistService from '../services/checklist';
import helper from '../utils/helper';

const getChromosomeRecord = async (accessToken, idRecord) => {

    let chromrecord = {}, material = {}, reference = {}, dna = {}, histories = [];
    if (idRecord) {
        chromrecord = await chromDataService.getChromosomeRecordById(idRecord, accessToken);

        material = chromrecord.material || {};
        dna = chromrecord.dna || {};
        reference = material.reference || {};
        histories = chromrecord.histories || [];

        delete chromrecord.dna;
        delete chromrecord.material;
        delete chromrecord.histories;
        delete material.reference;
    }

    return ({
        chromrecord,
        dna,
        material,
        reference,
        histories
    });
}

const getLiteratures = async (accessToken, idLiterature) => {
    const literatures = await chromDataService.getAllLiteratures(accessToken, l => ({
        id: l.id,
        label: helper.parsePublication(l)
    }));
    const literatureInitial = literatures.find(l => l.id === idLiterature);

    return ({
        literatures,
        idLiteratureSelected: literatureInitial ? [literatureInitial] : null
    });
}

const getPersons = async (accessToken, { countedBy, collectedBy, identifiedBy, checkedBy }) => {
    const persons = await chromDataService.getAllPersons(accessToken, p => ({
        id: p.id,
        label: `${p.persName}`
    }));
    const countedByInitial = persons.find(p => p.id === countedBy);
    const collectedByInitial = persons.find(p => p.id === collectedBy);
    const identifiedByInitial = persons.find(p => p.id === identifiedBy);
    const checkedByInitial = persons.find(p => p.id === checkedBy);

    return ({
        persons,
        countedBySelected: countedByInitial ? [countedByInitial] : null,
        collectedBySelected: collectedByInitial ? [collectedByInitial] : null,
        identifiedBySelected: identifiedByInitial ? [identifiedByInitial] : null,
        checkedBySelected: checkedByInitial ? [checkedByInitial] : null
    });
}

const getSpecies = async (accessToken, idStandardisedName) => {
    const listOfSpecies = await checklistService.getAllSpecies(accessToken, l => ({
        id: l.id,
        label: helper.listOfSpeciesString(l)
    }));

    const originalIdentificationInitial = listOfSpecies.find(l => l.id === idStandardisedName);

    return ({
        listOfSpecies,
        idStandardisedNameSelected: originalIdentificationInitial ? [originalIdentificationInitial] : null
    });
}

const getWorld4s = async (accessToken, idWorld4) => {

    const world4s = await chromDataService.getAllWorld4s(accessToken, w => ({
        id: w.id,
        label: w.description,
        idWorld3: w.idParent
    }));
    const world4Initial = world4s.find(w => w.id === idWorld4);

    return ({
        world4s,
        idWorld4Selected: world4Initial ? [world4Initial] : null
    });
}

const saveUpdateChromrecordWithAll = async ({ chromrecord, dna, material, reference }, accessToken) => {

    const responseChrom = await chromDataService.saveUpdateChromrecord(chromrecord, accessToken);
    const responseMat = await chromDataService.saveUpdateMaterial({ ...material, idCdata: responseChrom.data.id }, accessToken);
    await chromDataService.saveUpdateReference({ ...reference, idMaterial: responseMat.data.id }, accessToken);
    await chromDataService.saveUpdateDna({ ...dna, idCdata: responseChrom.data.id }, accessToken);
}

export default {
    getChromosomeRecord,
    getLiteratures,
    getPersons,
    getSpecies,
    getWorld4s,
    saveUpdateChromrecordWithAll
};