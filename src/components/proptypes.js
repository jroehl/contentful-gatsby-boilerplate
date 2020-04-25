import PropTypes from 'prop-types';

export const locale = PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  localizedPaths: PropTypes.object.isRequired,
  default: PropTypes.bool,
  fallbackCode: PropTypes.string,
});

export const config = PropTypes.shape({
  path: PropTypes.string.isRequired,
  env: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  localization: PropTypes.shape({
    locales: PropTypes.arrayOf(locale).isRequired,
    locale,
  }).isRequired,
});

export const metadata = PropTypes.shape({
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
});

export const pageContext = PropTypes.shape({ config });

export const richText = PropTypes.shape({
  data: PropTypes.object.isRequired,
  content: PropTypes.array.isRequired,
  nodeType: PropTypes.string.isRequired,
});

export const richTextJson = PropTypes.shape({
  json: richText.isRequired,
});

export const resources = PropTypes.arrayOf(
  PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: richTextJson.isRequired,
  })
);

export const pageContent = PropTypes.arrayOf(
  PropTypes.shape({
    __typename: PropTypes.string.isRequired,
    resources: resources,
  })
);

export const page = PropTypes.shape({
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  metadata: metadata.isRequired,
  pageContent: pageContent.isRequired,
});

export const pages = PropTypes.arrayOf(
  PropTypes.shape({
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    childPages: PropTypes.array,
  })
);
