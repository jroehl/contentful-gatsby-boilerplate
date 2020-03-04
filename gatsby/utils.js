const { resolve } = require('path');
const { mkdirSync, existsSync, writeFileSync } = require('fs');
const slg = require('slug');

const sanitizePath = path =>
  ['', ...path.split('/').filter(Boolean), ''].join('/');

const removeHyphens = ({ code }) => code.replace(/-/g, '');

const slug = string => {
  return slg(string, {
    lower: true, // lowercase everything
    charmap: {
      ä: 'ae',
      ü: 'ue',
      ö: 'oe',
      ß: 'ss',
      Ä: 'Ae',
      Ü: 'Ue',
      Ö: 'Oe',
    },
  });
};

class Logger {
  static log(...args) {
    console.log(...args);
  }
  static warn(...args) {
    console.warn(...args);
  }
  static info(...args) {
    console.info(...args);
  }
  static error(...args) {
    console.error(...args);
  }
}

const getPublicDirIfNotExists = () => {
  const dir = resolve(__dirname, '..', 'public');
  if (!existsSync(dir)) mkdirSync(dir);
  return dir;
};

const writeRobots = env => {
  const publicDir = getPublicDirIfNotExists();

  const isProduction = env === 'production';
  const robots = isProduction
    ? 'User-agent: *\nAllow: /'
    : 'User-agent: *\nDisallow: /';

  Logger.log(`Writing "${env}" public/robots.txt`);

  writeFileSync(resolve(publicDir, 'robots.txt'), robots);
};

const getDefaultPath = (defaultPrefix, path) => {
  const sanitizedPath = sanitizePath(path);
  const sanitizedPrefix = `/${defaultPrefix}/`;
  if (defaultPrefix && sanitizedPath.includes(sanitizedPrefix)) {
    return sanitizePath(sanitizedPath.replace(sanitizedPrefix, ''));
  }
};

class SitemapParser {
  constructor(domain) {
    this.urls = [];
    this.domain = domain.endsWith('/') ? domain : domain.slice(0, -1);
    this.publicDir = getPublicDirIfNotExists();
  }

  getAlternates({ locale, locales }) {
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
      .map(url => {
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
      `Writing public/sitemap.xml with ${length} URL${length > 1 ? 's' : ''}`
    );

    return [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
      `${this.parseURLsToXML()}`,
      '</urlset>',
    ].join('\n');
  }

  writeSitemap() {
    writeFileSync(resolve(this.publicDir, 'sitemap.xml'), this.toXML());
  }
}

module.exports = {
  Logger,
  slug,
  sanitizePath,
  getPublicDirIfNotExists,
  getDefaultPath,
  writeRobots,
  removeHyphens,
  SitemapParser,
};
