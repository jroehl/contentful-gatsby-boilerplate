import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../components/Layout';
import PageContentRouter from '../components/PageContentRouter';

import '../index.css';

const Page = props => {
  const {
    pageContext: { data, config },
    location,
  } = props;

  const { pageContent, ...restData } = data;

  return (
    <Layout config={config} location={location}>
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
    data: PropTypes.shape({
      pageContent: PropTypes.arrayOf(
        PropTypes.shape({
          __typename: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired,
    config: PropTypes.object.isRequired,
  }).isRequired,
  location: PropTypes.object.isRequired,
};

export default Page;
