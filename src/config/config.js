
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
        publication: {
            paper: "{{authors}} ({{year}}) {{title}}. {{journal}}, {{volume}}{{issue}}:{{pages}}",
            book: "{{authors}} ({{year}}) {{title}}. {{publisher}}. {{pages}}",
            manuscript: "{{authors}} ({{year}}) {{title}}. In: (eds.) {{editor}}, {{series}}. {{publisher}}. {{pages}}",
            chapter: "{{authors}} ({{year}}) {{title}}. In: (eds.) {{editor}}, {{series}}. {{publisher}}. {{pages}}",
            report: "{{authors}} ({{year}}) {{title}}. In: (eds.) {{editor}}, {{series}}. {{journal}}, {{volume}}{{issue}}:{{pages}}"
        }
    },
    format: {
        formatted: "formatted",
        plain: "plain"
    },
    mappings: {
        displayType: {
            1: "paper",
            2: "book",
            3: "manuscript",
            4: "chapter",
            5: "report"
        }
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
            baseUri: `${backendBase}/api/cdata/`,
            getByIdUri: `${backendBase}/api/cdata/{id}?filter=%7B"include":[%7B"histories":"list-of-species"%7D,%7B"material":"reference"%7D]%7D`,
            getAllWFilterUri: `${backendBase}/api/cdata?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"include":[ 
                %7B
                    "relation":"counted-by",
                    "scope":%7B
                        "where":%7B%7D
                    %7D
                %7D,
                %7B
                    "relation":"latest-revision",
                    "scope":%7B
                        "include":%7B
                            "relation":"list-of-species",
                            "where":%7B%7D
                        %7D
                    %7D 
                %7D,
                %7B
                    "relation":"material",
                    "scope":%7B
                        "where":%7B%7D,
                        "include":[
                            %7B
                                "relation":"world-l4",
                                "scope":%7B
                                    "where":%7B%7D
                                %7D
                            %7D,
                            %7B
                                "relation":"reference",
                                "scope":%7B
                                    "include":[
                                        %7B
                                            "relation":"literature"
                                        %7D,
                                        %7B
                                            "relation":"original-identification"
                                        %7D
                                    ]
                                %7D
                            %7D
                        ]
                    %7D
                %7D
            ]%7D`,
            countUri: `${backendBase}/api/cdata/count?where={whereString}`
        },
        materialUri: {
            baseUri: `${backendBase}/api/materials`
        },
        referenceUri: {
            baseUri: `${backendBase}/api/references`
        },
        listOfSpeciesUri: {
            baseUri: `${backendBase}/api/list-of-species`,
            getAllWFilterUri: `${backendBase}/api/list-of-species?filter=%7B"order":["genus","species","subsp","var","subvar","forma","authors","id"]%7D`
        },
        literaturesUri: {
            baseUri: `${backendBase}/api/literature`,
            getAllWFilterUri: `${backendBase}/api/literature?filter=%7B"order":["paperAuthor", "paperTitle", "year", "id"]%7D`
        },
        personsUri: {
            baseUri: `${backendBase}/api/persons`,
            getAllWFilterUri: `${backendBase}/api/persons?filter=%7B"order":["persName","id"]%7D`
        },
        worldl4Uri: {
            getAllWFilterUri: `${backendBase}/api/world-l4s?filter=%7B"order":["description","id"]%7D`
        },
    },

    logging: {
        level: 'debug'
    }

};
