import chromDataService from '../services/chromosome-data';
import checklistService from '../services/checklist';
import { helperUtils } from '../utils/';

async function getChromosomeRecord(accessToken, idRecord) {
  let chromrecord = {};
  let material = {};
  let reference = {};
  let dna = {};
  let histories = [];
  if (idRecord) {
    chromrecord = await chromDataService.getChromosomeRecordById(
      idRecord,
      accessToken,
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

async function getLiteratures(accessToken, idLiterature) {
  const literatures = await chromDataService.getAllLiteratures(
    accessToken,
    (l) => ({
      id: l.id,
      label: helperUtils.parsePublication(l),
    }),
  );
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
) {
  const persons = await chromDataService.getAllPersons(accessToken, (p) => ({
    id: p.id,
    label: `${p.persName}`,
  }));
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

async function getSpecies(accessToken, idStandardisedName) {
  const listOfSpecies = await checklistService.getAllSpecies(
    accessToken,
    (l) => ({
      id: l.id,
      label: helperUtils.listOfSpeciesString(l),
    }),
  );

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

async function getWorld4s(accessToken, idWorld4) {
  const world4s = await chromDataService.getAllWorld4s(accessToken, (w) => ({
    id: w.id,
    label: w.description,
    idWorld3: w.idParent,
  }));
  const world4Initial = world4s.find((w) => w.id === idWorld4);

  return {
    world4s,
    idWorld4Selected: world4Initial ? [world4Initial] : null,
  };
}

async function saveUpdateChromrecordWithAll(
  {
    chromrecord, dna, material, reference,
  },
  accessToken,
) {
  const responseChrom = await chromDataService.saveUpdateChromrecord(
    chromrecord,
    accessToken,
  );

  // material.coordinatesGeoref and coordinatesForMap must be saved as stringified jsons
  if (material.coordinatesGeoref) {
    // eslint-disable-next-line no-param-reassign
    material.coordinatesGeoref = JSON.stringify(material.coordinatesGeoref);
  }
  if (material.coordinatesForMap) {
    // eslint-disable-next-line no-param-reassign
    material.coordinatesForMap = JSON.stringify(material.coordinatesForMap);
  }

  const responseMat = await chromDataService.saveUpdateMaterial(
    { ...material, idCdata: responseChrom.data.id },
    accessToken,
  );
  await chromDataService.saveUpdateReference(
    { ...reference, idMaterial: responseMat.data.id },
    accessToken,
  );
  await chromDataService.saveUpdateDna(
    { ...dna, idCdata: responseChrom.data.id },
    accessToken,
  );
}

export default {
  getChromosomeRecord,
  getLiteratures,
  getPersons,
  getSpecies,
  getWorld4s,
  saveUpdateChromrecordWithAll,
};
