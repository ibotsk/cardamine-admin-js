import config from '../config';

const { constants: { regexLatitude, regexLongitude } } = config;

/**
 * Checks latitude for regex, but only if longitude is not empty.
 * @param {*} latitude
 * @param {*} longitude
 */
function getValidationLatitudeDec(latitude, longitude) {
  const regex = new RegExp(regexLatitude);
  if (!(latitude || latitude === 0)
    && !(longitude || longitude === 0)) {
    return 'success';
  }
  if (regex.test(latitude) && (longitude || longitude === 0)) {
    return 'success';
  }
  return 'error';
}

/**
 * Checks longitude for regex, but only if latitude is not empty
 * @param {*} longitude
 * @param {*} latitude
 */
function getValidationLongitudeDec(longitude, latitude) {
  const regex = new RegExp(regexLongitude);
  if (!(longitude || longitude === 0)
    && !(latitude || latitude === 0)) {
    return 'success';
  }
  if (regex.test(longitude) && (latitude || latitude === 0)) {
    return 'success';
  }
  return 'error';
}

export default {
  getValidationLatitudeDec,
  getValidationLongitudeDec,
};
