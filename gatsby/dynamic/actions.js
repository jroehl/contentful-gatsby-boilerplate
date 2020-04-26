import * as contentful from 'contentful';

import { enrichLocales, removeHyphens } from '../utils';

const getPreviewClient = ({ spaceId, environment, previewToken } = {}) => {
  return contentful.createClient({
    space: spaceId,
    environment: environment,
    accessToken: previewToken,
    host: 'preview.contentful.com',
  });
};

const init = (credentials) => {
  const previewClient = getPreviewClient(credentials);

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
      throw new Error(`No content/route found for path "${path}"`);

    return entries;
  };

  return { getLocalization, getLocales, getEntries };
};

export default init;
