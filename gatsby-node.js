const { resolve } = require('path');

const {
  sanitizePath,
  Logger,
  getBuildEnvironment,
  getContentfulEnvironment,
} = require('./gatsby/utils');
const {
  writeRobots,
  RedirectParser,
  SitemapParser,
} = require('./gatsby/build-utils');
const initActions = require('./gatsby/static/actions');
const { getLocales } = require('./contentful/utils');

const buildEnvironment = getBuildEnvironment();
const { env, domain, redirectDefaultPrefix } = buildEnvironment;

const sitemapParser = new SitemapParser(domain);
const redirectParser = new RedirectParser();

const isPreview = env === 'preview';

const buildDynamic = async ({ actions }) => {
  const pageTemplate = resolve(
    __dirname,
    'gatsby',
    'dynamic',
    'templates',
    'page.js'
  );

  const { previewToken, spaceId, environment } = getContentfulEnvironment();

  try {
    sitemapParser.addURL('/');
    redirectParser.addRedirect({ from: '/*', to: '/index.html', status: 200 });

    await actions.createPage({
      path: '/',
      component: pageTemplate,
      matchPath: '/*',
      context: {
        env: {
          build: buildEnvironment,
          contentful: {
            previewToken,
            spaceId,
            environment,
          },
        },
      },
    });
  } catch (error) {
    Logger.error(error);
    process.exit(1);
  }
};

const buildStatic = async (props) => {
  const pageTemplate = resolve(
    __dirname,
    'gatsby',
    'static',
    'templates',
    'page.js'
  );

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
          const redirect = await createRedirect(sanitizedPath);
          redirectParser.addRedirect(redirect);
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

exports.createPages = isPreview ? buildDynamic : buildStatic;

exports.onPostBuild = async () => {
  try {
    sitemapParser.writeSitemap();
    redirectParser.writeRedirects();
    writeRobots(env);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: { fs: 'empty' }, // to be able to require dotenv in shared files
  });
};
