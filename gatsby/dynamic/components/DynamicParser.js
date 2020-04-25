import React from 'react';
import PropTypes from 'prop-types';

import Page from '../../../src/components/Page';
import * as shapes from '../../../src/components/proptypes';

const parseResources = ({ resources = [] }) => {
  return resources.map(({ fields: { key, value: json } }) => ({
    key,
    value: { json },
  }));
};

const parsePagesRecursive = (indexPage, pages) => {
  return pages.map(
    ({ fields: { path, title, childPages = [] } = indexPage }) => ({
      path,
      title,
      childPages: parsePagesRecursive(indexPage, childPages),
    })
  );
};

const getTypeName = (contentTypeId = '', prefix = 'Contentful') => {
  const capitalized =
    contentTypeId.charAt(0).toUpperCase() + contentTypeId.substring(1);
  return `${prefix}${capitalized}`;
};

const DynamicParser = ({ pageContext, content }) => {
  const {
    title,
    path,
    pageContent,
    metadata: { fields: metadata },
  } = content.fields;

  const parsedPageContent = pageContent.map(({ sys, fields }) => {
    const contentTypeId = sys?.contentType?.sys?.id;
    const __typename = getTypeName(contentTypeId);
    const resources = parseResources(fields);

    switch (contentTypeId) {
      case 'pageNavigation':
      case 'pageFooter':
        return {
          __typename,
          resources,
          pages: parsePagesRecursive(content, fields.pages),
        };
      case 'pageContent':
        return {
          __typename,
          resources,
          content: { json: fields.content },
        };
      default:
        throw new Error(
          `No parser found for contentTypeId "${contentTypeId}" (${__typename})`
        );
    }
  });

  return (
    <Page
      data={{
        page: {
          title,
          path,
          metadata,
          pageContent: parsedPageContent,
        },
      }}
      pageContext={pageContext}
    />
  );
};

DynamicParser.propTypes = {
  content: PropTypes.object.isRequired,
  pageContext: shapes.pageContext.isRequired,
};

export default DynamicParser;
