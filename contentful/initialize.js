require('dotenv').config();
const contentful = require('contentful-management');
const contentfulImport = require('contentful-import');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { resolve } = require('path');

const contentTypes = require('./data/content-types');

const {
  CONTENTFUL_ENVIRONMENT: environment = 'master',
  CONTENTFUL_MANAGEMENT_TOKEN: accessToken,
  CONTENTFUL_ORGANIZATION_ID: organizationId,
  URL,
} = process.env;

const init = async () => {
  const client = contentful.createClient({ accessToken });

  const space = await client.createSpace({ name: 'Website' }, organizationId);
  const spaceId = space.sys.id;
  console.log(`Created space "${spaceId}"`);

  const env = await space.getEnvironment(environment);
  console.log(`Using environment "${environment}"`);

  const createContentTypeWithId = async id => {
    const contentTypeData = contentTypes[id];
    if (!contentTypeData)
      throw new Error(`No contentType data found for <${id}>`);

    console.log(`Creating content-type "${contentTypeData.name}" <${id}>`);
    const contentType = await env.createContentTypeWithId(id, contentTypeData);
    await contentType.publish();
    return contentType;
  };

  await createContentTypeWithId('resource');
  await createContentTypeWithId('page');
  await createContentTypeWithId('pageMetadata');
  await createContentTypeWithId('pageNavigation');
  await createContentTypeWithId('pageContent');
  await createContentTypeWithId('pageFooter');

  await env.createLocale({
    name: 'German (Germany)',
    code: 'de-DE',
    fallbackCode: 'en-US',
    contentManagementApi: true,
    contentDeliveryApi: true,
    optional: false,
  });

  const options = {
    contentFile: resolve(
      __dirname,
      'data',
      'contentful-export-master-2020-03-03T12-32-32.json'
    ),
    skipContentModel: true,
    spaceId,
    managementToken: accessToken,
  };

  console.log(`Importing content to "${spaceId}"`);
  await contentfulImport(options);

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

  console.log(
    `Set up space: https://app.contentful.com/spaces/${spaceId}/home`
  );
};

init().catch(console.error);
