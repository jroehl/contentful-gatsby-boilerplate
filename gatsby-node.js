const {
  Logger,
  getBuildEnvironment,
  writeRobots,
  RedirectParser,
} = require('./gatsby/utils');

exports.onPostBuild = async () => {
  const { env, redirectDefaultPrefix } = getBuildEnvironment();
  const redirectParser = new RedirectParser();

  try {
    redirectParser.addRedirect({
      fromPath: '/',
      toPath: `/${redirectDefaultPrefix}`,
      isPermanent: true,
    });
    redirectParser.writeRedirects();
    writeRobots(env);
  } catch (err) {
    Logger.error(err);
    process.exit(1);
  }
};
