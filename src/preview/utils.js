import { getPreviewClient } from '../../contentful/utils';
import { enrichLocales, removeHyphens } from '../../shared/utils';

const initActions = () => {
  const previewClient = getPreviewClient();

  const getLocalization = async (entry, locale, locales) => {
    const { sys } = entry;
    const localized = await locales.reduce(async (acc, locale) => {
      const { items } = await await previewClient.getEntries({
        locale: locale.code,
        content_type: sys.contentType.sys.id,
        select: 'fields.path',
        'sys.id': sys.id,
        resolveLinks: false,
      });

      return {
        ...(await acc),
        [removeHyphens(locale)]: items[0].fields,
      };
    }, {});

    const enrichedLocales = enrichLocales(locales, localized);

    return {
      locales: enrichedLocales,
      locale: enrichedLocales.find(({ code }) => code === locale.code),
    };
  };

  const getLocales = async () => {
    const { items } = await previewClient.getLocales();
    const locales = items.map(({ sys, ...rest }) => rest);
    const hasMultipleLocales = locales.length > 1;
    const defaultLocale = locales.find((locale) => locale.default);
    return { defaultLocale, hasMultipleLocales, locales };
  };

  const getEntries = async (path, locale) => {
    const entries = await previewClient.getEntries({
      content_type: 'page',
      locale: locale.code,
      'fields.path': path,
      include: 10,
    });
    if (!entries || !entries.items.length)
      throw new Error(`No content found for path "${path}"`);

    return entries;
  };

  return { getLocalization, getLocales, getEntries };
};

export const getInitialProps = async ({ query }) => {
  const { BUILD_ENV, NODE_ENV = 'development', URL } = process.env;

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
        env: BUILD_ENV || NODE_ENV,
        domain: URL,
        localization,
      },
    },
  };
};
