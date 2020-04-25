import React from 'react';
import { Router } from '@reach/router';

import DynamicLoader from '../components/DynamicLoader';

const CatchAllPage = ({ path, ...props }) => {
  return (
    <Router>
      <DynamicLoader path="*" {...props} />
    </Router>
  );
};

export default CatchAllPage;
