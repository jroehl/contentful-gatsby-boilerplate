import React from 'react';
import PropTypes from 'prop-types';

import Layout from './Layout';
import PageContentRouter from './PageContentRouter';

import '../index.css';

const Page = (props) => {
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
