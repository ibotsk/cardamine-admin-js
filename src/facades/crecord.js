import { getRequest, postRequest, putRequest } from '../services/backend';

import config from '../config';

const {
  uris: {
    chromosomeDataUri,
    dnaUri,
    listOfSpeciesUri,
    literaturesUri,
    materialUri,
    personsUri,
    referenceUri,
    worldl4Uri,
  },
} = config;

async function getChromosomeRecord(accessToken, idRecord) {
  let chromrecord = {};
  let material = {};
  let reference = {};
  let dna = {};
  let histories = [];
  if (idRecord) {
    chromrecord = await getRequest(
      chromosomeDataUri.getByIdUri, { id: idRecord }, accessToken,
    );

    material = chromrecord.material || {};
    dna = chromrecord.dna || {};
    reference = material.reference || {};
    histories = chromrecord.histories || [];

    delete chromrecord.dna;
    delete chromrecord.material;
    delete chromrecord.histories;
    delete material.reference;
  }

  return {
    chromrecord,
    dna,
    material,
    reference,
    histories,
  };
}

async function getLiteratures(
  accessToken, idLiterature, format = undefined,
) {
  const literaturesRaw = await getRequest(
    literaturesUri.getAllWOrderUri, undefined, accessToken,
  );
  const literatures = format ? literaturesRaw.map(format) : literaturesRaw;
  const literatureInitial = literatures.find((l) => l.id === idLiterature);

  return {
    literatures,
    idLiteratureSelected: literatureInitial ? [literatureInitial] : null,
  };
}

async function getPersons(
  accessToken,
  {
    countedBy, collectedBy, identifiedBy, checkedBy,
  },
  format = undefined,
) {
  const personsRaw = await getRequest(
    personsUri.getAllWOrderUri, undefined, accessToken,
  );
  const persons = format ? personsRaw.map(format) : personsRaw;

  const countedByInitial = persons.find((p) => p.id === countedBy);
  const collectedByInitial = persons.find((p) => p.id === collectedBy);
  const identifiedByInitial = persons.find((p) => p.id === identifiedBy);
  const checkedByInitial = persons.find((p) => p.id === checkedBy);

  return {
    persons,
    countedBySelected: countedByInitial ? [countedByInitial] : null,
    collectedBySelected: collectedByInitial ? [collectedByInitial] : null,
    identifiedBySelected: identifiedByInitial ? [identifiedByInitial] : null,
    checkedBySelected: checkedByInitial ? [checkedByInitial] : null,
  };
}

async function getSpecies(
  accessToken, idStandardisedName, format = undefined,
) {
  const listOfSpeciesRaw = await getRequest(
    listOfSpeciesUri.getAllWOrderUri, undefined, accessToken,
  );
  const listOfSpecies = format ? listOfSpeciesRaw.map(format)
    : listOfSpeciesRaw;

  const originalIdentificationInitial = listOfSpecies.find(
    (l) => l.id === idStandardisedName,
  );

  return {
    listOfSpecies,
    idStandardisedNameSelected: originalIdentificationInitial
      ? [originalIdentificationInitial]
      : null,
  };
}

async function getWorld4s(accessToken, idWorld4, format = undefined) {
  const world4sRaw = await getRequest(
    worldl4Uri.getAllWFilterUri, undefined, accessToken,
  );
  const world4s = format ? world4sRaw.map(format) : world4sRaw;
  const world4Initial = world4s.find((w) => w.id === idWorld4);

  return {
    world4s,
    idWorld4Selected: world4Initial ? [world4Initial] : null,
  };
}

async function refreshAdminView(accessToken) {
  return postRequest(
    chromosomeDataUri.refreshAdminViewUri, undefined, undefined, accessToken,
  );
}

async function saveUpdateChromrecordWithAll(
  {
    chromrecord, dna, material, reference,
  },
  accessToken,
) {
  const responseChrom = await putRequest(
    chromosomeDataUri.baseUri, chromrecord, undefined, accessToken,
  );

  const materialData = { ...material, idCdata: responseChrom.data.id };
  const responseMat = await putRequest(
    materialUri.baseUri, materialData, undefined, accessToken,
  );

  const referenceData = { ...reference, idMaterial: responseMat.data.id };
  await putRequest(
    referenceUri.baseUri, referenceData, undefined, accessToken,
  );

  const dnaData = { ...dna, idCdata: responseChrom.data.id };
  await putRequest(
    dnaUri.baseUri, dnaData, undefined, accessToken,
  );

  await refreshAdminView(accessToken);
}

export default {
  getChromosomeRecord,
  getLiteratures,
  getPersons,
  getSpecies,
  getWorld4s,
  refreshAdminView,
  saveUpdateChromrecordWithAll,
};
