import helper from './helper';
import get from 'lodash.get';

const VALUE_NA = "-";

const createCsvData = (dataToExport, fields, configfields) => {

    const headers = fields.map(f => ({
        label: configfields[f].name,
        key: f
    }));

    const data = dataToExport.map(d => {
        const obj = {};
        for (const f of fields) {
            const info = configfields[f];
            const fieldValue = get(d, info.column, VALUE_NA);
            obj[f] = handleCompositeField(fieldValue, f, info);
        }
        return obj;
    });

    return {
        data,
        headers
    };

}

/**
 * 
 * @param {*} data value of field, can be json
 * @param {*} fieldInfo field from config
 */
function handleCompositeField(data, field, fieldInfo) {
    if (!fieldInfo.composite) {
        return data;
    }
    switch (field) {
        case 'publicationFull':
            return createPublication(data);
        default:
            return data;
    }
}

function createPublication(data) {
    return helper.parsePublication({ 
        type: data.displayType, 
        authors: data.paperAuthor, 
        title: data.paperTitle, 
        series: data.seriesSource, 
        volume: data.volume, 
        issue: data.issue, 
        publisher: data.publisher, 
        editor: data.editor, 
        year: data.year, 
        pages: data.pages, 
        journal: data.journalName });
}

export default {
    createCsvData
}