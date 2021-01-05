import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import { Page } from '../../components/Page';

const Component: FunctionComponent<any> = (props) => <Page {...props} />;
export default Component;

// This is the page query that connects the data to the actual component. Here you can query for any and all fields
// you need access to within your code. Again, since Gatsby always queries for `id` in the collection, you can use that
// to connect to this GraphQL query.
export const query = graphql`
  query($id: String) {
    pages: allContentfulPage {
      nodes {
        contentful_id
        title
        node_locale
        showInNavigation
        showInFooter
        path: gatsbyPath(
          filePath: "/{contentfulPage.node_locale}/{contentfulPage.title}"
        )
        # TODO find solution to use nested routes https://github.com/gatsbyjs/gatsby/discussions/26375#discussioncomment-133880
        #childPages {
        #  contentful_id
        #}
      }
    }
    site {
      siteMetadata {
        env
        domain
        redirectDefaultPrefix
      }
    }
    page: contentfulPage(id: { eq: $id }) {
      contentful_id
      title
      metadata {
        title
        description
      }
      resources {
        key
        value {
          raw
          #references {
          #  __typename
          #}
        }
      }
      content {
        raw
        references {
          __typename
          ... on ContentfulPageContent {
            contentful_id
            raw
            references {
              __typename
            }
            content {
              __typename
              raw
            }
          }
        }
      }
    }
  }
`;
