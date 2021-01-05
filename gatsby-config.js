require('source-map-support').install();
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
  },
});

const {
  getContentfulEnvironment,
  getBuildEnvironment,
} = require('./gatsby/utils');

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

const plugins = [
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
  'gatsby-plugin-typescript',
];

module.exports = {
  siteMetadata: {
    ...getBuildEnvironment(),
  },
  plugins,
};
