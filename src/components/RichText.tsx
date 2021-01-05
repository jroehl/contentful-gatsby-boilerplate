import React, { FunctionComponent, ReactNode } from 'react';
import { Block, BLOCKS, Inline } from '@contentful/rich-text-types';
import { renderRichText } from 'gatsby-source-contentful/rich-text';

import { mergeClassNames } from '../utils';
import { Message } from './Message';
import { PageContent } from './PageContent';
import { Content } from '../types';

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node: Block | Inline, children: ReactNode) => {
      const { __typename } = node?.data?.target || {};
      switch (__typename) {
        case 'ContentfulPageContent':
          return <PageContent {...node.data.target} />;
        default:
          return <Message error={Error(`"${__typename}" component missing`)} />;
      }
    },
  },
};

export const RichText: FunctionComponent<{
  content: Content | null;
  className?: string;
}> = ({ className, content }) => {
  try {
    if (!content) throw new Error("RichText content can't be null");
    return (
      <div className={mergeClassNames(className)}>
        {renderRichText(content, options)}
      </div>
    );
  } catch (error) {
    return <Message error={error} />;
  }
};
