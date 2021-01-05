import {
  ContentfulRichTextGatsbyReference,
  RenderRichTextData,
} from 'gatsby-source-contentful/rich-text';

export interface Metadata {
  title: string;
  description: string;
}

export type Env = 'production' | 'development' | 'preview';

export interface SiteMetaData {
  env: Env;
  domain: string;
  redirectDefaultPrefix: string;
}

export interface Location {
  pathname: string;
}

export interface Config extends SiteMetaData {
  locale: string;
  location: Location;
  contentful_id: string;
}

export interface Resource {
  key: string;
  value: Content;
}

export interface Page {
  contentful_id: string;
  title: string;
  node_locale: string;
}

export interface PageContent extends Page {
  metadata: Metadata;
  content: Content;
  resources?: Array<Resource>;
}

export interface PageRoute extends Page {
  showInNavigation: boolean;
  showInFooter: boolean;
  path: string;
  childPages?: Array<PageRoute>;
}

export interface PageTree {
  [key: string]: {
    [locale: string]: {
      showInNavigation: boolean;
      showInFooter: boolean;
      path: string;
      title: string;
      childPages: PageTree | Record<string, never>;
    };
  };
}

export type Content = RenderRichTextData<ContentfulRichTextGatsbyReference>;
