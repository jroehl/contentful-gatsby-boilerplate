const initActions = require('./actions');
const { getBuildEnvironment } = require('../shared/utils');

const getInitialProps = async ({ query }) => {
  const { env, domain } = getBuildEnvironment();

  const { getLocalization, getLocales, getEntries } = initActions();

  const { slug = [] } = query;
  const [locale] = slug;
  const { locales, hasMultipleLocales, defaultLocale } = await getLocales();

  if (hasMultipleLocales && !locale) {
    // handle redirect
    const to = `/${defaultLocale.code.split('-')[0]}`;
    return { to };
  }

  const requestedLocale = hasMultipleLocales
    ? locales.find(({ code }) => code.startsWith(locale))
    : defaultLocale;

  if (!requestedLocale)
    throw new Error(`No content found for locale "${locale}"`);

  const path = `/${slug.join('/')}`;
  const entries = await getEntries(path, requestedLocale);

  const localization = await getLocalization(
    entries.items[0],
    requestedLocale,
    locales
  );

  return {
    stringifiedPage: entries.stringifySafe(),
    pageContext: {
      config: {
        path,
        env,
        domain,
        localization,
      },
    },
  };
};

module.exports = {
  getInitialProps,
};
