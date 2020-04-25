import React from 'react';
import PropTypes from 'prop-types';

import Layout from './Layout';
import PageContentRouter from './PageContentRouter';
import * as shapes from './proptypes';

const Page = (props) => {
  const {
    data: { page },
    pageContext: { config },
  } = props;

  const { pageContent, metadata, ...restData } = page;

  return (
    <Layout config={config} metadata={metadata}>
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
  pageContext: shapes.pageContext,
  data: PropTypes.shape({
    page: shapes.page.isRequired,
  }),
};

export default Page;
