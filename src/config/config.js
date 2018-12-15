
const backendBase = "http://localhost:3010";

export default {

    nomenclature: {
        name: {
            sl: 's.l.',
            subsp: 'subsp.',
            var: 'var.',
            subvar: 'subvar.',
            forma: 'forma',
            nothosubsp: 'nothosubsp.',
            nothoforma: 'nothoforma',
            proles: 'proles',
            unranked: '[unranked]',
            tribus: 'tribus',
            hybrid: 'x',
        },
        filter: {
            ntypesGroup: []
        }
    },
    format: {
        formatted: "formatted",
        plain: "plain",
        recordsPerPage: 50,
        rangeDisplayed: 7,
        numOfElementsAtEnds: 1,
        searchFieldMinLength: 4
    },
    uris: {
        chromosomeDataUri: {
            getAll: `${backendBase}/api/cdata?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"include":["counted-by", %7B"material": %7B"reference": "literature"%7D%7D]%7D`,
            count: `${backendBase}/api/cdata/count?where={whereString}`
        }
    },

    logging: {
        level: 'debug'
    }

};
