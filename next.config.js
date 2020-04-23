const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules');
const { resolve } = require('path');

const srcDirectory = resolve(__dirname, 'src');
const sharedDirectory = resolve(__dirname, 'shared');
const adapterFile = resolve(srcDirectory, 'adapter', 'next.js');
const transpile = [
  resolve(srcDirectory, 'components'),
  resolve(srcDirectory, 'utils.js'),
  resolve(sharedDirectory, 'utils.js'),
  adapterFile,
];

module.exports = withPlugins([withTM(transpile)], {
  webpack: (config, options) => {
    config.resolve.alias['framework-adapter'] = adapterFile;
    return config;
  },
});
