const contentful = require('contentful-management');
const { readFileSync } = require('fs');
const { getContentfulEnvironment } = require('../shared/utils');

const { environment, spaceId, managementToken } = getContentfulEnvironment();

const [contentTypeId, filePath] = process.argv.slice(2);

const init = async () => {
  const client = contentful.createClient({ accessToken: managementToken });
  console.log(`Reading data from ${filePath}`);

  const space = await client.getSpace(spaceId);
  const env = await space.getEnvironment(environment);

  const data = JSON.parse(readFileSync(filePath, 'utf-8'));

  console.log(`Processing ${data.length} entrie${data.length > 1 ? 's' : ''}`);

  data.forEach(async (fields) => {
    console.log(`Creating "${contentTypeId}" entry`);
    const entry = await env.createEntry(contentTypeId, { fields });
    await entry.publish();
  });
};

init().catch(console.error);
