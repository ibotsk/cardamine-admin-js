import world4Service from '../services/world4';

const getOneByDescription = async ({ description, accessToken }) => {
    const data = await world4Service.getByDescription(description.trim(), accessToken);

    if (data.length < 1) {
        return null;
    }
    if (data.length > 1) {
        throw new Error(`More than one World 4 found for "${description}"`);
    }
    return data[0];
}

export default {
    getOneByDescription
};