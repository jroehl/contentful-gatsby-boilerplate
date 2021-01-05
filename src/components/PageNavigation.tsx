import React, { FunctionComponent } from 'react';
import { navigate } from 'gatsby';

import {
  renderRoutesRecursively,
  translate,
  buildPageTreeAndLocales,
} from '../utils';
import { RichText } from './RichText';
import { Config, PageRoute, Resource } from '../types';

import styles from './PageNavigation.module.css';

export const PageNavigation: FunctionComponent<{
  resources?: Array<Resource>;
  pages: Array<PageRoute>;
  config: Config;
}> = (props) => {
  const { pages, resources, config } = props;

  const { tree, locales } = buildPageTreeAndLocales(pages);

  const { locale, contentful_id } = config;

  const translateRoute = () => {
    if (locales.length <= 1) {
      alert('No additional locale defined in Contentful');
      return;
    }
    const nextLocale =
      locales.find((loc) => loc !== locale) || config.redirectDefaultPrefix;
    const { path } = tree[contentful_id][nextLocale];
    console.log(locales, locale);
    console.log({ nextLocale, path });
    navigate(path);
  };

  const translateButton = translate(resources, 'navigation.translate');
  return (
    <nav className={styles.nav}>
      <div>{renderRoutesRecursively(pages, locale, 'showInNavigation')}</div>
      <button onClick={translateRoute} className="button-primary">
        <RichText content={translateButton} />
      </button>
    </nav>
  );
};
