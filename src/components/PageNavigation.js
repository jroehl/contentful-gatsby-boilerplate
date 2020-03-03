import React from 'react';
import { navigate } from 'gatsby';
import PropTypes from 'prop-types';

import { renderRoutesRecursively, translate, parseLocale } from './utils';
import RichText from './RichText';

import styles from './PageNavigation.module.css';

const PageNavigation = props => {
  const {
    pages,
    resources,
    config: {
      localization: { locale, locales, localizedPath },
    },
  } = props;

  const translateRoute = () => {
    const { code: nextLocale } = locales.find(loc => loc.code !== locale.code);
    const parsedLocale = parseLocale(nextLocale);
    navigate(localizedPath[parsedLocale].path);
  };

  const translateButton = translate(resources, 'navigation.translate');
  return (
    <nav className={styles.nav}>
      <div>{renderRoutesRecursively(pages)}</div>
      <button onClick={translateRoute} className="button-primary">
        <RichText json={translateButton && translateButton.json} />
      </button>
    </nav>
  );
};

const localeShape = PropTypes.shape({ code: PropTypes.string.isRequired });

PageNavigation.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.object).isRequired,
  resources: PropTypes.arrayOf(PropTypes.object).isRequired,
  config: PropTypes.shape({
    localization: PropTypes.shape({
      locale: localeShape.isRequired,
      locales: PropTypes.arrayOf(localeShape).isRequired,
      localizedPath: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};

PageNavigation.defaultProps = {};

export default PageNavigation;
