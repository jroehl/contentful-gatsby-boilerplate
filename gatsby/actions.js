require('dotenv').config();
const { Logger, getDefaultPath, enrichLocales } = require('../shared/utils');
const { getPages, getLocalizedPath } = require('./queries');

const { REDIRECT_DEFAULT_PREFIX } = process.env;

const init = ({ graphql, actions }) => {
  const queryGraphql = async (graphqlString) => {
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

  return {
    ...actions,
    queryGraphql,
    createRedirect,
    getPages: (code) =>
      queryGraphql(getPages(code)).then(
        ({ allContentfulPage }) => allContentfulPage.edges
      ),
    enrichLocales: async (locales, contentfulId) => {
      const localized = await queryGraphql(
        getLocalizedPath(locales, contentfulId)
      );
      return enrichLocales(locales, localized, REDIRECT_DEFAULT_PREFIX);
    },
  };
};

module.exports = init;
