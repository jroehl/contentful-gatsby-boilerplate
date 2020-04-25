const { getContentfulEnvironment } = require('./shared/utils');

const {
  environment,
  host,
  spaceId,
  deliveryToken,
} = getContentfulEnvironment();

if (!spaceId || !deliveryToken)
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
      options: {
        spaceId,
        accessToken: deliveryToken,
        host,
        environment,
        useNameForId: false,
      },
    },
  ],
};
