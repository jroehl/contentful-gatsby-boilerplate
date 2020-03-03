const { resolve } = require('path');

const { sanitizePath, Logger } = require('./gatsby/utils');
const initActions = require('./gatsby/actions');
const { getPages, getLocalizedPath } = require('./gatsby/queries');
const { getLocales } = require('./contentful/utils');

const {
  BUILD_ENV,
  NODE_ENV = 'development',
  URL,
  REDIRECT_DEFAULT_PREFIX,
} = process.env;
const env = BUILD_ENV || NODE_ENV;

const pageTemplate = resolve(__dirname, 'src', 'templates', 'page.js');

exports.createPages = async props => {
  const { queryGraphql, createRedirect, createPage } = initActions(props);

  try {
    const locales = await getLocales();
    const hasMultipleLocales = locales.length > 1;

    locales.forEach(async locale => {
      const { code, default: isDefaultLocale } = locale;
      const {
        allContentfulPage: { edges: pages },
      } = await queryGraphql(getPages(code));

      Logger.log(
        `> Creating pages for "${code}" ${isDefaultLocale ? '<default>' : ''}`
      );

      pages.forEach(
        async ({ node: { metadata, path, contentful_id, ...data } }) => {
          const sanitizedPath = sanitizePath(path);
          Logger.log(`>> Creating page ${sanitizedPath}`);

          if (hasMultipleLocales && isDefaultLocale) {
            createRedirect(REDIRECT_DEFAULT_PREFIX, sanitizedPath);
          }

          // Fetch the translations for the current path
          const localizedPath = await queryGraphql(
            getLocalizedPath(locales, contentful_id)
          );

          await createPage({
            path: sanitizedPath,
            component: pageTemplate,
            context: {
              config: {
                path: sanitizedPath,
                domain: URL,
                env,
                metadata,
                localization: {
                  locales,
                  locale,
                  localizedPath,
                },
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
