import axios from './axios';
import Mustache from './mustache';

import config from '../config';

const { uris } = config;

async function login(username, password) {
  const loginUri = Mustache.render(uris.usersUri.loginUri, {});

  const response = await axios.post(loginUri, {
    username,
    password,
  });
  return response.data;
}

async function logout(accessToken) {
  const logoutUri = Mustache.render(uris.usersUri.logoutUri, { accessToken });
  await axios.post(logoutUri);
}

export default {
  login,
  logout,
};
