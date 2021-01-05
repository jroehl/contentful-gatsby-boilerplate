import React from 'react';

import { renderRoutesRecursively, translate } from '../utils';
import { RichText } from './RichText';

export const PageFooter = (props) => {
  const { resources, pages, config } = props;

  const company = translate(resources, 'footer.company');
  const email = translate(resources, 'footer.email');

  return (
    <footer>
      <div>
        <RichText content={company} />
        <RichText content={email} />
      </div>
      <div>{renderRoutesRecursively(pages, config.locale, 'showInFooter')}</div>
    </footer>
  );
};
