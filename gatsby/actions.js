const { Logger, getDefaultPath, enrichLocales } = require('../shared/utils');
const { getPages, getLocalizedPath } = require('./queries');

const init = ({ graphql, actions }, redirectDefaultPrefix) => {
  const queryGraphql = async (graphqlString) => {
    const { errors, data } = await graphql(graphqlString);
    if (errors) throw Error(errors.join('\n'));
    return data;
  };

  const createRedirect = async (path) => {
    const defaultPath = getDefaultPath(redirectDefaultPrefix, path);
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
      return enrichLocales(locales, localized, redirectDefaultPrefix);
    },
  };
};

module.exports = init;
