const { removeHyphens } = require('./utils');

const getPages = locale => `
  query {
    allContentfulPage(filter: { node_locale: { eq: "${locale}" } }) {
        edges {
          node {
            node_locale
            contentful_id
            path
            metadata {
              title
              description
            }
            pageContent {
              __typename
              ... on ContentfulPageNavigation {
                resources {
                  key
                  value {
                    json
                  }
                }
                pages {
                  path
                  title
                  childPages {
                    path
                    title
                  }
                }
              }
              ... on ContentfulPageContent {
                content {
                  json
                }
                resources {
                  key
                  value {
                    json
                  }
                }
              }
              ... on ContentfulPageFooter {
                resources {
                  key
                  value {
                    json
                  }
                }
                pages {
                  path
                  title
                  childPages {
                    path
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
`;

const getLocalizedPath = (locales, contentfulId) => `
  query {
    ${locales
      .map(locale => {
        const parsedLocale = removeHyphens(locale);
        return `${parsedLocale}: contentfulPage( contentful_id: {eq: "${contentfulId}"}, node_locale: {eq: "${locale.code}"}) { path }`;
      })
      .join('\n')}
  }
`;

module.exports = {
  getPages,
  getLocalizedPath,
};
