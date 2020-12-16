export default {
  options: {
    separator: ';',
    enclosingCharacter: '"',
  },
  chromdata: {
    nameAsPublished: {
      name: 'Name as published',
      column: 'material.reference.nameAsPublished',
      group: 'identification',
      default: true,
    },
    originalIdentification: {
      name: 'Original identification',
      column: 'material.reference.original-identification',
      group: 'identification',
      default: true,
      composite: true,
    },
    latestRevision: {
      name: 'Latest revision',
      column: 'latest-revision.list-of-species',
      group: 'identification',
      composite: true,
    },
    publicationFull: {
      name: 'Publication full',
      column: 'material.reference.literature',
      group: 'publication',
      default: true,
      composite: true,
    },
    ambiguousRecord: {
      name: 'Ambiguous Record',
      column: 'ambiguousRecord',
      group: 'cdata',
    },
    countCredibility: {
      name: 'Count Credibility',
      column: 'countCredibility',
      group: 'cdata',
    },
    countedBy: {
      name: 'Counted By',
      column: 'counted-by.persName',
      group: 'cdata',
    },
    countedDate: {
      name: 'Counted Date',
      column: 'countedDate',
      group: 'cdata',
    },
    cdataDepositedIn: {
      name: 'Deposited In',
      column: 'depositedIn',
      group: 'cdata',
    },
    dn: {
      name: '2n',
      column: 'dn',
      group: 'cdata',
      default: true,
    },
    doubtfulRecord: {
      name: 'Doubtful Record',
      column: 'doubtfulRecord',
      group: 'cdata',
    },
    drawing: {
      name: 'Drawing',
      column: 'drawing',
      group: 'cdata',
    },
    duplicateData: {
      name: 'Duplicate Data',
      column: 'duplicateData',
      group: 'cdata',
    },
    duplicateDataProb: {
      name: 'Duplicate Data Prob',
      column: 'duplicateDataProb',
      group: 'cdata',
    },
    erroneousRecord: {
      name: 'Is Erroneous Record',
      column: 'erroneousRecord',
      group: 'cdata',
    },
    hasMajovsky: {
      name: 'Has Majovsky',
      column: 'hasMajovsky',
      group: 'cdata',
    },
    hocLoco: {
      name: 'Hoc Loco',
      column: 'hocLoco',
      group: 'cdata',
    },
    id: {
      name: 'ID',
      column: 'id',
      group: 'cdata',
    },
    idiogram: {
      name: 'Idiogram',
      column: 'idiogram',
      group: 'cdata',
    },
    karyotype: {
      name: 'Karyotype',
      column: 'karyotype',
      group: 'cdata',
    },
    n: {
      name: 'n',
      column: 'n',
      group: 'cdata',
    },
    cdataNote: {
      name: 'Note',
      column: 'note',
      group: 'cdata',
    },
    numberOfAnalysedPlants: {
      name: 'Number Of Analysed Plants',
      column: 'numberOfAnalysedPlants',
      group: 'cdata',
    },
    photo: {
      name: 'Photo',
      column: 'photo',
      group: 'cdata',
    },
    ploidyLevel: {
      name: 'Ploidy Level',
      column: 'ploidyLevel',
      group: 'cdata',
    },
    ploidyLevelRevised: {
      name: 'Ploidy Level Revised',
      column: 'ploidyLevelRevised',
      group: 'cdata',
    },
    slideNo: {
      name: 'Slide No',
      column: 'slideNo',
      group: 'cdata',
    },
    x: {
      name: 'x',
      column: 'x',
      group: 'cdata',
    },
    xRevised: {
      name: 'x Revised',
      column: 'xRevised',
      group: 'cdata',
    },
    chCount: {
      name: 'Chromosome Count',
      column: 'dna.chCount',
      group: 'dna',
    },
    method: {
      name: 'Method',
      column: 'dna.method',
      group: 'dna',
    },
    dnaNote: {
      name: 'Note',
      column: 'dna.note',
      group: 'dna',
    },
    numberAnalyses: {
      name: 'Number Of Analyses',
      column: 'dna.numberAnalyses',
      group: 'dna',
    },
    plantsAnalysed: {
      name: 'Number of Plants Analysed',
      column: 'dna.plantsAnalysed',
      group: 'dna',
    },
    ploidy: {
      name: 'Ploidy',
      column: 'dna.ploidy',
      group: 'dna',
    },
    ploidyRevised: {
      name: 'Ploidy Revised',
      column: 'dna.ploidyRevised',
      group: 'dna',
    },
    sizeC: {
      name: 'Size C',
      column: 'dna.sizeC',
      group: 'dna',
    },
    sizeFrom: {
      name: 'Size From',
      column: 'dna.sizeFrom',
      group: 'dna',
    },
    sizeTo: {
      name: 'Size To',
      column: 'dna.sizeTo',
      group: 'dna',
    },
    sizeUnits: {
      name: 'Size Units',
      column: 'dna.sizeUnits',
      group: 'dna',
    },
    administrativeUnit: {
      name: 'Administrative Unit',
      column: 'material.administrativeUnit',
      group: 'material',
    },
    altitude: {
      name: 'Altitude',
      column: 'material.altitude',
      group: 'material',
    },
    centralEuropeanMappingUnit: {
      name: 'Central European Mapping Unit',
      column: 'material.centralEuropeanMappingUnit',
      group: 'material',
    },
    closestVillageTown: {
      name: 'Closest Village/Town',
      column: 'material.closestVillageTown',
      group: 'material',
      default: true,
    },
    collectedBy: {
      name: 'Collected By',
      column: 'material.collected-by.persName',
      group: 'material',
    },
    collectedDate: {
      name: 'Collected Date',
      column: 'material.collectedDate',
      group: 'material',
    },
    country: {
      name: 'Country',
      column: 'material.country',
      group: 'material',
    },
    materialDepositedIn: {
      name: 'Deposited In',
      column: 'material.depositedIn',
      group: 'material',
    },
    exposition: {
      name: 'Exposition',
      column: 'material.exposition',
      group: 'material',
    },
    geographicalDistrict: {
      name: 'Geographical District',
      column: 'material.geographicalDistrict',
      group: 'material',
    },
    identifiedBy: {
      name: 'Identified By',
      column: 'material.identified-by.persName',
      group: 'material',
    },
    coordinatesGeorefLat: {
      name: 'Coordinates Georeferenced Lat',
      column: 'material.coordinatesGeoref.coordinates.lat',
      group: 'material',
      default: true,
    },
    coordinatesGeorefLon: {
      name: 'Coordinates Georeferenced Lon',
      column: 'material.coordinatesGeoref.coordinates.lon',
      group: 'material',
      default: true,
    },
    description: {
      name: 'Locality Description',
      column: 'material.description',
      group: 'material',
      default: true,
    },
    phytogeographicalDistrict: {
      name: 'Phytogeographical District',
      column: 'material.phytogeographicalDistrict',
      group: 'material',
    },
    voucherSpecimenNo: {
      name: 'Voucher Specimen No',
      column: 'material.voucherSpecimenNo',
      group: 'material',
    },
    world4: {
      name: 'World 4',
      column: 'material.world-l4.description',
      group: 'material',
      default: true,
    },
  },
  checklist: {
    docx: {
      numberingSynonymsTaxonomic: {
        reference: 'synonyms-taxonomic-numbering',
        levels: [
          {
            level: 0,
            text: '=',
            style: {
              paragraph: {
                indent: { left: 260, hanging: 260 },
              },
            },
          },
          {
            level: 1,
            text: '≡',
            style: {
              paragraph: {
                indent: { left: 720, hanging: 260 },
              },
            },
          },
        ],
      },
      numberingSynonymsNomenclatoric: {
        reference: 'synonyms-nomenclatoric-numbering',
        levels: [
          {
            level: 0,
            text: '≡',
            style: {
              paragraph: {
                indent: { left: 260, hanging: 260 },
              },
            },
          },
        ],
      },
      numberingSynonymsInvalid: {
        reference: 'synonyms-invalid-numbering',
        levels: [
          {
            level: 0,
            text: '–',
            style: {
              paragraph: {
                indent: { left: 260, hanging: 260 },
              },
            },
          },
          {
            level: 1,
            format: 'bullet',
            style: {
              paragraph: {
                indent: { left: 720, hanging: 260 },
              },
            },
          },
        ],
      },
    },
  },
};
