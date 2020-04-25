import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import * as shapes from './proptypes';

const Layout = ({ children, config, metadata: { title, description } }) => {
  const {
    path,
    env,
    domain,
    localization: { locale },
  } = config;
  const isProduction = env === 'production';

  useEffect(() => {
    if (isProduction) {
      // disable console.log
      console.log = () => {};
      // disable console.info
      console.info = () => {};
    }
  }, [isProduction, path]);

  return (
    <Fragment>
      <Helmet>
        <html lang={locale.code} />
        <title>{title}</title>
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content={title} />
        <meta property="og:url" content={path} />
        <meta property="og:image" content={`${domain}/logo.png`} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css"
          integrity="sha256-2YQRJMXD7pIAPHiXr0s+vlRWA7GYJEK0ARns7k2sbHY="
          crossorigin="anonymous"
        />
      </Helmet>
      <main>{children}</main>
    </Fragment>
  );
};

Layout.propTypes = {
  metadata: shapes.metadata,
  config: shapes.config,
  children: PropTypes.node,
};

Layout.defaultProps = {};

export default Layout;
