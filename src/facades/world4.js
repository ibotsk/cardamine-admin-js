import world4Service from '../services/world4';

async function getOneByDescription(
  description,
  accessToken,
  formatFound = undefined
) {
  const data = await world4Service.getByDescription(
    description.trim(),
    accessToken
  );

  if (data.length < 1) {
    return null;
  }
  if (data.length > 1) {
    throw new Error(`More than one World 4 found for "${description}"`);
  }

  let found = data;
  if (formatFound) {
    found = formatFound(found);
  }

  return {
    term: description,
    found,
  };
}

export default {
  getOneByDescription,
};
