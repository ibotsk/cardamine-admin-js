import exportConfig from './export';
import urisConfig from './uris';

export default {

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
                unranked: '[unranked]'
            }
        },
        publication: {
            paper: "{{authors}} ({{year}}) {{title}}. {{journal}}, {{volume}}{{issue}}:{{pages}}",
            book: "{{authors}} ({{year}}) {{title}}. {{publisher}}. {{pages}}",
            manuscript: "{{authors}} ({{year}}) {{title}}. In: (eds.) {{editor}}, {{series}}. {{publisher}}. {{pages}}",
            chapter: "{{authors}} ({{year}}) {{title}}. In: (eds.) {{editor}}, {{series}}. {{publisher}}. {{pages}}",
            report: "{{authors}} ({{year}}) {{title}}. In: (eds.) {{editor}}, {{series}}. {{journal}}, {{volume}}{{issue}}:{{pages}}"
        }
    },
    export: exportConfig,
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
            },
            I: {
                text: "Designation not validly published",
                colour: "#ff6666"
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
            },
            misidentification: {
                numType: 4,
                prefix: '–'
            },
            doubtful: {
                prefix: '?='
            }
        },
        typifications: {
            holotype: {
                text: "HOLOTYPE"
            },
            neotype: {
                text: "NEOTYPE"
            },
            lectotype: {
                text: "LECTOTYPE"
            },
            originalMaterial: {
                text: "ORIGINAL MATERIAL"
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
    uris: urisConfig,

    logging: {
        level: `${process.env.REACT_APP_LOGGING_LEVEL}`
    }

};
