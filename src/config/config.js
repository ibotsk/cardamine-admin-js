
const backendBase = `${process.env.REACT_APP_BACKEND_BASE}:${process.env.REACT_APP_BACKEND_PORT}`;

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
            },
            invalid: {
                numType: 1,
                prefix: '–'
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
        usersUri: {
            loginUri: `${backendBase}/api/cardamine-users/login`,
            logoutUri: `${backendBase}/api/cardamine-users/logout?access_token={accessToken}`
        },
        chromosomeDataUri: {
            baseUri: `${backendBase}/api/cdata?access_token={accessToken}`,
            getByIdUri: `${backendBase}/api/cdata/{id}?filter=%7B"include":[%7B"histories":"list-of-species"%7D,%7B"material":"reference"%7D]%7D&access_token={accessToken}`,
            getAllWFilterUri: `${backendBase}/api/cdata?access_token={accessToken}&filter=%7B"offset":{offset},"where":{where},"limit":{limit},"include":[ 
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
            countUri: `${backendBase}/api/cdata/count?where={whereString}&access_token={accessToken}`
        },
        materialUri: {
            baseUri: `${backendBase}/api/materials?access_token={accessToken}`
        },
        referenceUri: {
            baseUri: `${backendBase}/api/references?access_token={accessToken}`
        },
        listOfSpeciesUri: {
            baseUri: `${backendBase}/api/list-of-species?access_token={accessToken}`,
            getAllWOrderUri: `${backendBase}/api/list-of-species?filter=%7B"order":["genus","species","subsp","var","subvar","forma","authors","id"]%7D&access_token={accessToken}`,
            getByIdUri: `${backendBase}/api/list-of-species/{id}?access_token={accessToken}`,
            getByIdWFilterUri: `${backendBase}/api/list-of-species/{id}?filter=%7B"include":"synonyms-nomenclatoric"%7D&access_token={accessToken}`,
            getNomenclatoricSynonymsUri: `${backendBase}/api/list-of-species/{id}/synonyms-nomenclatoric?filter=%7B"include":"synonyms-nomenclatoric"%7D&access_token={accessToken}`,
            getTaxonomicSynonymsUri: `${backendBase}/api/list-of-species/{id}/synonyms-taxonomic?filter=%7B"include":"synonyms-nomenclatoric"%7D&access_token={accessToken}`,
            getInvalidSynonymsUri: `${backendBase}/api/list-of-species/{id}/synonyms-invalid?access_token={accessToken}`,
            getBasionymForUri: `${backendBase}/api/list-of-species/{id}/basionym-for?access_token={accessToken}`,
            getReplacedForUri: `${backendBase}/api/list-of-species/{id}/replaced-for?access_token={accessToken}`,
            getNomenNovumForUri: `${backendBase}/api/list-of-species/{id}/nomen-novum-for?access_token={accessToken}`,
            getSynonymsOfParent: `${backendBase}/api/list-of-species/{id}/parent-of-synonyms?access_token={accessToken}`,
            countUri: `${backendBase}/api/list-of-species/count?access_token={accessToken}`
        },
        literaturesUri: {
            baseUri: `${backendBase}/api/literature?access_token={accessToken}`,
            getAllWFilterUri: `${backendBase}/api/literature?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"order":["paperAuthor","paperTitle","year","id"]%7D&access_token={accessToken}`,
            getAllWOrderUri: `${backendBase}/api/literature?filter=%7B"order":["paperAuthor", "paperTitle", "year", "id"]%7D&access_token={accessToken}`,
            getByIdUri: `${backendBase}/api/literature/{id}?access_token={accessToken}`,
            countUri: `${backendBase}/api/literature/count?access_token={accessToken}`
        },
        personsUri: {
            baseUri: `${backendBase}/api/persons?access_token={accessToken}`,
            getByIdUri: `${backendBase}/api/persons/{id}?access_token={accessToken}`,
            getAllWFilterUri: `${backendBase}/api/persons?filter=%7B"offset":{offset},"where":{where},"limit":{limit},"order":["persName","id"]%7D&access_token={accessToken}`,
            getAllWOrderUri: `${backendBase}/api/persons?filter=%7B"order":["persName","id"]%7D&access_token={accessToken}`,
            countUri: `${backendBase}/api/persons/count?access_token={accessToken}`
        },
        synonymsUri: {
            baseUri: `${backendBase}/api/synonyms?access_token={accessToken}`,
            synonymsByIdUri: `${backendBase}/api/synonyms/{id}?access_token={accessToken}`
        },
        worldl4Uri: {
            getAllWFilterUri: `${backendBase}/api/world-l4s?filter=%7B"order":["description","id"]%7D&access_token={accessToken}`
        },
    },

    logging: {
        level: `${process.env.REACT_APP_LOGGING_LEVEL}`
    }

};
