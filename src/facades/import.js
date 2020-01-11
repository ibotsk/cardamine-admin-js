import helper from '../utils/helper';
import importUtils from '../utils/import';

import checklistFacade from './checklist';
import publicationsFacade from './publications';
import personsFacade from './persons';
import world4Facade from './world4';

const loadData = async (data, accessToken, increase = undefined) => {

    const dataToImport = importUtils.importCSV(data);

    const records = [];

    const total = data.length - 1;
    let i = 1;
    for (const row of dataToImport) {
        const { literature: refLiterature, standardizedName: refStandardizedName, idWorld4: refWorld4, ...refPersons } = row.references;

        let idWorld4 = null;
        if (refWorld4) {
            // world 4 must be present in the database, if not, it will not be created
            idWorld4 = await world4Facade.getOneByDescription(refWorld4, accessToken, getIdOfFound);
        }

        const species = await checklistFacade.getSpeciesByAll(refStandardizedName, accessToken, getIdOfFound);

        const literatureData = helper.publicationCurateStringDisplayType(refLiterature);
        const publication = await publicationsFacade.getPublicationByAll(literatureData, accessToken, getIdOfFound);

        const persons = await personsFacade.getPersonsByName(refPersons, accessToken, getIdOfFound);

        const record = {
            main: row.main,
            references: {
                species,
                publication,
                persons,
                idWorld4
            }
        };

        records.push(record);

        if (increase) {
            increase(i, total);
        }
        i++;
    }

    return {
        count: dataToImport.length,
        records
    };
};

export default {
    loadData
};