import personsService from '../services/persons';
import utils from '../utils/utils';

const getPersonsByIdCurated = async ({ id, accessToken }) => {
    const data = await personsService.getPersonById({ id, accessToken });
    return utils.nullToEmpty(data);
}

const getPersonsByName = async (names, accessToken, formatFound) => {
    const keys = Object.keys(names);

    const result = {};
    for (const key of keys) {
        const name = names[key];

        if (!name) {
            result[key] = null;
        } else {
            const value = await personsService.getPersonByName({ name, accessToken });

            let found = value;
            if (formatFound) {
                found = formatFound(found);
            }

            result[key] = {
                term: name,
                found
            };
        }
    }
    return result;
}

const savePerson = async ({ data, accessToken }) => {
    const response = await personsService.putPerson({ data, accessToken });
    return response.data;
}

export default {
    getPersonsByIdCurated,
    getPersonsByName,
    savePerson
}