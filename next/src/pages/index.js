import React from 'react';

import Redirect from '../components/Redirect';
import NextRouter from '../components/NextRouter';
import { getInitialProps } from '../../utils';

const NextAdapter = (props) => {
  if (props.to) return <Redirect {...props} />;
  return <NextRouter {...props} />;
};

NextAdapter.getInitialProps = getInitialProps;

export default NextAdapter;
