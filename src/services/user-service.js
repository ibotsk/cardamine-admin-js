import template from 'url-template';
import axios from './axios';

import config from '../config/config';

const login = async (username, password) => {
  const loginUri = template.parse(config.uris.usersUri.loginUri).expand();

  const response = await axios.post(loginUri, {
    username,
    password
  });
  return response.data;
}

const logout = async accessToken => {
  const logoutUri = template.parse(config.uris.usersUri.logoutUri).expand({ accessToken });
  await axios.post(logoutUri);
}

export default { login, logout };