export class WhereBuilder {
  constructor() {
    this.where = {};
  }

  add(obj) {
    this.where = { ...this.where, ...obj };
    return this;
  }

  build() {
    return this.where || {};
  }

  buildString() {
    return JSON.stringify(this.build());
  }
}

const NONBREAKING_WHITESPACE = '%C2%A0';
const REGULAR_WHITESPACE = '%20';
const replaceNonBreakingSpace = (val) => (
  val.replaceAll(NONBREAKING_WHITESPACE, REGULAR_WHITESPACE)
);

const resolveEncode = (isEncode, val) => {
  if (!val) {
    return val;
  }
  const encoded = isEncode ? encodeURIComponent(val) : val;
  return replaceNonBreakingSpace(encoded);
};

export const functions = {
  eq: (key, value, encodeURI = true) => ({
    [key]: resolveEncode(encodeURI, value),
  }),
  neq: (key, value, encodeURI = true) => ({
    [key]: { neq: resolveEncode(encodeURI, value) },
  }),
  like: (key, value, encodeURI = true) => ({
    [key]: { like: resolveEncode(encodeURI, value) },
  }),
  likep: (key, value, encodeURI = true) => (
    functions.like(key, `%${value}%`, encodeURI)
  ),
  regexp: (key, value, encodeURI = true) => ({
    [key]: { regexp: resolveEncode(encodeURI, value) },
  }),
  and: (...objs) => ({ and: [...objs] }),
  or: (...objs) => ({ or: [...objs] }),
};
