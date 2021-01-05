import React from 'react';
import { BLOCKS } from '@contentful/rich-text-types';
import { renderRichText } from 'gatsby-source-contentful/rich-text';

import { mergeClassNames } from '../utils';
import { Error } from './Error';
import { PageContent } from './PageContent';

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
      const { __typename } = node?.data?.target || {};
      switch (__typename) {
        case 'ContentfulPageContent':
          return <PageContent {...node.data.target} />;
        default:
          return (
            <Error error={{ message: `"${__typename}" component missing` }} />
          );
      }
    },
  },
};

export const RichText = ({ className, content }) => {
  try {
    return (
      <div className={mergeClassNames(className)}>
        {renderRichText(content, options)}
      </div>
    );
  } catch (error) {
    return <Error error={error} />;
  }
};
