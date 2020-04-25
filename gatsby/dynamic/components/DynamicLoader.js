import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';

import fetchProps from '../fetch';
import DynamicParser from './DynamicParser';

const getSlug = (path) => path.split('/').filter(Boolean);

const useDynamicContentOrRedirect = ({ env, pathname }) => {
  const [dynamicProps, setDynamicProps] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const props = await fetchProps({
        query: { slug: getSlug(pathname) },
        env,
      });
      setDynamicProps(props);
    };
    init();
  }, [pathname, env]);

  if (dynamicProps?.to) {
    setDynamicProps(undefined);
    navigate(dynamicProps.to);
    return;
  }
  return dynamicProps;
};

const DynamicLoader = ({ pageContext, location }) => {
  const dynamicProps = useDynamicContentOrRedirect({
    env: pageContext.env,
    pathname: location.pathname,
  });

  if (!dynamicProps) return <div>loading ...</div>;
  return <DynamicParser {...dynamicProps} />;
};

DynamicLoader.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  pageContext: PropTypes.shape({
    env: PropTypes.shape({
      build: PropTypes.shape({
        env: PropTypes.string.isRequired,
        domain: PropTypes.string.isRequired,
      }).isRequired,
      contentful: PropTypes.shape({
        spaceId: PropTypes.string.isRequired,
        environment: PropTypes.string.isRequired,
        previewToken: PropTypes.string.isRequired,
      }).isRequired,
    }),
  }).isRequired,
};

export default DynamicLoader;
