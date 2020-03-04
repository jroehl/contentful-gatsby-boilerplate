import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import PageContentRouter from '../components/PageContentRouter';

import '../index.css';

const Page = props => {
  const {
    data: { page },
    pageContext: { config },
    location,
  } = props;

  const { pageContent, metadata, ...restData } = page;

  return (
    <Layout config={config} metadata={metadata} location={location}>
      {pageContent.map(({ __typename, ...content }, i) => {
        return (
          <PageContentRouter
            {...content}
            key={`${__typename}_${i}`}
            typename={__typename}
            pageContext={restData}
            config={config}
          />
        );
      })}
    </Layout>
  );
};

Page.propTypes = {
  pageContext: PropTypes.shape({
    config: PropTypes.object.isRequired,
  }).isRequired,
  location: PropTypes.object.isRequired,
  data: PropTypes.shape({
    page: PropTypes.shape({
      pageContent: PropTypes.arrayOf(
        PropTypes.shape({
          __typename: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired,
  }),
};

export default Page;

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
