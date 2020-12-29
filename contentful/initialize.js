const open = require('open');
const contentfulImport = require('contentful-import');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { resolve } = require('path');
const {
  createSpace,
  Logger
} = require('./utils');
const {
  getContentfulEnvironment,
  getBuildEnvironment,
} = require('../shared/utils');

const {
  environment,
  organizationId,
  managementToken,
} = getContentfulEnvironment();

const { domain } = getBuildEnvironment();

const args = process.argv.slice(2).join(' ');
const skipContent = args.includes('--skip-content');
const skipLocales = args.includes('--skip-locales');

const init = async () => {
  const space = await createSpace(name, organizationId);
  const spaceId = space.sys.id;
  Logger.log(`Created space "${spaceId}"`);
  Logger.log(`Using environment "${environment}"`);

  (skipContent || skipLocales) &&
    Logger.log(
      `Skipping import of content ${skipLocales ? 'and locales' : ''}`
    );

  const contentFile = resolve(
    __dirname,
    'data',
    'contentful-boilerplate-website.json'
  );

  Logger.log(`Setting up "${spaceId}"`);
  await contentfulImport({
    environmentId: environment,
    contentFile,
    contentModelOnly: skipContent || skipLocales,
    skipLocales,
    spaceId,
    managementToken,
  });

  const apiKey = await space.createApiKey({ name: 'Gatsby' });
  const envLines = [
    '### Generated environment variables',
    'REDIRECT_DEFAULT_PREFIX="en"',
    !domain && 'URL="https://hinterland.software"',
    `CONTENTFUL_DELIVERY_TOKEN="${apiKey.accessToken}"`,
    `CONTENTFUL_SPACE_ID="${spaceId}"`,
  ].filter(Boolean);

  const envFile = resolve(__dirname, '..', '.env');
  if (existsSync(envFile)) {
    envLines.unshift(readFileSync(envFile, 'utf-8'));
  }
  writeFileSync(envFile, envLines.join('\n'));

  Logger.log('Added environment variables to the .env file');

  const spaceHomeURL = `https://app.contentful.com/spaces/${spaceId}/home`;

  Logger.log(`Set up space: ${spaceHomeURL}`);

  await open(spaceHomeURL);
};

init().catch(Logger.error);
