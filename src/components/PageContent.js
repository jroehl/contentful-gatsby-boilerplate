import React from 'react';
import PropTypes from 'prop-types';

import RichText from './RichText';

const PageContent = props => {
  const { content, config } = props;
  return (
    <section>
      <RichText config={config} json={content && content.json} />
    </section>
  );
};

PageContent.propTypes = {
  content: PropTypes.shape({ json: PropTypes.object }),
  config: PropTypes.object.isRequired,
};

PageContent.defaultProps = {};

export default PageContent;
