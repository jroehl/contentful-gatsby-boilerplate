const contentful = require('contentful-management');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { resolve } = require('path');
const { getContentfulEnvironment } = require('../shared/utils');
const { Logger } = require('./utils');

const { spaceId, managementToken } = getContentfulEnvironment();

const init = async () => {
  const client = contentful.createClient({ accessToken: managementToken });

  const space = await client.getSpace(spaceId);
  Logger.log(`Deleting space "${space.sys.id}"`);

  const apiKeys = await space.getApiKeys();
  await space.delete();

  const envFile = resolve(__dirname, '..', '.env');
  if (existsSync(envFile)) {
    const envFileContent = readFileSync(envFile, 'utf-8');
    const content = [
      '### Generated environment variables',
      'REDIRECT_DEFAULT_PREFIX="en"',
      'URL="https://hinterland.software"',
      `CONTENTFUL_SPACE_ID="${space.sys.id}"`,
      ...(apiKeys
        ? apiKeys.items.map(
            ({ accessToken }) => `CONTENTFUL_DELIVERY_TOKEN="${accessToken}"`
          )
        : []),
    ].reduce((red, line) => red.replace(line, ''), envFileContent);
    writeFileSync(envFile, content);
  }

  Logger.log(`Deleted space "${space.sys.id}"`);
};

init().catch(Logger.error);
