// Vercel serverless entry: imports the built Hono app and wraps as (req, res) handler.
process.env.VERCEL = '1';

let _app;
async function getApp() {
  if (!_app) {
    _app = (await import('../build/server/index.js')).default;
  }
  return _app;
}

export default async function handler(req, res) {
  try {
    const app = await getApp();
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const url = `${proto}://${host}${req.url}`;

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);

    const h = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v != null) h.set(k, Array.isArray(v) ? v.join(', ') : String(v));
    }

    const init = { method: req.method || 'GET', headers: h };
    if (body.byteLength && req.method !== 'GET' && req.method !== 'HEAD') init.body = body;

    const webRes = await app.fetch(new Request(url, init));
    res.statusCode = webRes.status;
    webRes.headers.forEach((v, k) => { if (k !== 'transfer-encoding') res.setHeader(k, v); });
    if (webRes.body) {
      for (const reader = webRes.body.getReader();;) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (err) {
    console.error('FATAL:', err && err.stack || err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('Server Error');
  }
}
