import personsService from '../services/persons';
import utils from '../utils/utils';

const getPersonsByIdCurated = async ({ id, accessToken }) => {
    const data = await personsService.getPersonById({ id, accessToken });
    return utils.nullToEmpty(data);
}

const getPersonsByName = async (names, accessToken) => {
    const keys = Object.keys(names);

    const result = {};
    for (const key of keys) {
        const name = names[key];

        if (!name) {
            result[key] = null;
        } else {
            const value = await personsService.getPersonByName({ name, accessToken });
            result[key] = {
                term: name,
                found: value
            };
        }
    }
    return result;
}

const savePerson = async ({ data, accessToken }) => {
    await personsService.putPerson({ data, accessToken });
}

export default {
    getPersonsByIdCurated,
    getPersonsByName,
    savePerson
}