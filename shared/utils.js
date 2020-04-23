const slg = require('slug');

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

module.exports = {
  Logger,
  slug,
  sanitizePath,
  getDefaultPath,
  removeHyphens,
  enrichLocales,
};
