const makeWhereFromFilter = (filters) => {
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
};

export default {
    makeWhereFromFilter
};