const { resolve } = require('path');

const { sanitizePath, Logger, getBuildEnvironment } = require('./shared/utils');
const { writeRobots, SitemapParser } = require('./gatsby/utils');
const initActions = require('./gatsby/actions');
const { getLocales } = require('./contentful/utils');

const { env, domain, redirectDefaultPrefix } = getBuildEnvironment();

const gatsbySrcDirectory = resolve(__dirname, 'gatsby', 'src');
const pageTemplate = resolve(gatsbySrcDirectory, 'templates', 'page.js');

const sitemapParser = new SitemapParser(domain);

exports.createPages = async (props) => {
  const { createRedirect, createPage, getPages, enrichLocales } = initActions(
    props,
    redirectDefaultPrefix
  );

  try {
    const locales = await getLocales();
    const hasMultipleLocales = locales.length > 1;

    locales.forEach(async (locale) => {
      const { code, default: isDefaultLocale } = locale;
      const pages = await getPages(code);

      Logger.log(
        `> Creating pages for "${code}" ${isDefaultLocale ? '<default>' : ''}`
      );

      pages.forEach(async ({ node: { path, ...node } }) => {
        const sanitizedPath = sanitizePath(path);
        Logger.log(`>> Creating page ${sanitizedPath}`);

        // Fetch the translations for the current path
        const enrichedLocales = await enrichLocales(
          locales,
          node.contentful_id
        );

        if (hasMultipleLocales && isDefaultLocale) {
          await createRedirect(sanitizedPath);
        }

        const localization = {
          locales: enrichedLocales,
          locale: enrichedLocales.find(({ code }) => code === locale.code),
        };

        sitemapParser.addURL(sanitizedPath, localization);

        await createPage({
          path: sanitizedPath,
          component: pageTemplate,
          context: {
            ...node,
            config: {
              path: sanitizedPath,
              domain,
              env,
              localization,
            },
          },
        });
      });
    });
  } catch (error) {
    Logger.error(error);
    process.exit(1);
  }
};

exports.onPostBuild = async () => {
  try {
    sitemapParser.writeSitemap();
    writeRobots(env);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        'framework-adapter': resolve(gatsbySrcDirectory, 'adapter.js'),
      },
    },
  });
};
