require('dotenv').config();
const contentful = require('contentful');
const contentfulManagement = require('contentful-management');

const {
  CONTENTFUL_SPACE_ID: spaceId,
  CONTENTFUL_ENVIRONMENT: environment = 'master',
  CONTENTFUL_DELIVERY_TOKEN: cdaAccessToken,
  CONTENTFUL_MANAGEMENT_TOKEN: cmaAccessToken,
  CONTENTFUL_ORGANIZATION_ID: organizationId,
} = process.env;

const cdaClient = contentful.createClient({
  space: spaceId,
  environment,
  accessToken: cdaAccessToken,
});

const cmaClient = contentfulManagement.createClient({
  accessToken: cmaAccessToken,
});

const getLocales = () =>
  cdaClient
    .getLocales()
    .then(({ items }) => items.map(({ sys, ...rest }) => rest));

const getEntry = async (...args) => {
  const space = await cmaClient.getSpace(spaceId);
  const env = await space.getEnvironment(environment);
  return env.getEntry(...args);
};

const createSpace = name => cmaClient.createSpace({ name }, organizationId);

const createEnvironment = async name => {
  const space = await cmaClient.getSpace(spaceId);
  return space.createEnvironment({ name }, organizationId);
};

const cleanSpace = async ({
  environmentId,
  spaceId,
  withContentTypes,
  withAssets,
}) => {
  const space = await cmaClient.getSpace(spaceId);
  const env = await space.getEnvironment(environmentId);
  const entries = await env.getEntries();

  const unpublishDelete = items => {
    return Promise.all(
      items.map(async item => {
        try {
          await item.unpublish();
        } catch (error) {}
        await item.delete();
      })
    );
  };

  console.log('Deleting entries');
  await unpublishDelete(entries.items);
  if (withContentTypes) {
    console.log('Deleting contentTypes');
    const contentTypes = await env.getContentTypes();
    await unpublishDelete(contentTypes.items);
  }
  if (withAssets) {
    console.log('Deleting assets');
    const assets = await env.getAssets();
    await unpublishDelete(assets.items);
  }
};

module.exports = {
  getLocales,
  getEntry,
  createSpace,
  createEnvironment,
  cmaClient,
  cdaClient,
  cleanSpace,
  credentials: {
    environment,
    cmaToken: cmaAccessToken,
    cdaToken: cdaAccessToken,
  },
};
