import React from 'react';
import { navigate } from 'gatsby';

import { renderRoutesRecursively, translate } from '../utils';
import RichText from './RichText';
import * as shapes from './proptypes';

import styles from './PageNavigation.module.css';

const PageNavigation = (props) => {
  const { pages, resources, config } = props;

  const {
    localization: { locale, locales },
  } = config;

  const translateRoute = () => {
    if (locales.length <= 1) {
      alert('No additional locale defined in Contentful');
      return;
    }
    const { code: nextLocale } = locales.find(
      (loc) => loc.code !== locale.code
    );
    console.log(locales, locale);
    console.log({ nextLocale, path: locale.localizedPaths[nextLocale] });
    navigate(locale.localizedPaths[nextLocale]);
  };

  const translateButton = translate(resources, 'navigation.translate');
  return (
    <nav className={styles.nav}>
      <div>{renderRoutesRecursively(pages)}</div>
      <button onClick={translateRoute} className="button-primary">
        <RichText
          config={config}
          json={translateButton && translateButton.json}
        />
      </button>
    </nav>
  );
};

PageNavigation.propTypes = {
  pages: shapes.pages.isRequired,
  resources: shapes.resources,
  config: shapes.config,
};

PageNavigation.defaultProps = {};

export default PageNavigation;
