const { resolve } = require('path');
const { writeFileSync, existsSync, mkdirSync, readFileSync } = require('fs');
const { Logger, sanitizePath } = require('./utils');

const appendWriteFileSync = (path, content) => {
  const exists = existsSync(path);
  let enrichedContent = '';
  if (exists) {
    const existingContent = readFileSync(path, 'utf-8');
    enrichedContent += `${existingContent}\n`;
  }
  enrichedContent += `${content}\n`;
  writeFileSync(path, enrichedContent);
};

const getPublicDirIfNotExists = () => {
  const dir = resolve(__dirname, '..', 'public');
  if (!existsSync(dir)) mkdirSync(dir);
  return dir;
};

class SitemapParser {
  constructor(domain = 'http://localhost') {
    this.urls = [];
    this.domain = domain.endsWith('/') ? domain.slice(0, -1) : domain;
    this.publicDir = getPublicDirIfNotExists();
  }

  getAlternates({ locale } = {}) {
    if (!locale) return [];
    return Object.entries(locale.localizedPaths).reduce((red, [key, value]) => {
      const hreflang = key === 'default' ? `x-${key}` : key;
      const attributes = [
        'rel="alternate"',
        `hreflang="${hreflang}"`,
        `href="${this.buildURL(value)}"`,
      ].join(' ');
      return [...red, { tag: 'xhtml:link', attributes }];
    }, []);
  }

  buildURL(path) {
    const sanitizedPath = sanitizePath(path);
    return [this.domain, sanitizedPath].join('');
  }

  addURL(path, localization, additionals = []) {
    const result = [
      {
        tag: 'loc',
        children: this.buildURL(path),
      },
      {
        tag: 'lastMod',
        children: new Date().toJSON().slice(0, 10),
      },
      ...this.getAlternates(localization),
      ...additionals,
    ];

    this.urls = [...this.urls, result];
  }

  parseURLsToXML() {
    return this.urls
      .map((url) => {
        const parts = url
          .map(({ tag, children, attributes }) => {
            const attr = attributes ? ` ${attributes}` : '';

            return children
              ? `<${tag}${attr}>${children}</${tag}>`
              : `<${tag}${attr} />`;
          })
          .join('\n    ');
        return `  <url>\n    ${parts}\n  </url>`;
      })
      .join('\n');
  }

  toXML() {
    const { length } = this.urls;
    Logger.log(
      `Writing ${length} URL${length === 1 ? '' : 's'} to public/sitemap.xml`
    );

    return [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
      `${this.parseURLsToXML()}`,
      '</urlset>',
    ].join('\n');
  }

  writeSitemap() {
    writeFileSync(resolve(this.publicDir, 'sitemap.xml'), `${this.toXML()}\n`);
  }
}

class RedirectParser {
  constructor(fileName = '_redirects') {
    this.redirects = [];
    this.fileName = fileName;
    this.publicDir = getPublicDirIfNotExists();
  }

  parseQuery(query) {
    if (!query) return '';
    if (Array.isArray(query)) {
      return query.map((key) => `${key}=:${key}`).join(' ');
    }
    return Object.entries(query)
      .map(([key, value]) => `${key}=${value || `:${key}`}`)
      .join(' ');
  }

  addRedirect(redirect = {}) {
    const from = redirect.from || redirect.fromPath;
    const to = redirect.to || redirect.toPath;
    const status = redirect.isPermanent
      ? 301
      : redirect.status || redirect.statusCode || 301;
    const force = redirect.force ? '!' : '';
    const query = this.parseQuery(redirect.query);
    const trailing = redirect.trailing || '';
    if (from && to) {
      this.redirects = [
        ...this.redirects,
        { from, to, query, status, force, trailing },
      ];
    }
  }

  parseRedirects() {
    return this.redirects
      .map(
        ({ from, to, status, query, force, trailing }) =>
          `${from} ${query} ${to} ${status}${force} ${trailing}`
      )
      .join('\n');
  }

  writeRedirects() {
    const length = this.redirects.length;
    Logger.log(
      `Writing ${length} redirect${length === 1 ? '' : 's'} to public/${
        this.fileName
      }`
    );
    appendWriteFileSync(
      resolve(this.publicDir, this.fileName),
      this.parseRedirects()
    );
  }
}

const writeRobots = (env) => {
  const publicDir = getPublicDirIfNotExists();
  const isProduction = env === 'production';
  const robots = isProduction
    ? 'User-agent: *\nAllow: /'
    : 'User-agent: *\nDisallow: /';
  Logger.log(`Writing "${env}" robots file to public/robots.txt`);
  writeFileSync(resolve(publicDir, 'robots.txt'), `${robots}\n`);
};

module.exports = {
  writeRobots,
  SitemapParser,
  RedirectParser,
};
