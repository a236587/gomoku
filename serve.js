/*
 * 五子棋 · 局域网小服务器（零依赖，仅用 Node 内置模块）
 * 用法：双击「启动服务器.bat」，或在本目录执行  node serve.js
 * 它只做一件事：把本目录当作静态网站提供出去，方便手机用 IP 访问 index.html。
 * 游戏本体仍然只有 index.html 一个文件。
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = __dirname;
const START_PORT = 8000;
const MAX_TRIES = 20;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function lanAddresses() {
  const list = [];
  const ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach(function (name) {
    (ifaces[name] || []).forEach(function (info) {
      if (info.family === 'IPv4' && !info.internal) {
        list.push({ name: name, address: info.address });
      }
    });
  });
  return list;
}

const server = http.createServer(function (req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
    return;
  }

  let pathname = '/';
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }
  if (pathname === '/') pathname = '/index.html';

  const rel = path.normalize(pathname).replace(/^([/\\])+/, '');
  const filePath = path.join(ROOT, rel);
  if (filePath !== ROOT && filePath.indexOf(ROOT + path.sep) !== 0) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, function (err, stat) {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': 'no-cache'
    });
    if (req.method === 'HEAD') { res.end(); return; }
    fs.createReadStream(filePath).pipe(res);
  });
});

let port = START_PORT;
let tries = 0;

server.on('error', function (err) {
  if (err.code === 'EADDRINUSE' && tries < MAX_TRIES) {
    tries++;
    port++;
    console.log('Port busy, trying ' + port + ' ...');
    setTimeout(function () { server.listen(port, '0.0.0.0'); }, 120);
    return;
  }
  console.error('Server error: ' + err.message);
  process.exit(1);
});

server.listen(port, '0.0.0.0', function () {
  const lan = lanAddresses();
  console.log('');
  console.log('==============================================');
  console.log('  Gomoku server is running');
  console.log('  PC    : http://127.0.0.1:' + port + '/');
  if (lan.length) {
    lan.forEach(function (n) {
      console.log('  Phone : http://' + n.address + ':' + port + '/   [' + n.name + ']');
    });
  } else {
    console.log('  Phone : (no LAN IP found, check your WiFi)');
  }
  console.log('==============================================');
  console.log('  Keep this window open. Press Ctrl+C to stop.');
  console.log('');
});
