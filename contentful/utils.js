require('dotenv').config();
const contentful = require('contentful');

const {
  CONTENTFUL_SPACE_ID: space,
  CONTENTFUL_ENVIRONMENT: environment = 'master',
  CONTENTFUL_DELIVERY_TOKEN: accessToken,
} = process.env;

const client = contentful.createClient({ space, environment, accessToken });

const getLocales = () =>
  client
    .getLocales()
    .then(({ items }) => items.map(({ sys, ...rest }) => rest));

module.exports = {
  getLocales,
};
