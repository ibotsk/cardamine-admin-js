
export default {
    ignoredRows: [0],
    referenceColumns: {
        standardizedName: {
            genus: 11,
            species: 12,
            subsp: 13,
            var: 14,
            forma: 15,
            authors: 16
        },
        literature: {
            displayType: 58,
            paperAuthor: 60,
            paperTitle: 61,
            seriesSource: 62,
            volume: 63,
            issue: 64,
            publisher: 65,
            editor: 66,
            year: 67,
            pages: 68,
            journalName: 69
        },
        countedBy: 23,
        collectedBy: 48,
        identifiedBy: 50,
        checkedBy: 53,
        idWorld4: 40
    },
    dataColumns: {
        6: {
            table: "reference",
            name: "name_as_published",
            relatedColumns: [7, 8, 9, 10]
        },
        17: {
            table: "cdata",
            name: "n"
        },
        18: {
            table: "cdata",
            name: "dn"
        },
        19: {
            table: "cdata",
            name: "x"
        },
        20: {
            table: "cdata",
            name: "xRevised"
        },
        21: {
            table: "cdata",
            name: "ploidyLevel"
        },
        22: {
            table: "cdata",
            name: "ploidyLevelRevised"
        },
        24: {
            table: "cdata",
            name: "countedDate"
        },
        25: {
            table: "cdata",
            name: "karyotype"
        },
        26: {
            table: "cdata",
            name: "numberOfAnalysedPlants"
        },
        27: {
            table: "cdata",
            name: "slideNo"
        },
        28: {
            table: "cdata",
            name: "depositedIn"
        },
        29: {
            table: "cdata",
            name: "note"
        },
        30: {
            table: "cdata",
            name: "drawing"
        },
        31: {
            table: "cdata",
            name: "photo"
        },
        32: {
            table: "cdata",
            name: "idiogram"
        },
        33: {
            table: "dna",
            name: "method"
        },
        35: {
            table: "dna",
            name: "ploidy"
        },
        36: {
            table: "dna",
            name: "ploidyRevised"
        },
        37: {
            table: "dna",
            name: "plantsAnalysed"
        },
        38: {
            table: "dna",
            name: "numberAnalyses"
        },
        39: {
            table: "dna",
            name: "note"
        },
        41: {
            table: "material",
            name: "country"
        },
        42: {
            table: "material",
            name: "geographicalDistrict"
        },
        43: {
            table: "material",
            name: "administrativeUnit"
        },
        44: {
            table: "material",
            name: "closestVillageTown"
        },
        45: {
            table: "material",
            name: "altitude"
        },
        46: {
            table: "material",
            name: "exposition"
        },
        47: {
            table: "material",
            name: "description"
        },
        49: {
            table: "material",
            name: "collectedDate"
        },
        51: {
            table: "material",
            name: "voucherSpecimenNo"
        },
        54: {
            table: "material",
            name: "cooradinatesLon"
        },
        55: {
            table: "material",
            name: "coordinatesLat"
        },
        56: {
            table: "material",
            name: "coordinatesGeorefLat"
        },
        57: {
            table: "material",
            name: "coordinatesGeorefLon"
        },
        59: {
            table: "reference",
            name: "page"
        }
    }

};