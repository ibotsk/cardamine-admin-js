import {
  Document, Packer, Paragraph, TextRun,
} from 'docx';

import config from '../../../../config';

const { import: { checklist: { docx } } } = config;

const emptyParagraph = new Paragraph('');

const dividerParagraph = [
  new Paragraph({
    text: '',
    border: {
      bottom: {
        color: '#cecece',
        space: 1,
        value: 'single',
        size: 6,
      },
    },
  }),
  emptyParagraph,
];

const labelParagraph = (value) => (
  new Paragraph({
    children: [
      new TextRun({ text: `${value}: `, bold: true }),
    ],
  })
);

const labelValueParagraph = (label, value) => {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun(value),
    ],
  });
};

const bulletList = (label, values) => {
  if (!values || values.length === 0) {
    return [];
  }
  const labelPg = labelParagraph(label);
  const valuesPgs = values.map((v) => new Paragraph({
    text: v,
    bullet: {
      level: 0,
    },
  }));
  return [labelPg, ...valuesPgs];
};

/**
 * @param {string} label
 * @param {Array} values
 * @param {string} numberingReference reference to numbering style in config
 * @param {Array<string>} include array of property names to include to lvl 1
 */
const synonymList = (label, values, numberingReference) => {
  if (!values || values.length === 0) {
    return [];
  }
  const results = [];
  if (label) {
    results.push(labelParagraph(label));
  }
  values.forEach(({ name, misidentificationAuthor, synonymsNomenclatoric }) => {
    results.push(new Paragraph({
      text: name,
      numbering: {
        reference: numberingReference,
        level: 0,
      },
    }));
    if (misidentificationAuthor) {
      results.push(new Paragraph({
        numbering: {
          reference: numberingReference,
          level: 1,
        },
        children: [
          new TextRun({ text: 'Misidentified by: ', bold: true }),
          new TextRun(misidentificationAuthor),
        ],
      }));
    }
    if (synonymsNomenclatoric) {
      const snPgs = synonymsNomenclatoric.map((sn) => new Paragraph({
        text: sn.name,
        numbering: {
          reference: numberingReference,
          level: 1,
        },
      }));
      results.push(...snPgs);
    }
  });

  return results;
};

const makeAllSynonymsParagraphs = (
  synonymsNomenclatoric, synonymsTaxonomic,
  synonymsInvalid, synonymsMisidentification,
) => {
  const results = [];

  const synonymsNomenclatoricPgs = synonymList(
    undefined, synonymsNomenclatoric, 'synonyms-nomenclatoric-numbering',
  );
  const synonymsTaxonomicPgs = synonymList(
    undefined, synonymsTaxonomic, 'synonyms-taxonomic-numbering',
  );
  const synonymsInvalidPgs = synonymList(
    'Invalid designations', synonymsInvalid, 'synonyms-invalid-numbering',
  );
  const synonymsMisidentificationsPgs = synonymList(
    'Misidentifications', synonymsMisidentification,
    'synonyms-invalid-numbering',
  );

  if (synonymsNomenclatoricPgs.length > 0 || synonymsTaxonomicPgs.length > 0) {
    results.push(emptyParagraph);
    results.push(labelParagraph('Synonyms'));
  }
  results.push(...synonymsNomenclatoricPgs);
  if (synonymsNomenclatoricPgs.length > 0 && synonymsTaxonomicPgs.length > 0) {
    results.push(emptyParagraph);
  }
  results.push(...synonymsTaxonomicPgs);

  if (synonymsInvalidPgs.length > 0) {
    results.push(emptyParagraph);
    results.push(...synonymsInvalidPgs);
  }
  if (synonymsMisidentificationsPgs.length > 0) {
    results.push(emptyParagraph);
    results.push(...synonymsMisidentificationsPgs);
  }
  return results;
};

const makeForsParagraphs = (basionymFor, replacedFor, nomenNovumFor) => {
  const results = [];
  const basionymForPgs = bulletList('Basionym for', basionymFor);
  const replacedForPgs = bulletList('Replaced for', replacedFor);
  const nomenNovumForPgs = bulletList('Nomen novum for', nomenNovumFor);
  if (basionymForPgs.length > 0
    || replacedForPgs.length > 0
    || nomenNovumForPgs.length > 0) {
    results.push(emptyParagraph);
  }
  return [
    ...results,
    ...basionymForPgs,
    ...replacedForPgs,
    ...nomenNovumForPgs,
  ];
};

const makeSpeciesSection = (species) => {
  const {
    id, name, ntype,
    typification, typeLocality, referenceToTypeDesignation, indLoc,
    tribus, accepted, basionym, replaced, nomenNovum,
    synonymsNomenclatoric, synonymsTaxonomic, synonymsInvalid,
    synonymsMisidentification,
    basionymFor, replacedFor, nomenNovumFor,
  } = species;
  const sections = [
    new Paragraph({
      children: [new TextRun({ text: id, allCaps: true, color: '#cecece' })],
    }),
    new Paragraph({
      children: [new TextRun({ text: name, size: 25, underline: true })],
    }),
    new Paragraph({
      children: [new TextRun({ text: ntype, italic: true })],
    }),
  ];
  const tribusPg = labelValueParagraph('Tribus', tribus);
  if (tribusPg) {
    sections.push(emptyParagraph);
    sections.push(tribusPg);
  }
  if (typification) {
    sections.push(emptyParagraph);
    sections.push(labelValueParagraph('Type', typification));
    sections.push(labelValueParagraph(
      'Type specimen / Illustration', typeLocality,
    ));
    sections.push(labelValueParagraph(
      'Reference to the type designation',
      referenceToTypeDesignation,
    ));
    sections.push(labelValueParagraph(
      'Ind. loc. (from the protologue)', indLoc,
    ));
  }
  if (accepted || basionym || replaced || nomenNovum) {
    sections.push(emptyParagraph);
  }
  sections.push(labelValueParagraph('Accepted name', accepted));
  sections.push(labelValueParagraph('Basionym', basionym));
  sections.push(labelValueParagraph('Replaced name', replaced));
  sections.push(labelValueParagraph('Nomen novum', nomenNovum));

  const synonymsPgs = makeAllSynonymsParagraphs(
    synonymsNomenclatoric, synonymsTaxonomic,
    synonymsInvalid, synonymsMisidentification,
  );
  sections.push(...synonymsPgs);

  const forsPgs = makeForsParagraphs(basionymFor, replacedFor, nomenNovumFor);
  sections.push(...forsPgs);

  sections.push(...dividerParagraph);

  return sections.filter((s) => !!s);
};

/**
 * [{
 *  id: number|string,
 *  name: string,
 *  ntype: string,
 *  publication: string,
 *  typification: string,
 *  typeLocality: string,
 *  referenceToTypeDesignation: string,
 *  indLoc: string,
 *  tribus: string,
 *  accepted: string,
 *  basionym: string,
 *  replaced: string,
 *  nomenNovum: string,
 *  synonymsNomenclatoric: [{ name }],
 *  synonymsTaxonomic: [{ name, synonymsNomenclatoric: [{ name }] }],
 *  synonymsInvalid: [{ name }],
 *  synonymsMisidentification: [{ name, misidentificationAuthor, synonymsNomenclatoric }],
 *  basionymFor: [string],
 *  replacedFor: [string],
 *  nomenNovumFor: [string],
 * }]
 * @param {array} speciesList
 */
function createDocument(speciesList) {
  // TODO switch to all species when finished
  const sl = speciesList.slice(0, 5);

  const doc = new Document({
    numbering: {
      config: [
        docx.numberingSynonymsNomenclatoric,
        docx.numberingSynonymsTaxonomic,
        docx.numberingSynonymsInvalid,
      ],
    },
  });

  const speciesParagraphs = sl.map(makeSpeciesSection).flat();

  doc.addSection({
    properties: {},
    children: speciesParagraphs,
  });
  return doc;
}

async function createDocumentAsBlob(speciesList) {
  const doc = createDocument(speciesList);
  return Packer.toBlob(doc);
}

export default {
  createDocument,
  createDocumentAsBlob,
};
