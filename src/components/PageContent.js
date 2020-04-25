import React from 'react';

import RichText from './RichText';
import * as shapes from './proptypes';

const PageContent = (props) => {
  const { content, config } = props;
  return (
    <section>
      <RichText config={config} json={content && content.json} />
    </section>
  );
};

PageContent.propTypes = {
  content: shapes.richTextJson,
  config: shapes.config,
};

PageContent.defaultProps = {};

export default PageContent;
