import React from 'react';

import Router from '../components/Router';
import { getInitialProps } from '../utils';

const NextAdapter = (props) => <Router {...props} />;

NextAdapter.getInitialProps = getInitialProps;

export default NextAdapter;
