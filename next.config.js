const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules');
const { resolve } = require('path');

const pathsToTranspile = [
  resolve(__dirname, 'src'),
  resolve(__dirname, 'shared'),
];

module.exports = withPlugins([withTM(pathsToTranspile)], {
  webpack: (config, options) => {
    config.resolve.alias['framework-adapter'] = resolve(
      __dirname,
      'next',
      'src',
      'adapter.js'
    );
    return config;
  },
});
