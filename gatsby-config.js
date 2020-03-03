require('dotenv').config();

const {
  CONTENTFUL_SPACE_ID: spaceId,
  CONTENTFUL_DELIVERY_TOKEN: accessToken,
  CONTENTFUL_ENVIRONMENT: environment = 'master',
} = process.env;

if (!spaceId || !accessToken)
  throw new Error(
    'A contentful spaceId and delivery token need to be provided.'
  );

module.exports = {
  plugins: [
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-source-contentful',
      options: { spaceId, accessToken, environment, useNameForId: false },
    },
  ],
};
