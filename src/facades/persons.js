/* eslint-disable no-await-in-loop */
import personsService from '../services/persons';
import utils from '../utils/utils';

async function getPersonsByIdCurated({ id, accessToken }) {
  const data = await personsService.getPersonById({ id, accessToken });
  return utils.nullToEmpty(data);
}

async function getPersonsByName(names, accessToken, formatFound) {
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
        term: {
          persName: name,
        },
        found,
      };
    }
  }
  return result;
}

async function savePerson({ data, accessToken }) {
  const response = await personsService.putPerson({ data, accessToken });
  return response.data;
}

export default {
  getPersonsByIdCurated,
  getPersonsByName,
  savePerson,
};
