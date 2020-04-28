import chromService from '../services/chromosome-data';

async function getForExport(ids, accessToken) {
  const where = {
    or: ids.map((id) => ({ id })),
  };
  const whereString = JSON.stringify(where);
  return chromService.getForExport(whereString, accessToken);
}

export default {
  getForExport,
};
