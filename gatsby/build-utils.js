const { resolve } = require('path');
const { writeFileSync, existsSync, mkdirSync, readFileSync } = require('fs');
const { Logger } = require('./utils');

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
