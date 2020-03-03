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

const parseLocale = locale => locale.replace(/-/g, '');

const getLocalizedPath = (locales, contentfulId) => `
  query {
    ${locales
      .map(({ code }) => {
        const locale = parseLocale(code);
        return `${locale}: contentfulPage( contentful_id: {eq: "${contentfulId}"}, node_locale: {eq: "${code}"}) { path }`;
      })
      .join('\n')}
  }
`;

module.exports = {
  getPages,
  getLocalizedPath,
};
