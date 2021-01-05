import React from 'react';

import { RichText } from './RichText';

export const PageContent = (props) => {
  const { content } = props;
  return (
    <section>
      <RichText content={content} />
    </section>
  );
};
