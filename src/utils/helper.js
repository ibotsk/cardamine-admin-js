import Mustache from 'mustache';
import config from '../config';
import formatter from './formatter';

const {
  constants: {
    mustacheTags,
  },
  nomenclature: {
    name: configName,
  },
  format: {
    formatted: ff,
    plain: plf,
  },
  mappings: {
    publication: {
      displayType: displayTypeConfig,
      displayTypeStringToId: displayTypeStringToIdConfig,
    },
  },
} = config;

const tags = mustacheTags.publication;

const o = (string, format) => {
  let s = '';
  if (string) {
    s = string.trim();
  }
  return { string: s, format };
};

const Formatted = (string) => o(string, ff);
const Plain = (string) => o(string, plf);

const makeSl = (string) => {
  const { sl } = configName;
  if (string && string.includes(sl)) {
    const modString = string.replace(sl, '');
    return { s: modString, hasSl: true };
  }
  return { s: string, hasSl: false };
};

/*
    For every property in config.nomenclature.name.infra

    Names of the infra taxa must match the ones of the listOfSpecies table columns.
    Notho- are not used.
*/
const infraTaxa = (nomenclature) => {
  let infs = [];

  const configInfraTaxa = configName.infra;

  for (const infra of Object.keys(configInfraTaxa)) {
    const infraValue = nomenclature[infra];

    if (infraValue) {
      const infraLabel = configInfraTaxa[infra];
      infs = infs.concat([Plain(infraLabel), Formatted(infraValue)]);
    }
  }

  return infs;
};

const invalidDesignation = (name, syntype) => {
  if (syntype === '1') {
    let newname = [];
    newname.push(Plain('"'));
    newname = newname.concat(name);
    newname.push(Plain('"'));
    return newname;
  }
  return name;
};

// -------------------------------------------------------- //

const listOfSpeciesFormat = (nomenclature, options = {}) => {
  const opts = {
    isPublication: false,
    isTribus: false,
    ...options,
  };

  const {
    species, genus,
    subsp, var: varieta, forma,
    authors, publication, tribus,
  } = nomenclature;

  let isAuthorLast = true;

  let name = [];
  const slResult = makeSl(species);

  name.push(Formatted(genus));
  name.push(Formatted(slResult.s));

  if (slResult.hasSl) {
    name.push(Plain(configName.sl));
  }

  const infras = infraTaxa(nomenclature);

  if (species === subsp || species === varieta || species === forma) {
    if (authors) {
      name.push(Plain(authors));
    }
    isAuthorLast = false;
  }

  name = name.concat(infras);

  if (isAuthorLast && authors) {
    name.push(Plain(authors));
  }

  if (nomenclature.hybrid) {
    const h = {
      genus: nomenclature.genusH,
      species: nomenclature.speciesH,
      subsp: nomenclature.subspH,
      var: nomenclature.varH,
      subvar: nomenclature.subvarH,
      forma: nomenclature.formaH,
      nothosubsp: nomenclature.nothosubspH,
      nothoforma: nomenclature.nothoformaH,
      authors: nomenclature.authorsH,
    };
    name.push(Plain(configName.hybrid));
    name = name.concat(listOfSpeciesFormat(h));
  }

  name = invalidDesignation(name, options.syntype);

  if (opts.isPublication && publication) {
    name.push(Plain(','));
    name.push(Plain(publication));
  }
  if (opts.isTribus && tribus) {
    name.push(Plain(tribus));
  }
  return name;
};

function listOfSpeciesForComponent(name, formatString, options = {}) {
  const nameArr = listOfSpeciesFormat(name, options);

  const formattedNameArr = nameArr.map((t) => {
    if (t.format === ff) {
      return formatter.format(t.string, formatString);
    }
    return t.string;
  });

  return formattedNameArr
    .reduce((acc, el) => acc.concat(el, ' '), [])
    .slice(0, -1)
    .filter((e, i, arr) => ( // remove all spaces that are followed by a comma
      e !== ' ' || arr[i + 1] === undefined || arr[i + 1] !== ','
    ));
}

function listOfSpeciesString(name, options) {
  if (!name) {
    return undefined;
  }
  return listOfSpeciesForComponent(name, 'plain', options).join('');
}

function listOfSpeciesSorterLex(losA, losB) {
  // a > b = 1
  if (losA.genus > losB.genus) {
    return 1;
  }
  if (losA.genus < losB.genus) {
    return -1;
  }
  if (losA.species > losB.species) {
    return 1;
  }
  if (losA.species < losB.species) {
    return -1;
  }
  if (losA.subsp > losB.subsp) {
    return 1;
  }
  if (losA.subsp < losB.subsp) {
    return -1;
  }
  if (losA.var > losB.var) {
    return 1;
  }
  if (losA.var < losB.var) {
    return -1;
  }
  if (losA.forma > losB.forma) {
    return 1;
  }
  if (losA.forma < losB.forma) {
    return -1;
  }
  if (losA.subvar > losB.subvar) {
    return 1;
  }
  if (losA.subvar < losB.subvar) {
    return -1;
  }
  if (losA.authors > losB.authors) {
    return 1;
  }
  if (losA.authors < losB.authors) {
    return -1;
  }
  // hybrid fields next
  if (losA.genusH > losB.genusH) {
    return 1;
  }
  if (losA.genusH < losB.genusH) {
    return -1;
  }
  if (losA.speciesH > losB.speciesH) {
    return 1;
  }
  if (losA.speciesH < losB.speciesH) {
    return -1;
  }
  if (losA.subspH > losB.subspH) {
    return 1;
  }
  if (losA.subspH < losB.subspH) {
    return -1;
  }
  if (losA.varH > losB.varH) {
    return 1;
  }
  if (losA.varH < losB.varH) {
    return -1;
  }
  if (losA.formaH > losB.formaH) {
    return 1;
  }
  if (losA.formaH < losB.formaH) {
    return -1;
  }
  if (losA.subvarH > losB.subvarH) {
    return 1;
  }
  if (losA.subvarH < losB.subvarH) {
    return -1;
  }
  if (losA.authorsH > losB.authorsH) {
    return 1;
  }
  if (losA.authorsH < losB.authorsH) {
    return -1;
  }
  return 0;
}

function synonymSorterLex(synA, synB) {
  return listOfSpeciesSorterLex(synA.synonym, synB.synonym);
}

function parsePublication(publication) {
  if (!publication.displayType) {
    return undefined;
  }
  const typeMapping = displayTypeConfig[publication.displayType].name;
  const template = config.nomenclature.publication[typeMapping];

  return Mustache.render(template, {
    authors: publication.paperAuthor,
    title: publication.paperTitle,
    series: publication.seriesSource,
    volume: publication.volume,
    issue: publication.issue ? `(${publication.issue})` : '',
    publisher: publication.publisher,
    editor: publication.editor,
    year: publication.year,
    pages: publication.pages,
    journal: publication.journalName,
  }, {}, tags);
}

// useful when changing type of publication, so the unused fields are set to empty
function publicationCurateFields(publication) {
  const { displayType } = publication;
  const usedFields = displayTypeConfig[displayType].columns;
  const fieldsToBeEmpty = displayTypeConfig.nullableFields.filter(
    (el) => !usedFields.includes(el),
  );

  const curatedPubl = { ...publication };
  for (const field of fieldsToBeEmpty) {
    curatedPubl[field] = '';
  }
  return curatedPubl;
}

function publicationCurateStringDisplayType(publication) {
  const nonEmptyProps = Object.keys(publication).filter(
    (prop) => !!publication[prop],
  );
  if (nonEmptyProps.length === 0) {
    return publication;
  }

  const displayTypeStr = publication.displayType;
  const displayTypeId = displayTypeStringToIdConfig[displayTypeStr];

  if (!displayTypeId) {
    throw new Error(`Unknown display type "${displayTypeStr}"`);
  }

  return {
    ...publication,
    displayType: displayTypeId,
  };
}

function coordinatesToSave(lat, lon) {
  let result = null;

  // lat and lon can be 0
  if (lat !== null && lat !== undefined && lon !== null && lon !== undefined) {
    const coordinatesJSON = {
      coordinates: {
        lat,
        lon,
      },
    };

    result = JSON.stringify(coordinatesJSON);
  }

  return result;
}

export default {
  listOfSpeciesForComponent,
  listOfSpeciesString,
  listOfSpeciesSorterLex,
  publicationCurateFields,
  publicationCurateStringDisplayType,
  synonymSorterLex,
  parsePublication,
  coordinatesToSave,
};
