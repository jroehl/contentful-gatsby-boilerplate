const contentful = require('contentful');
const contentfulManagement = require('contentful-management');
const { Logger } = require('../shared/utils');

const {
  CONTENTFUL_SPACE_ID: spaceId,
  CONTENTFUL_ENVIRONMENT: environment = 'master',
  CONTENTFUL_DELIVERY_TOKEN: cdaAccessToken,
  CONTENTFUL_MANAGEMENT_TOKEN: cmaAccessToken,
  CONTENTFUL_PREVIEW_TOKEN: previewAccessToken,
  CONTENTFUL_ORGANIZATION_ID: organizationId,
} = process.env;

const log = (type) => {
  Logger.log(
    `Creating Contentful ${type} API client for space ${spaceId} (${environment})`
  );
};

const getCmaClient = (creds = {}) => {
  log('managment');
  return contentfulManagement.createClient({
    accessToken: cmaAccessToken,
    ...creds,
  });
};

const getCdaClient = (creds = {}) => {
  log('delivery');
  return contentful.createClient({
    space: spaceId,
    environment,
    accessToken: cdaAccessToken,
    ...creds,
  });
};

const getPreviewClient = (creds = {}) => {
  log('preview');
  return contentful.createClient({
    space: spaceId,
    environment,
    accessToken: previewAccessToken,
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
    cmaToken: cmaAccessToken,
    cdaToken: cdaAccessToken,
  },
};
