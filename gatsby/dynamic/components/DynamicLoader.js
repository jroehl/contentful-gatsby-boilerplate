import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';

import fetchProps from '../fetch';
import DynamicParser from './DynamicParser';

const getSlug = (path) => path.split('/').filter(Boolean);

const useDynamicContentOrRedirect = ({ env, pathname }) => {
  const [props, setProps] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      try {
        const fetched = await fetchProps({
          query: { slug: getSlug(pathname) },
          env,
        });
        setProps(fetched);
      } catch (error) {
        console.error(error);
        setProps({ error });
      }
    };
    init();
  }, [pathname, env]);

  if (props?.to) {
    setProps(undefined);
    navigate(props.to);
    return;
  }
  return props;
};

const Message = ({ children, style }) => (
  <div
    style={{
      position: 'absolute',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    <code>{children}</code>
  </div>
);

const DynamicLoader = ({ pageContext, location }) => {
  const content = useDynamicContentOrRedirect({
    env: pageContext.env,
    pathname: location.pathname,
  });

  if (!content) {
    return <Message>loading ...</Message>;
  }
  if (content?.error) {
    return <Message style={{ color: 'red' }}>{content.error.message}</Message>;
  }
  return <DynamicParser {...content} />;
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
