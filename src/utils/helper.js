import config from '../config/config';
import formatter from './formatter';

import Mustache from 'mustache';

const config_name = config.nomenclature.name;
const ff = config.format.formatted;
const plf = config.format.plain;

const o = (string, format) => {
    let s = '';
    if (string) {
        s = string.trim();
    }
    return { string: s, format: format };
}

const Formatted = (string) => o(string, ff);
const Plain = (string) => o(string, plf);

const sl = (string) => {
    const sl = config_name.sl;
    if (string && string.includes(sl)) {
        let modString = string.replace(sl, '');
        return { s: modString, hasSl: true };
    }
    return { s: string, hasSl: false };
}

const subspecies = (subsp) => {
    const result = [];
    let isUnrankedOrProles = false;
    if (subsp.includes(config_name.unranked)) {
        result.push(Plain(config_name.unranked));
        isUnrankedOrProles = true;
    }
    if (subsp.includes(config_name.proles)) {
        result.push(Plain(config_name.proles));
        isUnrankedOrProles = true;
    }
    subsp = subsp.replace(/\[unranked\]|proles/g, '');

    if (!isUnrankedOrProles) {
        result.push(Plain(config_name.subsp));
    }
    result.push(Formatted(subsp));
    return result;
}

/*
    Nothosubsp and nothoforma not used
*/
const infraTaxa = (subsp, vari, subvar, forma, nothosubsp, nothoforma) => {
    let infs = [];
    if (subsp) {
        infs = infs.concat(subspecies(subsp));
    }
    if (vari) {
        infs = infs.concat([Plain(config_name.var), Formatted(vari)]);
    }
    if (subvar) {
        infs = infs.concat([Plain(config_name.subvar), Formatted(subvar)]);
    }
    if (forma) {
        infs = infs.concat([Plain(config_name.forma), Formatted(forma)]);
    }

    return infs;
}

const invalidDesignation = (name, syntype) => {
    if (syntype === '1') {
        let newname = [];
        newname.push(Plain('"'));
        newname = newname.concat(name);
        newname.push(Plain('"'));
        return newname;
    }
    return name;
}

const listOfSpeciesFormat = (nomenclature, options = {}) => {

    let opts = Object.assign({}, {
        isPublication: false,
        isTribus: false,
    }, options);

    let isAuthorLast = true;

    let name = [];
    let slResult = sl(nomenclature.species);

    name.push(Formatted(nomenclature.genus));
    name.push(Formatted(slResult.s));

    if (slResult.hasSl) {
        name.push(Plain(config_name.sl));
    }

    const infras = infraTaxa(nomenclature.subsp, nomenclature.var, nomenclature.subvar, nomenclature.forma, nomenclature.nothosubsp, nomenclature.nothoforma);

    if (nomenclature.species === nomenclature.subsp || nomenclature.species === nomenclature.var || nomenclature.species === nomenclature.forma) {
        name.push(Plain(nomenclature.authors));
        isAuthorLast = false;
    }

    name = name.concat(infras);

    if (isAuthorLast) {
        name.push(Plain(nomenclature.authors));
    }

    if (nomenclature.hybrid) {
        let h = {
            genus: nomenclature.genusH,
            species: nomenclature.speciesH,
            subsp: nomenclature.subspH,
            var: nomenclature.varH,
            subvar: nomenclature.subvarH,
            forma: nomenclature.formaH,
            nothosubsp: nomenclature.nothosubspH,
            nothoforma: nomenclature.nothoformaH,
            authors: nomenclature.authorsH,
        }
        name.push(Plain(config_name.hybrid));
        name = name.concat(listOfSpeciesFormat(h));
    }

    name = invalidDesignation(name, options.syntype);

    if (opts.isPublication) {
        name.push(Plain(nomenclature.publication));
    }
    if (opts.isTribus) {
        name.push(Plain(nomenclature.tribus));
    }

    return name;

}

const listOfSpeciesForComponent = (name, formatString) => {

    const nameArr = listOfSpeciesFormat(name);

    const formattedNameArr = nameArr.map(t => {
        if (t.format === ff) {
            return formatter.format(t.string, formatString);
        } else {
            return t.string;
        }
    });

    return formattedNameArr.reduce((acc, el) => acc.concat(el, ' '), []).slice(0, -1);
}

const listOfSpeciesString = (name) => {
    return listOfSpeciesForComponent(name, 'plain').join('');
}

const listOfSpeciesSorterLex = (losA, losB) => {
    // a > b = 1
    if (losA.genus > losB.genus) {
        return 1;
    } else if (losA.genus < losB.genus) {
        return -1;
    }
    if (losA.species > losB.species) {
        return 1;
    } else if (losA.species < losB.species) {
        return -1;
    }
    if (losA.subsp > losB.subsp) {
        return 1;
    } else if (losA.subsp < losB.subsp) {
        return -1;
    }
    if (losA.var > losB.var) {
        return 1;
    } else if (losA.var < losB.var) {
        return -1;
    }
    if (losA.forma > losB.forma) {
        return 1;
    } else if (losA.forma < losB.forma) {
        return -1;
    }
    if (losA.subvar > losB.subvar) {
        return 1;
    } else if (losA.subvar < losB.subvar) {
        return -1;
    }
    if (losA.authors > losB.authors) {
        return 1;
    } else if (losA.authors < losB.authors) {
        return -1;
    }
    // hybrid fields next
    if (losA.genusH > losB.genusH) {
        return 1;
    } else if (losA.genusH < losB.genusH) {
        return -1;
    }
    if (losA.speciesH > losB.speciesH) {
        return 1;
    } else if (losA.speciesH < losB.speciesH) {
        return -1;
    }
    if (losA.subspH > losB.subspH) {
        return 1;
    } else if (losA.subspH < losB.subspH) {
        return -1;
    }
    if (losA.varH > losB.varH) {
        return 1;
    } else if (losA.varH < losB.varH) {
        return -1;
    }
    if (losA.formaH > losB.formaH) {
        return 1;
    } else if (losA.formaH < losB.formaH) {
        return -1;
    }
    if (losA.subvarH > losB.subvarH) {
        return 1;
    } else if (losA.subvarH < losB.subvarH) {
        return -1;
    }
    if (losA.authorsH > losB.authorsH) {
        return 1;
    } else if (losA.authorsH < losB.authorsH) {
        return -1;
    }
    return 0;
}

const parsePublication = ({ type, authors, title, series, volume, issue, publisher, editor, year, pages, journal }) => {

    const typeMapping = config.mappings.displayType[type].name;
    const template = config.nomenclature.publication[typeMapping];

    return Mustache.render(template, {
        authors,
        title,
        series,
        volume,
        issue: issue ? `(${issue})` : '',
        publisher,
        editor,
        year,
        pages,
        journal
    });
}

const makeWhere = (filters) => {
    const whereList = [];
    const keys = Object.keys(filters);
    for (const key of keys) {
        whereList.push({
            [key]: {
                like: `%${filters[key].filterVal}%`
            }
        });
    }
    if (whereList.length > 1) {
        return { 'OR': whereList };
    }
    if (whereList.length === 1) {
        return whereList[0];
    }
    return {};
}

// useful when changing type of publication, so the unused fields are set to empty
const publicationCurateFields = (publication) => {
    const usedFields = config.mappings.displayType[publication.displayType].columns;
    const fieldsToBeEmpty = config.mappings.displayType.nullableFields.filter(el => !usedFields.includes(el));

    const curatedPubl = {...publication};
    for (const field of fieldsToBeEmpty) {
        curatedPubl[field] = '';
    }
    return curatedPubl;
}

export default { listOfSpeciesForComponent, listOfSpeciesString, listOfSpeciesSorterLex, makeWhere, parsePublication, publicationCurateFields };
