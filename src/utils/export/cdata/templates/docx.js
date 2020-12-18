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

const EMPTY_VALUE = '';

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

const labelValueParagraph = (label, value, showEmpty) => {
  if (!showEmpty && (value === null || value === undefined || value === '')) {
    return undefined;
  }
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun(value || EMPTY_VALUE),
    ],
  });
};

/**
 * @param {string} group
 * @param {string} groupLabel
 * @param {object} record
 * @param {array} chosenColumnsInOrder key, label in order in which they will appear in file
 */
const makeGroupSection = (
  group, groupLabel, record, chosenColumnsInOrder, showEmpty,
) => {
  const colsOfGroupKeys = Object.keys(columns)
    .filter((ck) => columns[ck].group === group);

  const chosenColumnsOfGroupInOrder = chosenColumnsInOrder
    .filter((colName) => colsOfGroupKeys.includes(colName));

  const paragraphs = chosenColumnsOfGroupInOrder
    .map((colName) => {
      const value = record[colName];
      const label = columns[colName].name;
      return labelValueParagraph(label, value, showEmpty);
    })
    .filter((pg) => !!pg);

  if (groupLabel && paragraphs.length > 0) {
    return [labelParagraph(groupLabel), ...paragraphs];
  }
  return paragraphs;
};

const makeRecordSection = (r, chosenColumnsInOrder, includeEmpty) => {
  const sections = [];
  const identificationPgs = makeGroupSection(
    'identification', undefined, r, chosenColumnsInOrder, includeEmpty,
  );
  const publicationPgs = makeGroupSection(
    'publication', 'Publication', r, chosenColumnsInOrder, includeEmpty,
  );
  const cdataPgs = makeGroupSection(
    'cdata', 'Chromosome data', r, chosenColumnsInOrder, includeEmpty,
  );
  const dnaPgs = makeGroupSection(
    'dna', 'DNA', r, chosenColumnsInOrder, includeEmpty,
  );
  const materialPgs = makeGroupSection(
    'material', 'Material', r, chosenColumnsInOrder, includeEmpty,
  );

  if (chosenColumnsInOrder.includes('id')) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${columns.id.name}: `,
            allCaps: true,
            color: '#cecece',
          }),
          new TextRun({
            text: r[columns.id.column],
            allCaps: true,
            color: '#cecece',
          }),
        ],
      }),
    );
  }
  if (identificationPgs.length > 0) {
    sections.push(...identificationPgs);
  }
  if (publicationPgs.length > 0) {
    sections.push(emptyParagraph);
    sections.push(...publicationPgs);
  }
  if (cdataPgs.length > 0) {
    sections.push(emptyParagraph);
    sections.push(...cdataPgs);
  }
  if (dnaPgs.length) {
    sections.push(emptyParagraph);
    sections.push(...dnaPgs);
  }
  if (materialPgs.length) {
    sections.push(emptyParagraph);
    sections.push(...materialPgs);
  }

  sections.push(...dividerParagraph);
  return sections;
};

function createDocument(dataList, chosenColumnsInOrder, options) {
  const { includeEmptyFields } = options;

  const doc = new Document();

  const dataParagraphs = dataList
    .map((r) => makeRecordSection(r, chosenColumnsInOrder, includeEmptyFields));

  dataParagraphs.forEach((paragraphs) => {
    doc.addSection({
      properties: {},
      children: paragraphs.flat(),
    });
  });
  return doc;
}

async function createDocumentAsBlob(dataList, chosenColumnsInOrder, options) {
  const doc = createDocument(dataList, chosenColumnsInOrder, options);
  return Packer.toBlob(doc);
}

export default {
  createDocument,
  createDocumentAsBlob,
};
