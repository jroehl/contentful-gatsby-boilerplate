import React from 'react';
import { navigate } from 'gatsby';
import PropTypes from 'prop-types';

import { renderRoutesRecursively, translate } from '../utils';
import RichText from './RichText';

import styles from './PageNavigation.module.css';

const PageNavigation = props => {
  const { pages, resources, config } = props;

  const {
    localization: { locale, locales },
  } = config;

  const translateRoute = () => {
    const { code: nextLocale } = locales.find(loc => loc.code !== locale.code);
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

const localeShape = PropTypes.shape({
  code: PropTypes.string.isRequired,
  localizedPaths: PropTypes.object.isRequired,
});

PageNavigation.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.object).isRequired,
  resources: PropTypes.arrayOf(PropTypes.object).isRequired,
  config: PropTypes.shape({
    localization: PropTypes.shape({
      locale: localeShape.isRequired,
      locales: PropTypes.arrayOf(localeShape).isRequired,
    }).isRequired,
  }).isRequired,
};

PageNavigation.defaultProps = {};

export default PageNavigation;
