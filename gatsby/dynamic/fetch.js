import initActions from './actions';

const fetchProps = async ({
  query,
  env: {
    contentful,
    build: { env, domain },
  },
}) => {
  const { getLocalization, getLocales, getEntries } = initActions(contentful);

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
  const [content] = entries.items;

  const localization = await getLocalization(content, requestedLocale, locales);

  return {
    content,
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

export default fetchProps;
