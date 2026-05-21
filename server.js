'use strict';

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const PORT = Number(process.env.PORT || 3000);
const ROOT = path.resolve(__dirname);

const LEGACY_ALIASES = new Map([
  ['/header-banner.jpg', '/assets/images/header-banner.jpg'],
  ['/home-logo.jpg', '/assets/images/home-logo.jpg'],
]);

const MIME = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.mp3', 'audio/mpeg'],
]);

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  });
  res.end(body);
}

function resolvePublicPath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split('?')[0] || '/');
  const aliasedPath = LEGACY_ALIASES.get(decodedPath) || decodedPath;
  const normalizedPath = aliasedPath === '/' ? '/index.html' : aliasedPath;
  const safePath = path.normalize(normalizedPath).replace(/^([/\\])+/, '');
  const absolutePath = path.resolve(ROOT, safePath);

  if (!absolutePath.startsWith(ROOT + path.sep) && absolutePath !== ROOT) {
    return null;
  }
  return absolutePath;
}

async function fileExists(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

async function handler(req, res) {
  if (!['GET', 'HEAD'].includes(req.method)) {
    return send(res, 405, 'Method Not Allowed', { Allow: 'GET, HEAD' });
  }

  let filePath;
  try {
    filePath = resolvePublicPath(req.url || '/');
  } catch {
    return send(res, 400, 'Bad Request');
  }

  if (!filePath) return send(res, 403, 'Forbidden');

  const hasExtension = path.extname(filePath) !== '';
  const requestedPath = (await fileExists(filePath))
    ? filePath
    : (!hasExtension ? path.join(ROOT, 'index.html') : null);

  if (!requestedPath) return send(res, 404, 'Not Found');

  const ext = path.extname(requestedPath);
  const contentType = MIME.get(ext) || 'application/octet-stream';
  const isHtml = ext === '.html';
  const cacheControl = isHtml
    ? 'no-cache'
    : 'public, max-age=31536000, immutable';

  try {
    const data = req.method === 'HEAD' ? null : await fs.readFile(requestedPath);
    send(res, 200, data, {
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
    });
  } catch (error) {
    console.error('[server] failed to serve file:', error);
    send(res, 500, 'Internal Server Error');
  }
}

const server = http.createServer(handler);

server.listen(PORT, () => {
  console.log(`虎子的小鹿社已启动：http://localhost:${PORT}`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));