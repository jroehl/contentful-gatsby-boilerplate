import React from 'react';

import { Layout } from './Layout';
import { RichText } from './RichText';
import { PageNavigation } from './PageNavigation';
import { PageFooter } from './PageFooter';

export const Page = (props) => {
  const {
    data: { page, site, pages },
    pageContext: { node_locale },
    location,
  } = props;

  const { content, metadata, contentful_id, resources } = page;

  const config = {
    ...site.siteMetadata,
    locale: node_locale,
    location,
    contentful_id,
  };

  console.log(props);

  return (
    <Layout config={config} metadata={metadata}>
      <PageNavigation
        pages={pages.nodes}
        config={config}
        resources={resources}
      />
      <RichText content={content} />
      <PageFooter pages={pages.nodes} config={config} resources={resources} />
    </Layout>
  );
};
