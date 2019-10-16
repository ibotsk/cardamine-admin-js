const get = require('lodash.get');

const VALUE_NA = "-";

const createCsvData = (dataToExport, fields, configfields) => {

    const headers = fields.map(f => ({
        label: configfields[f].name,
        key: f
    }));

    const data = dataToExport.map(d => {
        const obj = {};
        for (const f of fields) {
            const { column } = configfields[f];
            obj[f] = get(d, column, VALUE_NA);
        }
        return obj;
    });

    return {
        data,
        headers
    };

}

export default {
    createCsvData
}