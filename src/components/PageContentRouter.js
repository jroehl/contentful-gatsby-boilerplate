import React from 'react';
import PropTypes from 'prop-types';

import PageNavigation from './PageNavigation';
import PageContent from './PageContent';
import PageFooter from './PageFooter';

const PageContentRouter = props => {
  const { typename } = props;
  switch (typename) {
    case 'ContentfulPageNavigation':
      return <PageNavigation {...props} />;
    case 'ContentfulPageContent':
      return <PageContent {...props} />;
    case 'ContentfulPageFooter':
      return <PageFooter {...props} />;
    default:
      return (
        <p style={{ color: '#FF0000' }}>
          <code>"{typename}" component missing</code>
        </p>
      );
  }
};

PageContentRouter.propTypes = {
  typename: PropTypes.string.isRequired,
};

PageContentRouter.defaultProps = {
  typename: '<undefined>',
};

export default PageContentRouter;
