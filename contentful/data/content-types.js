const resourceField = {
  id: 'resources',
  name: 'Resources',
  type: 'Array',
  localized: false,
  required: false,
  validations: [],
  disabled: false,
  omitted: false,
  items: {
    type: 'Link',
    validations: [
      {
        linkContentType: ['resource'],
      },
    ],
    linkType: 'Entry',
  },
};

const identifierField = {
  id: 'identifier',
  name: 'Identifier',
  type: 'Symbol',
  localized: false,
  required: true,
  validations: [
    {
      unique: true,
    },
  ],
  disabled: false,
  omitted: false,
};

const navigationAndFooterFields = [
  identifierField,
  {
    id: 'pages',
    name: 'Pages',
    type: 'Array',
    localized: false,
    required: false,
    validations: [],
    disabled: false,
    omitted: false,
    items: {
      type: 'Link',
      validations: [
        {
          linkContentType: ['page'],
        },
      ],
      linkType: 'Entry',
    },
  },
  resourceField,
];

module.exports = {
  pageNavigation: {
    name: 'Page > Navigation',
    description: 'The navigation of a page',
    displayField: 'identifier',
    fields: navigationAndFooterFields,
  },
  pageContent: {
    name: 'Page > Content',
    description: 'A content block of a page',
    displayField: 'identifier',
    fields: [
      identifierField,
      {
        id: 'content',
        name: 'Content',
        type: 'RichText',
        localized: true,
        required: true,
        validations: [
          {
            nodes: {},
          },
        ],
        disabled: false,
        omitted: false,
      },
      resourceField,
    ],
  },
  pageFooter: {
    name: 'Page > Footer',
    description: 'The footer of a page',
    displayField: 'identifier',
    fields: navigationAndFooterFields,
  },
  resource: {
    name: 'Resource',
    description: 'A resource/microcopy',
    displayField: 'key',
    fields: [
      {
        id: 'key',
        name: 'Key',
        type: 'Symbol',
        localized: false,
        required: true,
        validations: [
          {
            unique: true,
          },
        ],
        disabled: false,
        omitted: false,
      },
      {
        id: 'value',
        name: 'Value',
        type: 'RichText',
        localized: true,
        required: true,
        validations: [
          {
            nodes: {},
          },
        ],
        disabled: false,
        omitted: false,
      },
    ],
  },
  page: {
    name: 'Page',
    description: 'A page',
    displayField: 'path',
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        localized: true,
        required: true,
        validations: [],
        disabled: false,
        omitted: false,
      },
      {
        id: 'path',
        name: 'Path',
        // description: 'The path to this specific page (used for navigation and footer)',
        type: 'Symbol',
        localized: true,
        required: true,
        validations: [
          {
            unique: true,
          },
          {
            regexp: {
              pattern:
                '^\\/((\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?)?$',
              flags: null,
            },
            message: 'Must be a valid (absolute) URL path.',
          },
        ],
        disabled: false,
        omitted: false,
      },
      {
        id: 'metadata',
        name: 'Metadata',
        // description: 'The metadata for SEO purposes',
        type: 'Link',
        localized: false,
        required: true,
        validations: [
          {
            linkContentType: ['pageMetadata'],
          },
        ],
        disabled: false,
        omitted: false,
        linkType: 'Entry',
      },
      {
        id: 'pageContent',
        name: 'Page content',
        // description: 'The page content as blocks',
        type: 'Array',
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false,
        items: {
          type: 'Link',
          validations: [
            {
              linkContentType: ['pageNavigation', 'pageFooter', 'pageContent'],
            },
          ],
          linkType: 'Entry',
        },
      },
      {
        id: 'childPages',
        name: 'Child pages',
        // description: 'The children of this page (used for navigation and footer)',
        type: 'Array',
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false,
        items: {
          type: 'Link',
          validations: [
            {
              linkContentType: ['page'],
            },
          ],
          linkType: 'Entry',
        },
      },
    ],
  },
  pageMetadata: {
    name: 'Page > Metadata',
    description: 'The metadata of a page',
    displayField: 'title',
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        localized: true,
        required: true,
        validations: [
          {
            size: {
              max: 90,
            },
            message:
              'The length of the metadata title should be below 90 characters.',
          },
        ],
        disabled: false,
        omitted: false,
      },
      {
        id: 'description',
        name: 'Description',
        type: 'Symbol',
        localized: true,
        required: true,
        validations: [
          {
            size: {
              max: 160,
              min: 50,
            },
            message:
              'The length of the metadata description should be between 50 and 160 characters.',
          },
        ],
        disabled: false,
        omitted: false,
      },
    ],
  },
};
