import React from 'react';
import { Link } from 'gatsby';

export const renderRoutesRecursively = (pages, locale, filterKey) => {
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
        {renderRoutesRecursively(childPages)}
      </ul>
    ));
};

export const mergeClassNames = (...classNames) =>
  classNames.filter(Boolean).join(' ');

export const translate = (resources = [], key) => {
  const result = resources.find((resource) => resource.key === key);
  if (result) return result.value;
  console.error(`No translation found for ${key}`);
  return null;
};

export const buildPageTreeAndLocales = (pages) => {
  const children = [];
  const locales = [];
  const pageTree = pages.reduce(
    (acc, { contentful_id, node_locale, childPages, ...rest }) => {
      if (!locales.includes(node_locale)) {
        locales.push(node_locale);
      }
      let tree = {};
      if (childPages) {
        tree = buildPageTreeAndLocales(
          childPages.map(({ contentful_id }) => {
            const child = pages.find(
              (page) =>
                page.contentful_id === contentful_id &&
                page.node_locale === node_locale
            );
            children.push(child.contentful_id);
            return child;
          })
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
    {}
  );
  children.forEach((contentful_id) => delete pageTree[contentful_id]);
  return { tree: pageTree, locales };
};
