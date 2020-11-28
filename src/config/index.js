/* eslint-disable max-len */
import constantsConfig from './constants';
import exportConfig from './export';
import importConfig from './import';
import urisConfig from './uris';

export default {
  constants: constantsConfig,
  uris: urisConfig,
  export: exportConfig,
  import: importConfig,
  nomenclature: {
    name: {
      sl: 's.l.',
      tribus: 'tribus',
      hybrid: 'x',
      infra: {
        subsp: 'subsp.',
        var: 'var.',
        subvar: 'subvar.',
        forma: 'forma',
        nothosubsp: 'nothosubsp.',
        nothoforma: 'nothoforma',
        proles: "'prol.'",
        unranked: '[unranked]',
      },
    },
    publication: {
      paper:
        '{{authors}} ({{year}}) {{title}}. {{journal}}, {{volume}}{{issue}}:{{pages}}',
      book: '{{authors}} ({{year}}) {{title}}. {{publisher}}. {{pages}}',
      manuscript:
        '{{authors}} ({{year}}) {{title}}. In: (eds.) {{editor}}, {{series}}. {{publisher}}. {{pages}}',
      chapter:
        '{{authors}} ({{year}}) {{title}}. In: (eds.) {{editor}}, {{series}}. {{publisher}}. {{pages}}',
      report:
        '{{authors}} ({{year}}) {{title}}. In: (eds.) {{editor}}, {{series}}. {{journal}}, {{volume}}{{issue}}:{{pages}}',
    },
    filter: {
      ntypesGroup: ['A', 'PA', 'S', 'DS'],
      columnMap: { // what column is translated to which filter (only complex values)
        originalIdentification: {
          filter: 'listOfSpecies',
          prefix: 'original_',
        },
        latestRevision: {
          filter: 'listOfSpecies',
          prefix: 'latestRevision_',
        },
        literature: {
          filter: 'publication',
          prefix: 'literature_',
        },
      },
      filters: {
        listOfSpecies: [
          'genus',
          'species',
          'subsp',
          'var',
          'subvar',
          'forma',
          'proles',
          'unranked',
          'authors',
          'genusH',
          'speciesH',
          'subspH',
          'varH',
          'subvarH',
          'formaH',
          'authorsH',
        ],
        publication: [
          'paperAuthor',
          'year',
          'paperTitle',
          'journalName',
          'editor',
          'seriesSource',
          'publisher',
          'volume',
          'issue',
          'pages',
        ],
      },
    },
  },
  format: {
    formatted: 'formatted',
    plain: 'plain',
  },
  mappings: {
    displayType: {
      nullableFields: [
        'paperAuthor',
        'paperTitle',
        'seriesSource',
        'volume',
        'issue',
        'editor',
        'publisher',
        'year',
        'pages',
        'journalName',
        'note',
      ],
      1: {
        name: 'paper',
        columns: [
          'paperAuthor',
          'paperTitle',
          'volume',
          'issue',
          'year',
          'pages',
          'journalName',
          'note',
        ],
      },
      2: {
        name: 'book',
        columns: [
          'paperAuthor',
          'paperTitle',
          'publisher',
          'year',
          'pages',
          'note',
        ],
      },
      3: {
        name: 'manuscript',
        columns: [
          'paperAuthor',
          'paperTitle',
          'seriesSource',
          'publisher',
          'editor',
          'year',
          'pages',
          'note',
        ],
      },
      4: {
        name: 'chapter',
        columns: [
          'paperAuthor',
          'paperTitle',
          'seriesSource',
          'publisher',
          'editor',
          'year',
          'pages',
          'note',
        ],
      },
      5: {
        name: 'report',
        columns: [
          'paperAuthor',
          'paperTitle',
          'seriesSource',
          'volume',
          'issue',
          'editor',
          'year',
          'pages',
          'journalName',
          'note',
        ],
      },
    },
    displayTypeStringToId: {
      paper: 1,
      book: 2,
      manuscript: 3,
      chapter: 4,
      report: 5,
    },
    losType: {
      A: {
        text: 'Accepted name',
        colour: '#57ab27',
      },
      PA: {
        text: 'Provisionally accepted',
        colour: '#ee7f00',
      },
      S: {
        text: 'Synonym',
        colour: '#008fc8',
      },
      DS: {
        text: 'Doubtful synonym',
        colour: '#0089a0',
      },
      U: {
        text: 'Unresolved',
        colour: '#bb9d00',
      },
      I: {
        text: 'Designation not validly published',
        colour: '#ff6666',
      },
      N: {
        text: 'Unassigned',
        colour: '#8b8b8b',
      },
    },
    synonym: {
      nomenclatoric: {
        numType: 3,
        prefix: '≡',
      },
      taxonomic: {
        numType: 2,
        prefix: '=',
      },
      invalid: {
        numType: 1,
        prefix: '–',
      },
      misidentification: {
        numType: 4,
        prefix: '–',
      },
      doubtful: {
        prefix: '?=',
      },
    },
    typifications: {
      holotype: {
        text: 'HOLOTYPE',
      },
      neotype: {
        text: 'NEOTYPE',
      },
      lectotype: {
        text: 'LECTOTYPE',
      },
      originalMaterial: {
        text: 'ORIGINAL MATERIAL',
      },
    },
  },
  pagination: {
    paginationSize: 7,
    pageStartIndex: 1,
    alwaysShowAllBtns: true, // Always show next and previous button
    withFirstAndLast: true, // Hide the going to First and Last page button
    // hideSizePerPage: true, // Hide the sizePerPage dropdown always
    // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
    // firstPageText: 'First',
    // prePageText: 'Back',
    // nextPageText: 'Next',
    // lastPageText: 'Last',
    // nextPageTitle: 'First page',
    // prePageTitle: 'Pre page',
    // firstPageTitle: 'Next page',
    // lastPageTitle: 'Last page',
    showTotal: true,
    // paginationTotalRenderer: customTotal, //custom renderer is in TablePageParent
    sizePerPageList: [
      {
        text: '25',
        value: 25,
      },
      {
        text: '50',
        value: 50,
      },
      {
        text: '100',
        value: 100,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  },
  logging: {
    level: `${process.env.REACT_APP_LOGGING_LEVEL}`,
  },
};
