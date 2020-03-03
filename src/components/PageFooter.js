import React from 'react';
import PropTypes from 'prop-types';

import { renderRoutesRecursively, translate } from '../utils';
import RichText from './RichText';

const PageFooter = props => {
  const { resources } = props;

  const company = translate(resources, 'footer.company');
  const email = translate(resources, 'footer.email');

  return (
    <footer>
      <div>
        <RichText json={company && company.json} />
        <RichText json={email && email.json} />
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
