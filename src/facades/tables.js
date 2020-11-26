import tablesService from '../services/tables';

async function getAll(
  uri, offset, whereString = '{}', orderString = '["id ASC"]',
  limit, accessToken,
) {
  return tablesService.getAll(
    uri, offset, whereString, limit, accessToken, orderString,
  );
}

async function getCount(uri, whereString, accessToken) {
  const { count } = await tablesService.getCount(uri, whereString, accessToken);
  return count;
}

export default {
  getAll,
  getCount,
};
