import React from 'react';
import PropTypes from 'prop-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';

import { mergeClassNames, initLocalized } from '../utils';

const initOptions = ({ localization: { locale } }) => {
  const resolve = initLocalized(locale);
  return {
    renderNode: {
      [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
        const { label } = node.data.target.fields;
        const lbl = resolve(label);

        return lbl;
      },
      [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
        if (!locale) return;
        const { description, file, title } = node.data.target.fields;

        const { contentType, url } = resolve(file);
        if (url && contentType.includes('image')) {
          const resolvedTitle = resolve(title);
          const resolvedDescription = resolve(description);
          return (
            <img src={url} alt={`${resolvedTitle} - ${resolvedDescription}`} />
          );
        }
      },
    },
  };
};

const RichText = ({ className, json, config }) => {
  if (!json) return null;

  const options = initOptions(config);
  return (
    <article className={mergeClassNames(className)}>
      {documentToReactComponents(json, options)}
    </article>
  );
};

const localeShape = PropTypes.shape({
  code: PropTypes.string.isRequired,
  localizedPaths: PropTypes.object.isRequired,
});

RichText.propTypes = {
  className: PropTypes.string,
  json: PropTypes.object,
  config: PropTypes.shape({
    localization: PropTypes.shape({
      locale: localeShape,
      locales: PropTypes.arrayOf(localeShape),
    }).isRequired,
  }).isRequired,
};

RichText.defaultProps = {
  config: { localization: {} },
};

export default RichText;
