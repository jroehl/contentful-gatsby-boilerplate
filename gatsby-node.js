require('dotenv').config();
const { resolve } = require('path');

const {
  sanitizePath,
  Logger,
  writeRobots,
  SitemapParser,
} = require('./gatsby/utils');
const initActions = require('./gatsby/actions');
const { getLocales } = require('./contentful/utils');

const {
  BUILD_ENV,
  NODE_ENV = 'development',
  URL,
  REDIRECT_DEFAULT_PREFIX,
} = process.env;
const env = BUILD_ENV || NODE_ENV;

const pageTemplate = resolve(__dirname, 'src', 'templates', 'page.js');

const sitemapParser = new SitemapParser(URL);

exports.createPages = async props => {
  const { createRedirect, createPage, getPages, enrichLocales } = initActions(
    props
  );

  try {
    const locales = await getLocales();
    const hasMultipleLocales = locales.length > 1;

    locales.forEach(async locale => {
      const { code, default: isDefaultLocale } = locale;
      const pages = await getPages(code);

      Logger.log(
        `> Creating pages for "${code}" ${isDefaultLocale ? '<default>' : ''}`
      );

      pages.forEach(
        async ({ node: { metadata, path, contentful_id, ...data } }) => {
          const sanitizedPath = sanitizePath(path);
          Logger.log(`>> Creating page ${sanitizedPath}`);

          // Fetch the translations for the current path
          const enrichedLocales = await enrichLocales(locales, contentful_id);

          if (hasMultipleLocales && isDefaultLocale) {
            await createRedirect(REDIRECT_DEFAULT_PREFIX, sanitizedPath);
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
              config: {
                path: sanitizedPath,
                domain: URL,
                env,
                metadata,
                localization,
              },
              data,
            },
          });
        }
      );
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
