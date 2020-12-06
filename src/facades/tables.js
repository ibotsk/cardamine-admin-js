import { getRequest } from '../services/backend';

async function getAll(
  uri, offset, whereString = '{}', orderString = '["id ASC"]',
  limit, accessToken,
) {
  const where = (typeof whereString === 'string')
    ? whereString : JSON.stringify(whereString);

  return getRequest(
    uri,
    {
      offset, limit, where, order: orderString,
    },
    accessToken,
  );
}

async function getCount(uri, whereString, accessToken) {
  const { count } = await getRequest(uri, { whereString }, accessToken);
  return count;
}

export default {
  getAll,
  getCount,
};
