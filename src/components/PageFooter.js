import React from 'react';
import PropTypes from 'prop-types';

import { renderRoutesRecursively, translate } from '../utils';
import RichText from './RichText';

const PageFooter = props => {
  const { resources, config } = props;

  const company = translate(resources, 'footer.company');
  const email = translate(resources, 'footer.email');

  return (
    <footer>
      <div>
        <RichText config={config} json={company && company.json} />
        <RichText config={config} json={email && email.json} />
      </div>
      <div>{renderRoutesRecursively(props.pages)}</div>
    </footer>
  );
};

PageFooter.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.object).isRequired,
  resources: PropTypes.arrayOf(PropTypes.object).isRequired,
};

PageFooter.defaultProps = {};

export default PageFooter;
