import chromService from '../services/chromosome-data';

const getForExport = async (ids, accessToken) => {
  const where = {
    or: ids.map((id) => ({ id })),
  };
  const whereString = JSON.stringify(where);
  return await chromService.getForExport(whereString, accessToken);
};

export default {
  getForExport,
};
