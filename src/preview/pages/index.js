import React from 'react';

import Redirect from '../components/Redirect';
import Router from '../components/Router';
import { getInitialProps } from '../utils';

const NextAdapter = (props) => {
  if (props.to) return <Redirect {...props} />;
  return <Router {...props} />;
};

NextAdapter.getInitialProps = getInitialProps;

export default NextAdapter;
