require('dotenv').config();
const open = require('open');
const contentful = require('contentful-management');
const contentfulImport = require('contentful-import');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { resolve } = require('path');

const {
  CONTENTFUL_ENVIRONMENT: environment = 'master',
  CONTENTFUL_MANAGEMENT_TOKEN: accessToken,
  CONTENTFUL_ORGANIZATION_ID: organizationId,
  URL,
} = process.env;

const args = process.argv.slice(2).join(' ');
const skipContent = args.includes('--skip-content');
const skipLocales = args.includes('--skip-locales');

const init = async () => {
  const client = contentful.createClient({ accessToken });

  const space = await client.createSpace({ name: 'Website' }, organizationId);
  const spaceId = space.sys.id;
  console.log(`Created space "${spaceId}"`);
  console.log(`Using environment "${environment}"`);

  (skipContent || skipLocales) &&
    console.log(
      `Skipping import of content ${skipLocales ? 'and locales' : ''}`
    );

  const contentFile = resolve(
    __dirname,
    'data',
    'contentful-boilerplate-website.json'
  );

  console.log(`Setting up "${spaceId}"`);
  await contentfulImport({
    environmentId: environment,
    contentFile,
    contentModelOnly: skipContent || skipLocales,
    skipLocales,
    spaceId,
    managementToken: accessToken,
  });

  const apiKey = await space.createApiKey({ name: 'Gatsby' });
  const envLines = [
    '### Generated environment variables',
    'REDIRECT_DEFAULT_PREFIX="en"',
    !URL && 'URL="https://hinterland.software"',
    `CONTENTFUL_DELIVERY_TOKEN="${apiKey.accessToken}"`,
    `CONTENTFUL_SPACE_ID="${spaceId}"`,
  ].filter(Boolean);

  const envFile = resolve(__dirname, '..', '.env');
  if (existsSync(envFile)) {
    envLines.unshift(readFileSync(envFile, 'utf-8'));
  }
  writeFileSync(envFile, envLines.join('\n'));

  console.log('Added environment variables to the .env file');

  const spaceHomeURL = `https://app.contentful.com/spaces/${spaceId}/home`;

  console.log(`Set up space: ${spaceHomeURL}`);

  await open(spaceHomeURL);
};

init().catch(console.error);
