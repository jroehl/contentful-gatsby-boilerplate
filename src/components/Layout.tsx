import React, { useEffect, Fragment, FunctionComponent } from 'react';
import { Helmet } from 'react-helmet';

import '../index.css';
import { Metadata, Config } from '../types';

export const Layout: FunctionComponent<{
  config: Config;
  metadata: Metadata;
}> = ({ children, config, metadata: { title, description } }) => {
  const {
    location: { pathname },
    env,
    domain,
    locale,
  } = config;

  const isProduction = env === 'production';

  useEffect(() => {
    if (isProduction) {
      // disable console.log
      console.log = () => {};
      // disable console.info
      console.info = () => {};
    }
  }, [isProduction, pathname]);

  return (
    <Fragment>
      <Helmet>
        <html lang={locale} />
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
        <meta property="og:url" content={pathname} />
        <meta property="og:image" content={`${domain}/logo.png`} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css"
          integrity="sha256-2YQRJMXD7pIAPHiXr0s+vlRWA7GYJEK0ARns7k2sbHY="
          crossOrigin="anonymous"
        />
      </Helmet>
      <main>{children}</main>
    </Fragment>
  );
};
