import axios from './axios';
import Mustache from './mustache';

async function getAll(
  uri, offset, where, limit, accessToken, orderString = '["id"]',
) {
  const whereString = (typeof where === 'string')
    ? where : JSON.stringify(where);

  const getAllUri = Mustache.render(
    uri, {
      offset,
      where: whereString,
      limit,
      order: orderString,
      accessToken,
    },
  );
  console.log(getAllUri);
  const response = await axios.get(getAllUri);
  return response.data;
}

async function getCount(uri, whereString, accessToken) {
  const getCountUri = Mustache.render(uri, { whereString, accessToken });
  const response = await axios.get(getCountUri);
  return response.data;
}

export default {
  getAll,
  getCount,
};
