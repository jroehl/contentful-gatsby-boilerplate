import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

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

const localeShape = PropTypes.shape({
  code: PropTypes.string.isRequired,
  localizedPaths: PropTypes.object.isRequired,
});

Layout.propTypes = {
  metadata: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }),
  config: PropTypes.shape({
    path: PropTypes.string.isRequired,
    localization: PropTypes.shape({
      locale: localeShape,
    }).isRequired,
    env: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node,
};

Layout.defaultProps = {};

export default Layout;
