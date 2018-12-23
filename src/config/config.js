
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
        plain: "plain"
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
                value: 25
            }, {
                text: '50', 
                value: 50
            }] // A numeric array is also available. the purpose of above example is custom the text
    },
    uris: {
        chromosomeDataUri: {
            getAll: `${backendBase}/api/cdata?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"include":["counted-by", "latest-revision", %7B"material": ["world-l4", %7B"reference": ["literature", "original-identification"]%7D]%7D]%7D`,
            getById: `${backendBase}/api/cdata/{id}?filter=%7B"include":["counted-by", "latest-revision", %7B"material": ["world-l4", %7B"reference": ["literature", "original-identification"]%7D]%7D]%7D`,
            count: `${backendBase}/api/cdata/count?where={whereString}`
        }
    },

    logging: {
        level: 'debug'
    }

};
