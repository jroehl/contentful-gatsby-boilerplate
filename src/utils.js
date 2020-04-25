import React from 'react';
import { Link } from 'gatsby';

export const renderRoutesRecursively = (pages) => {
  if (!pages) return null;
  return pages.map(({ path, title, childPages }) => (
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

export const initLocalized = ({ code, fallbackCode } = {}) => (property) =>
  property[code] || property[fallbackCode] || property;
