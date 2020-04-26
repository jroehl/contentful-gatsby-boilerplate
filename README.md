# contentful-gatsby-boilerplate

This is a PoC of a contentful-gatsby-boilerplat base setup.
It simplifies the base setup, by supplying scripts to set up a localized gatsby/contentful website.
You can use as statically generated or a dynamically fetched version.

The site can be deployed static or using BUILD_ENV="preview" dynamically. When set up as "preview", the build process uses a small static adapter to fetch all (preview API) data from Contentful dynamically on the client.

## Start new website project

> Needs "CONTENTFUL_ORGANIZATION_ID" and "CONTENTFUL_MANAGEMENT_TOKEN" added to environment variables (or .env file)

```bash
npm install
npm run contentful:initialize
npm start
open http://localhost:8000/en
```

## Tear down website space

> Deletes the "CONTENTFUL_SPACE_ID" space from the environment variables

```bash
# tear down if space is not needed anymore
npm run contentful:tear-down
```

## Run statically

> Needs "CONTENTFUL_SPACE_ID" and "CONTENTFUL_DELIVERY_TOKEN" added to environment variables (or .env file)

```bash
npm install
npm run start:static
```

## Run dynamically

> Needs "CONTENTFUL_SPACE_ID" and "CONTENTFUL_PREVIEW_TOKEN" added to environment variables (or .env file)

```bash
npm install
npm run start:dynamic
```