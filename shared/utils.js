const slg = require('slug');
const toCamelCase = require('lodash.camelcase');

const CF_PREFIX = 'CONTENTFUL_';

const sanitizePath = (path) =>
  ['', ...path.split('/').filter(Boolean), ''].join('/');

const removeHyphens = ({ code }) => code.replace(/-/g, '');

const slug = (string) => {
  return slg(string, {
    lower: true, // lowercase everything
    charmap: {
      ä: 'ae',
      ü: 'ue',
      ö: 'oe',
      ß: 'ss',
      Ä: 'Ae',
      Ü: 'Ue',
      Ö: 'Oe',
    },
  });
};

const getDefaultPath = (defaultPrefix, path) => {
  const sanitizedPath = sanitizePath(path);
  const sanitizedPrefix = `/${defaultPrefix}/`;
  if (defaultPrefix && sanitizedPath.includes(sanitizedPrefix)) {
    return sanitizePath(sanitizedPath.replace(sanitizedPrefix, ''));
  }
};

class Logger {
  static log(...args) {
    console.log(...args);
  }
  static warn(...args) {
    console.warn(...args);
  }
  static info(...args) {
    console.info(...args);
  }
  static error(...args) {
    console.error(...args);
  }
}

const enrichLocales = (locales, localized, redirectDefaultPrefix) => {
  const localizedPaths = locales.reduce((red, locale) => {
    const code = removeHyphens(locale);
    const { path } = localized[code];

    if (locale.default) {
      const defaultPath = getDefaultPath(redirectDefaultPrefix, path);
      return {
        ...red,
        ['default']: defaultPath || path,
        [locale.code]: path,
      };
    }

    return { ...red, [locale.code]: path };
  }, {});

  return locales.map((locale) => ({ ...locale, localizedPaths }));
};

const getBuildEnvironment = () => {
  // require('dotenv').config();
  const {
    BUILD_ENV,
    NODE_ENV = 'development',
    URL,
    REDIRECT_DEFAULT_PREFIX,
  } = process.env;

  return {
    env: BUILD_ENV || NODE_ENV,
    domain: URL,
    redirectDefaultPrefix: REDIRECT_DEFAULT_PREFIX,
  };
};

const defaults = {
  environment: 'master',
  host: 'cdn.contentful.com',
};

const getContentfulEnvironment = () => {
  // require('dotenv').config();
  const config = Object.entries(process.env).reduce((acc, [key, value]) => {
    if (!key.match(new RegExp(`^${CF_PREFIX}.*`))) return acc;
    const sanitizedKey = toCamelCase(key.replace(CF_PREFIX, ''));
    const sanitizedValue = value === undefined ? defaults[sanitizedKey] : value;

    return {
      ...acc,
      [sanitizedKey]: sanitizedValue,
    };
  }, defaults);
  return config;
};

module.exports = {
  Logger,
  slug,
  sanitizePath,
  getDefaultPath,
  removeHyphens,
  enrichLocales,
  getBuildEnvironment,
  getContentfulEnvironment,
};
