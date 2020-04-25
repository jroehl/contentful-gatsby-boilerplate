import React from 'react';

import NextRouter from '../components/NextRouter';
import { getInitialProps } from '../../../next/utils';

const NextAdapter = (props) => <NextRouter {...props} />;

NextAdapter.getInitialProps = getInitialProps;

export default NextAdapter;
