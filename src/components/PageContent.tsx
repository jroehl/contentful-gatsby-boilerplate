import React, { FunctionComponent } from 'react';

import { RichText } from './RichText';
import { Content } from '../types';

export const PageContent: FunctionComponent<{ content: Content }> = (props) => {
  const { content } = props;
  return (
    <section>
      <RichText content={content} />
    </section>
  );
};
