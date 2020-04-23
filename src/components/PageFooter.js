import React from 'react';

import { renderRoutesRecursively, translate } from '../utils';
import RichText from './RichText';
import * as shapes from './proptypes';

const PageFooter = (props) => {
  const { resources, config, pages } = props;

  const company = translate(resources, 'footer.company');
  const email = translate(resources, 'footer.email');

  return (
    <footer>
      <div>
        <RichText config={config} json={company && company.json} />
        <RichText config={config} json={email && email.json} />
      </div>
      <div>{renderRoutesRecursively(pages)}</div>
    </footer>
  );
};

PageFooter.propTypes = {
  pages: shapes.pages.isRequired,
  resources: shapes.resources,
  config: shapes.config,
};

PageFooter.defaultProps = {};

export default PageFooter;
