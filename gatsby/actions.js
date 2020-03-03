require('dotenv').config();
const { Logger, removeHyphens, getDefaultPath } = require('./utils');
const { getPages, getLocalizedPath } = require('./queries');

const { REDIRECT_DEFAULT_PREFIX } = process.env;

const init = ({ graphql, actions }) => {
  const queryGraphql = async graphqlString => {
    const { errors, data } = await graphql(graphqlString);
    if (errors) throw Error(errors.join('\n'));
    return data;
  };

  const createRedirect = async (
    defaultPrefix = REDIRECT_DEFAULT_PREFIX,
    path
  ) => {
    const defaultPath = getDefaultPath(defaultPrefix, path);
    if (defaultPath) {
      Logger.log(`>> Creating redirect "${defaultPath}" => "${path}"`);
      const result = {
        fromPath: defaultPath,
        toPath: path,
        isPermanent: true,
      };
      await actions.createRedirect(result);
      return result;
    }
  };

  const enrichLocales = async (locales, contentful_id) => {
    const localized = await queryGraphql(
      getLocalizedPath(locales, contentful_id)
    );

    const localizedPaths = locales.reduce((red, locale) => {
      const code = removeHyphens(locale);
      const { path } = localized[code];

      if (locale.default) {
        const defaultPath = getDefaultPath(REDIRECT_DEFAULT_PREFIX, path);
        return {
          ...red,
          ['default']: defaultPath || path,
          [locale.code]: path,
        };
      }

      return { ...red, [locale.code]: path };
    }, {});
    return locales.map(locale => ({ ...locale, localizedPaths }));
  };

  return {
    ...actions,
    queryGraphql,
    createRedirect,
    getPages: code =>
      queryGraphql(getPages(code)).then(
        ({ allContentfulPage }) => allContentfulPage.edges
      ),
    enrichLocales,
  };
};

module.exports = init;
