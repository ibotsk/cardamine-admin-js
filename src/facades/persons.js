import personsService from '../services/persons';
import utils from '../utils/utils';

const getPersonsByIdCurated = async ({ id, accessToken }) => {
    const data = await personsService.getPersonById({ id, accessToken });
    return utils.nullToEmpty(data);
}

const savePerson = async ({ data, accessToken }) => {
    console.log('Saving person: ', data);
    
    await personsService.putPerson({ data, accessToken });
}

export default {
    getPersonsByIdCurated,
    savePerson
}