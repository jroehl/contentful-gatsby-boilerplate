const contentful = require('contentful');
const contentfulManagement = require('contentful-management');
const { Logger, getContentfulEnvironment } = require('../gatsby/utils');

const {
  spaceId,
  environment,
  deliveryToken,
  managementToken,
  previewToken,
  organizationId,
} = getContentfulEnvironment();

const log = (type) => {
  Logger.log(
    `Creating Contentful <${type}> API client for space "${spaceId}" (${environment})`
  );
};

const getCmaClient = (creds = {}) => {
  log('management');
  return contentfulManagement.createClient({
    accessToken: managementToken,
    ...creds,
  });
};

const getCdaClient = (creds = {}) => {
  log('delivery');
  return contentful.createClient({
    space: spaceId,
    environment,
    accessToken: deliveryToken,
    ...creds,
  });
};

const getPreviewClient = (creds = {}) => {
  log('preview');
  return contentful.createClient({
    space: spaceId,
    environment,
    accessToken: previewToken,
    host: 'preview.contentful.com',
    ...creds,
  });
};

const getLocales = (creds) => {
  return getCdaClient(creds)
    .getLocales()
    .then(({ items }) => items.map(({ sys, ...rest }) => rest));
};

const getEntry = async (...args) => {
  const space = await getCmaClient().getSpace(spaceId);
  const env = await space.getEnvironment(environment);
  return env.getEntry(...args);
};

const createSpace = (name) =>
  getCmaClient().createSpace({ name }, organizationId);

const createEnvironment = async (name) => {
  const space = await getCmaClient().getSpace(spaceId);
  return space.createEnvironment({ name }, organizationId);
};

const cleanSpace = async ({
  environmentId,
  spaceId,
  withContentTypes,
  withAssets,
}) => {
  const space = await getCmaClient().getSpace(spaceId);
  const env = await space.getEnvironment(environmentId);
  const entries = await env.getEntries();

  const unpublishDelete = (items) => {
    return Promise.all(
      items.map(async (item) => {
        try {
          await item.unpublish();
        } catch (error) {}
        await item.delete();
      })
    );
  };

  Logger.log('Deleting entries');
  await unpublishDelete(entries.items);
  if (withContentTypes) {
    Logger.log('Deleting contentTypes');
    const contentTypes = await env.getContentTypes();
    await unpublishDelete(contentTypes.items);
  }
  if (withAssets) {
    Logger.log('Deleting assets');
    const assets = await env.getAssets();
    await unpublishDelete(assets.items);
  }
};

module.exports = {
  getLocales,
  getEntry,
  createSpace,
  createEnvironment,
  cleanSpace,
  getCdaClient,
  getCmaClient,
  getPreviewClient,
  credentials: {
    environment,
    cmaToken: managementToken,
    cdaToken: deliveryToken,
  },
};
