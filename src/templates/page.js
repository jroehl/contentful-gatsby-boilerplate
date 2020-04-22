import { graphql } from 'gatsby';
export { default } from '../components/Page';

export const query = graphql`
  query($contentful_id: String, $node_locale: String) {
    page: contentfulPage(
      contentful_id: { eq: $contentful_id }
      node_locale: { eq: $node_locale }
    ) {
      title
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
`;
