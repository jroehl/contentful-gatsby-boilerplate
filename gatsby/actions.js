const { Logger } = require('./utils');

const init = ({ graphql, actions }) => {
  const queryGraphql = async graphqlString => {
    const { errors, data } = await graphql(graphqlString);
    if (errors) throw Error(errors.join('\n'));
    return data;
  };

  const createRedirect = (defaultPrefix, path) => {
    if (defaultPrefix) {
      // createRedirects
      const fromPath = path.replace(`${defaultPrefix}/`, '');
      Logger.log(`>> Creating redirect "${fromPath}" => "${path}"`);
      actions.createRedirect({
        fromPath,
        toPath: path,
        isPermanent: true,
      });
    }
  };

  return {
    queryGraphql,
    createRedirect,
    createPage: actions.createPage,
  };
};

module.exports = init;
