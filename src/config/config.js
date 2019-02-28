
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
            nullableFields: ["paperAuthor", "paperTitle", "seriesSource", "volume", "issue", "editor", "publisher", "year", "pages", "journalName", "note"],
            1: {
                name: "paper",
                columns: ["paperAuthor", "paperTitle", "volume", "issue", "year", "pages", "journalName", "note"]
            },
            2: {
                name: "book",
                columns: ["paperAuthor", "paperTitle", "publisher", "year", "pages", "note"]
            },
            3: {
                name: "manuscript",
                columns: ["paperAuthor", "paperTitle", "seriesSource", "publisher", "editor", "year", "pages", "note"]
            },
            4: {
                name: "chapter",
                columns: ["paperAuthor", "paperTitle", "seriesSource", "publisher", "editor", "year", "pages", "note"]
            },
            5: {
                name: "report",
                columns: ["paperAuthor", "paperTitle", "seriesSource", "volume", "issue", "editor", "year", "pages", "journalName", "note"]
            }
        },
        losType: {
            A: {
                text: "Accepted name",
                colour: "#57ab27"
            },
            PA: { 
                text: "Provisionally accepted",
                colour: "#ee7f00"
            },
            S: { 
                text: "Synonym",
                colour: "#008fc8"
            },
            DS: {
                text: "Doubtful synonym",
                colour: "#0089a0"
            },
            U: {
                text: "Unresolved",
                colour: "#bb9d00"
            }
        },
        synonym: {
            nomenclatoric: {
                numType: 3,
                prefix: '≡'
            },
            taxonomic: {
                numType: 2,
                prefix: '='
            }
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
            }, {
                text: '100',
                value: 100
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
            getAllWOrderUri: `${backendBase}/api/list-of-species?filter=%7B"order":["genus","species","subsp","var","subvar","forma","authors","id"]%7D`,
            getByIdUri: `${backendBase}/api/list-of-species/{id}`,
            getByIdWFilterUri: `${backendBase}/api/list-of-species/{id}?filter=%7B"include":"synonyms-nomenclatoric"%7D`,
            getNomenclatoricSynonymsUri: `${backendBase}/api/list-of-species/{id}/synonyms-nomenclatoric?filter=%7B"include":"synonyms-nomenclatoric"%7D`,
            getTaxonomicSynonymsUri: `${backendBase}/api/list-of-species/{id}/synonyms-taxonomic?filter=%7B"include":"synonyms-nomenclatoric"%7D`,
            getSynonymsOfParent: `${backendBase}/api/list-of-species/{id}/parent-of-synonyms`,
            countUri: `${backendBase}/api/list-of-species/count`
        },
        literaturesUri: {
            baseUri: `${backendBase}/api/literature`,
            getAllWFilterUri: `${backendBase}/api/literature?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"order":["paperAuthor","paperTitle","year","id"]%7D`,
            getAllWOrderUri: `${backendBase}/api/literature?filter=%7B"order":["paperAuthor", "paperTitle", "year", "id"]%7D`,
            getByIdUri: `${backendBase}/api/literature/{id}`,
            countUri: `${backendBase}/api/literature/count`
        },
        personsUri: {
            baseUri: `${backendBase}/api/persons`,
            getAllWFilterUri: `${backendBase}/api/persons?filter=%7B"order":["persName","id"]%7D`
        },
        synonymsUri: {
            baseUri: `${backendBase}/api/synonyms`,
            synonymsByIdUri: `${backendBase}/api/synonyms/{id}`
        },
        worldl4Uri: {
            getAllWFilterUri: `${backendBase}/api/world-l4s?filter=%7B"order":["description","id"]%7D`
        },
    },

    logging: {
        level: 'debug'
    }

};
