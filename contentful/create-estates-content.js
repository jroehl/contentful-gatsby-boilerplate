const { richTextFromMarkdown } = require('@contentful/rich-text-from-markdown');
const { parse } = require('url');
const { basename } = require('path');

const { slug } = require('../gatsby/utils');
const { getEntry } = require('./utils');

const getContentType = url => {
  const { pathname } = parse(url);
  if (pathname.includes('pdf')) return 'application/pdf';
  return 'image/jpeg';
};

const getFileName = url => {
  const { pathname } = parse(url);
  return basename(pathname);
};

const getId = (title, length = 64) => slug(title).substring(0, length);

const getEntrySys = (contentTypeId, identifier) => {
  return {
    id: getId(`${contentTypeId}_${identifier}`),
    type: 'Entry',
    publishedVersion: 1,
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: contentTypeId,
      },
    },
  };
};

const getAssetSys = identifier => {
  return {
    id: getId(`asset_${identifier}`),
    type: 'Asset',
    publishedVersion: 1,
  };
};

const initGetter = (locales, localized) => {
  const defaultLocale = locales.find(locale => locale.default);
  const getKey = key =>
    locales.reduce((red, { code }) => {
      const result = localized[code] ? localized[code][key] : undefined;
      if (result === undefined || result === null) return red;
      return { ...red, [code]: result };
    }, {});

  const getRichTextKey = key =>
    locales.reduce(async (red, { code }) => {
      const result = localized[code] ? localized[code][key] : undefined;
      if (result === undefined || result === null) return red;
      return {
        ...(await red),
        [code]:
          typeof result === 'string'
            ? await richTextFromMarkdown(result)
            : result,
      };
    }, {});

  return { defaultLocale, getKey, getRichTextKey };
};

const generateAssets = (assets, { locales }) => {
  return assets.map(({ id, localized }) => {
    const sys = getAssetSys(id);
    const { getKey } = initGetter(locales, localized);
    return {
      sys,
      fields: {
        title: getKey('title'),
        description: getKey('description'),
        file: locales.reduce((red, { code }) => {
          const value = localized[code];
          if (value === undefined || value === null) return red;
          const { url, fileName, contentType } = value;
          return {
            ...red,
            [code]: {
              url,
              fileName: fileName || getFileName(url),
              contentType: contentType || getContentType(url),
            },
          };
        }, {}),
      },
    };
  });
};

const generateKeyValues = async (contentType, resources, { locales }) => {
  const promises = resources.map(async ({ id, localized }) => {
    const sys = getEntrySys(contentType, id);
    const { getKey, getRichTextKey } = initGetter(locales, localized);

    return {
      sys,
      fields: {
        key: getKey('key'),
        value: await getRichTextKey('value'),
      },
    };
  });
  return Promise.all(promises);
};

const generateEstates = async (
  estates,
  { attachments = [], freeFormTexts = [], specifications = [], locales }
) => {
  const contentType = 'estate';
  const promises = estates.map(async ({ id, localized }) => {
    const sys = getEntrySys(contentType, id);

    const { defaultLocale, getKey, getRichTextKey } = initGetter(
      locales,
      localized
    );

    return {
      sys,
      fields: {
        title: getKey('title'),
        archived: getKey('archived'),
        marketingType: getKey('marketingType'),
        estateType: getKey('estateType'),
        price: getKey('price'),
        space: getKey('space'),
        url: getKey('url'),
        address: await getRichTextKey('address'),
        freeFormTexts: {
          [defaultLocale.code]: freeFormTexts.map(freeFormText => ({
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: freeFormText.sys.id,
            },
          })),
        },
        specifications: {
          [defaultLocale.code]: specifications.map(specification => ({
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: specification.sys.id,
            },
          })),
        },
        attachments: {
          [defaultLocale.code]: attachments.map(attachment => ({
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: attachment.sys.id,
            },
          })),
        },
      },
    };
  });
  return Promise.all(promises);
};

const generatePageEstates = async (identifier, { estates = [], locales }) => {
  const pageEstatesSys = getEntrySys('pageEstates', identifier);
  const { defaultLocale } = initGetter(locales);

  const result = {
    sys: pageEstatesSys,
    fields: {
      identifier: {
        [defaultLocale.code]: identifier,
      },
      type: {
        [defaultLocale.code]: 'type',
      },
      estates: {
        [defaultLocale.code]: estates.map(estate => ({
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: estate.sys.id,
          },
        })),
      },
    },
  };

  try {
    const { fields } = await getEntry(pageEstatesSys.id);
    result.fields.resources = fields.resources || result.fields.resources;
    result.fields.identifier = fields.identifier || result.fields.identifier;
    result.fields.type = fields.type || result.fields.type;
  } catch (error) {}

  return result;
};

const createContent = async ({ pageEstatesIdentifier, locales }, sets) => {
  const attachments = await generateAssets(sets.attachments, {
    locales,
  });

  const freeFormTexts = await generateKeyValues(
    'estateResource',
    sets.freeFormTexts,
    { locales }
  );
  const specifications = await generateKeyValues(
    'estateResource',
    sets.specifications,
    { locales }
  );

  const estates = await generateEstates(sets.estates, {
    attachments,
    freeFormTexts,
    specifications,
    locales,
  });

  const pageEstatesEntry = await generatePageEstates(pageEstatesIdentifier, {
    estates,
    locales,
  });

  const entries = [
    pageEstatesEntry,
    ...estates,
    ...specifications,
    ...freeFormTexts,
  ];

  const assets = [...attachments];

  return { entries, assets };
};

module.exports = createContent;
