require('dotenv').config();
const contentful = require('contentful');
const contentfulManagement = require('contentful-management');

const {
  CONTENTFUL_SPACE_ID: spaceId,
  CONTENTFUL_ENVIRONMENT: environment = 'master',
  CONTENTFUL_DELIVERY_TOKEN: cdaAccessToken,
  CONTENTFUL_MANAGEMENT_TOKEN: cmaAccessToken,
} = process.env;

const cdaClient = contentful.createClient({
  space: spaceId,
  environment,
  accessToken: cdaAccessToken,
});

const cmaClient = contentfulManagement.createClient({
  space: spaceId,
  environment,
  accessToken: cmaAccessToken,
});

const getLocales = () =>
  cdaClient
    .getLocales()
    .then(({ items }) => items.map(({ sys, ...rest }) => rest));

const getEntry = async (...args) => {
  const space = await cmaClient.getSpace();
  const env = await space.getEnvironment(environment);
  return env.getEntry(...args);
};

module.exports = {
  getLocales,
  getEntry,
};
