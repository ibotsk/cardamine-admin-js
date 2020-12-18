import {
  Document, HeadingLevel, Packer, Paragraph, TextRun,
} from 'docx';

import config from '../../../../config';

const {
  export: {
    chromdata: {
      columns,
    },
  },
} = config;

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
    heading: HeadingLevel.HEADING_4,
    children: [
      new TextRun({ text: `${value}`, bold: true }),
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

/**
 * @param {string} group
 * @param {string} groupLabel
 * @param {object} record
 * @param {array} chosenColumns key, label in order in which they will appear in file
 */
const makeGroupSection = (group, groupLabel, record, chosenColumns) => {
  const colsOfGroupKeys = Object.keys(columns)
    .filter((ck) => columns[ck].group === group);

  const chosenColumnsOfGroupInOrder = chosenColumns
    .filter(({ key }) => colsOfGroupKeys.includes(key));

  const paragraphs = chosenColumnsOfGroupInOrder
    .map(({ key }) => {
      const value = record[key];
      const label = columns[key].name;
      return labelValueParagraph(label, value);
    })
    .filter((pg) => !!pg);

  if (groupLabel && paragraphs.length > 0) {
    return [labelParagraph(groupLabel), ...paragraphs];
  }
  return paragraphs;
};

const makeRecordSection = (r, chosenColumns) => {
  const sections = [];
  const identificationPgs = makeGroupSection(
    'identification', undefined, r, chosenColumns,
  );
  const publicationPgs = makeGroupSection(
    'publication', 'Publication', r, chosenColumns,
  );
  const cdataPgs = makeGroupSection(
    'cdata', 'Chromosome data', r, chosenColumns,
  );
  const dnaPgs = makeGroupSection(
    'dna', 'DNA', r, chosenColumns,
  );
  const materialPgs = makeGroupSection(
    'material', 'Material', r, chosenColumns,
  );

  sections.push(...identificationPgs);

  sections.push(emptyParagraph);
  sections.push(...publicationPgs);

  sections.push(emptyParagraph);
  sections.push(...cdataPgs);

  sections.push(emptyParagraph);
  sections.push(...dnaPgs);

  sections.push(emptyParagraph);
  sections.push(...materialPgs);

  sections.push(...dividerParagraph);
  return sections;
};

function createDocument(dataList, chosenColumns) {
  const doc = new Document();

  const paragraphs = dataList
    .map((r) => makeRecordSection(r, chosenColumns))
    .flat();

  doc.addSection({
    properties: {},
    children: paragraphs,
  });
  return doc;
}

async function createDocumentAsBlob(dataList, chosenColumns) {
  const doc = createDocument(dataList, chosenColumns);
  return Packer.toBlob(doc);
}

export default {
  createDocument,
  createDocumentAsBlob,
};
