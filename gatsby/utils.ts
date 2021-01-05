import toCamelCase from 'lodash/camelcase';
import { resolve } from 'path';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import dotenv from 'dotenv';

const CF_PREFIX = 'CONTENTFUL_';

export const appendWriteFileSync = (path: string, content: string) => {
  const exists = existsSync(path);
  let enrichedContent = '';
  if (exists) {
    const existingContent = readFileSync(path, 'utf-8');
    enrichedContent += `${existingContent}\n`;
  }
  enrichedContent += `${content}\n`;
  writeFileSync(path, enrichedContent);
};

export const getPublicDirIfNotExists = () => {
  const dir = resolve(__dirname, '..', 'public');
  if (!existsSync(dir)) mkdirSync(dir);
  return dir;
};

export class RedirectParser {
  private redirects: {
    from: string;
    to: string;
    query: string;
    status: number;
    force: '!' | '';
    trailing: string;
  }[];
  private publicDir: string;

  constructor(private fileName = '_redirects') {
    this.redirects = [];
    this.publicDir = getPublicDirIfNotExists();
  }

  parseQuery(query?: Array<unknown> | Record<string, unknown>): string {
    if (!query) return '';
    if (Array.isArray(query)) {
      return query.map((key) => `${key}=:${key}`).join(' ');
    }
    return Object.entries(query)
      .map(([key, value]) => `${key}=${value || `:${key}`}`)
      .join(' ');
  }

  addRedirect(
    redirect: {
      from?: string;
      fromPath?: string;
      to?: string;
      toPath?: string;
      isPermanent?: boolean;
      status?: number;
      statusCode?: number;
      force?: boolean;
      query?: Array<unknown> | Record<string, unknown>;
      trailing?: string;
    } = {}
  ) {
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

export const writeRobots = (env: 'production' | 'development') => {
  const publicDir = getPublicDirIfNotExists();
  const isProduction = env === 'production';
  const robots = isProduction
    ? 'User-agent: *\nAllow: /'
    : 'User-agent: *\nDisallow: /';
  Logger.log(`Writing "${env}" robots file to public/robots.txt`);
  writeFileSync(resolve(publicDir, 'robots.txt'), `${robots}\n`);
};

class Logger {
  static log(...args: Array<unknown>) {
    console.log(...args);
  }
  static warn(...args: Array<unknown>) {
    console.warn(...args);
  }
  static info(...args: Array<unknown>) {
    console.info(...args);
  }
  static error(...args: Array<unknown>) {
    console.error(...args);
  }
}

export const getBuildEnvironment = () => {
  dotenv.config();
  const {
    NODE_ENV = 'development',
    BUILD_ENV,
    URL,
    REDIRECT_DEFAULT_PREFIX,
  } = process.env;

  return {
    env: BUILD_ENV || NODE_ENV,
    domain: URL,
    redirectDefaultPrefix: REDIRECT_DEFAULT_PREFIX,
  };
};

const defaults: Record<string, string> = {
  environment: 'master',
  host: 'cdn.contentful.com',
};

export const getContentfulEnvironment = () => {
  dotenv.config();
  const config = Object.entries(process.env).reduce((acc, [key, value]) => {
    if (!key.match(new RegExp(`^${CF_PREFIX}.*`))) return acc;
    const sanitizedKey = toCamelCase(key.replace(CF_PREFIX, ''));
    const sanitizedValue: string | undefined = value ?? defaults[sanitizedKey];

    return {
      ...acc,
      [sanitizedKey]: sanitizedValue,
    };
  }, defaults);
  return config;
};
