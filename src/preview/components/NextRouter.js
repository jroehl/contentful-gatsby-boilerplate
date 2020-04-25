import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Page from '../../components/Page';
import traverse from 'traverse';
import * as shapes from '../../components/proptypes';

const findMissingLinks = (obj) => {
  return traverse(obj).reduce(
    function (acc, node) {
      const linkType = node?.sys?.linkType;
      const type = node?.sys?.type;
      const fields = node?.fields;
      if (type === 'Link' && linkType.match(/(entry|asset)/i) && !fields) {
        const lowerKey = linkType.toLowerCase();
        return {
          ...acc,
          [lowerKey]: {
            ...acc[lowerKey],
            [node.sys.id]: this.path,
          },
        };
      }
      return acc;
    },
    {
      entry: {},
      asset: {},
    }
  );
};

const enrichMissing = (obj, missingLinks) => {
  const clone = traverse(obj).clone();
  const traversed = traverse(clone);
  traversed.forEach(function (node) {
    const id = node?.sys?.id;
    const fields = node?.fields;
    const lowerKey = node?.sys?.type?.toLowerCase();
    const missingType = missingLinks[lowerKey];
    if (missingType && fields) {
      const path = missingType[id];
      if (path) traversed.set(path, node);
    }
  });
  return clone;
};

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

const parseAndEnrichPage = (stringifiedPage) => {
  const {
    items: [content],
  } = JSON.parse(stringifiedPage);
  const missingLinks = findMissingLinks(content);
  const { fields: enrichedContent } = enrichMissing(content, missingLinks);
  return enrichedContent;
};

const Router = ({ stringifiedPage, pageContext }) => {
  const enrichedContent = useMemo(() => {
    return parseAndEnrichPage(stringifiedPage);
  }, [stringifiedPage]);

  const {
    title,
    path,
    pageContent: content,
    metadata: { fields: metadata },
  } = enrichedContent;

  const pageContent = content.map(({ sys, fields }) => {
    const contentTypeId = sys?.contentType?.sys?.id;
    const __typename = getTypeName(contentTypeId);
    const resources = parseResources(fields);

    switch (contentTypeId) {
      case 'pageNavigation':
      case 'pageFooter':
        return {
          __typename,
          resources,
          pages: parsePagesRecursive(enrichedContent, fields.pages),
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
          pageContent,
        },
      }}
      pageContext={pageContext}
    />
  );
};

Router.propTypes = {
  stringifiedPage: PropTypes.string.isRequired,
  pageContext: shapes.pageContext.isRequired,
};

export default Router;
