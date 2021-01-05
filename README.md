# contentful-gatsby-boilerplate

## ToC

- [contentful-gatsby-boilerplate](#contentful-gatsby-boilerplate)
  - [ToC](#toc)
  - [About](#about)
  - [Setup](#setup)
    - [Start new website project](#start-new-website-project)
    - [Tear down website space](#tear-down-website-space)
  - [Develop and build](#develop-and-build)
    - [Static](#static)

## About

This is a PoC of a [Contentful](https://www.contentful.com/) [Gatsby](https://www.gatsbyjs.org/) base setup.

It simplifies the base setup, by supplying scripts to set up a localized gatsby/contentful website.

The site can be deployed statically with Gatsby.

The build process creates following files:

- `_redirects` file for Netlify with default redirects for the static version
- `robots.txt` file to allow or disallow crawling of the website -depending on the `NODE_ENV/BUILD_ENV`

## Setup

### Start new website project

> Needs "CONTENTFUL_ORGANIZATION_ID" and "CONTENTFUL_MANAGEMENT_TOKEN" added to environment variables (or .env file)

```bash
npm install
npm run contentful:initialize
npm start
open http://localhost:8000/en
```

### Tear down website space

> Deletes the "CONTENTFUL_SPACE_ID" space from the environment variables

```bash
# tear down if space is not needed anymore
npm run contentful:tear-down
```

## Develop and build

### Static

This creates a static version of the website that uses the [Contentful Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/) using [gatsby-source-contentful](https://www.gatsbyjs.org/packages/gatsby-source-contentful/) to fetch data from Contentful during the build.

```bash
# Needs "CONTENTFUL_SPACE_ID" and "CONTENTFUL_DELIVERY_TOKEN" added to environment variables (or .env file)
export CONTENTFUL_SPACE_ID="<space_id>"
export CONTENTFUL_PREVIEW_TOKEN="<delivery_token>"

npm install
npm run start # or npm run build
```

[Example](https://contentful-gatsby-boilerplate.netlify.app/) of a static version deployed using [Netlify](https://www.netlify.com/).