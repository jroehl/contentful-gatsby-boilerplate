import React, { ReactNode } from 'react';
import { Link } from 'gatsby';
import { Content, PageRoute, PageTree, Resource } from './types';

export const renderRoutesRecursively = (
  pages: Array<PageRoute>,
  locale: string,
  filterKey?: 'showInFooter' | 'showInNavigation'
): ReactNode => {
  if (!pages) return null;
  return pages
    .filter(
      (page) => page.node_locale === locale && (!filterKey || page[filterKey])
    )
    .map(({ path, title, childPages }) => (
      <ul key={path}>
        <li>
          <Link to={path}>{title}</Link>
        </li>
        {childPages && renderRoutesRecursively(childPages, locale, filterKey)}
      </ul>
    ));
};

export const mergeClassNames = (...classNames: Array<unknown>): string =>
  classNames.filter(Boolean).join(' ');

export const translate = (
  resources: Array<Resource> = [],
  key: string
): Content | null => {
  const result = resources.find((resource) => resource.key === key);
  if (result) return result.value;
  console.error(`No translation found for ${key}`);
  return null;
};

export const buildPageTreeAndLocales = (
  pages: Array<PageRoute>
): {
  tree: PageTree;
  locales: Array<string>;
} => {
  const children: Array<string> = [];
  const locales: Array<string> = [];
  const pageTree = pages.reduce(
    (acc, { contentful_id, node_locale, childPages, ...rest }) => {
      if (!locales.includes(node_locale)) {
        locales.push(node_locale);
      }
      let tree = {};
      if (childPages) {
        tree = buildPageTreeAndLocales(
          childPages
            .map(({ contentful_id }) => {
              const child = pages.find(
                (page) =>
                  page.contentful_id === contentful_id &&
                  page.node_locale === node_locale
              );
              if (child) {
                children.push(child.contentful_id);
                return child;
              }
            })
            .filter(Boolean) as Array<PageRoute>
        );
      }
      return {
        ...acc,
        [contentful_id]: {
          ...(acc[contentful_id] || {}),
          [node_locale]: { ...rest, childPages: tree },
        },
      };
    },
    {} as PageTree
  );
  children.forEach((contentful_id) => delete pageTree[contentful_id]);
  return { tree: pageTree, locales };
};
