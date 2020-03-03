# contentful-gatsby-boilerplate

> This is an attempt to simplify the base boilerplate setup of a localized gatsby/contentful website

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
