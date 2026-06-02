/**
 * Post-build patch for Vercel serverless compatibility.
 * react-router-hono-server's createHonoServer calls serve() from @hono/node-server
 * which tries to bind a TCP port — this crashes on Vercel serverless (FUNCTION_INVOCATION_FAILED).
 *
 * This script patches build/server/index.js to:
 *   - comment out the serve() call
 *   - remove the PRODUCTION guard so the handler path is always taken
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// __dirname is scripts/ — go up one level to project root
const projectRoot = join(__dirname, '..');
const serverPath = join(projectRoot, 'build', 'server', 'index.js');

let code = readFileSync(serverPath, 'utf-8');

// Check if this is a Vercel build (has serve() call from react-router-hono-server)
const hasServePattern = /const server = serve\(\s*\{/;
if (!hasServePattern.test(code)) {
  console.log('[patch-serverless] No serve() call found — skipping.');
  process.exit(0);
}

// Strategy: wrap the PRODUCTION serve() block in a condition check.
// If process.env.VERCEL is set, skip serve() and return the app directly.
// Otherwise, run serve() as normal.

// Replace the pattern:
//   if (PRODUCTION) {
//     const server = serve({...});
//     ...
//   } else if (globalThis.__viteDevServer...
//
// With:
//   if (PRODUCTION && !process.env.VERCEL) {
//     const server = serve({...});
//     ...
//   } else if (globalThis.__viteDevServer...

const before = code;
code = code.replace(
  /if \(PRODUCTION\) \{\s+const server = serve\(\s*\{/,
  'if (PRODUCTION && !process.env.VERCEL) {\n    const server = serve({'
);

if (code === before) {
  // Try alternative pattern match
  console.log('[patch-serverless] First pattern failed — trying alt pattern.');
  code = code.replace(
    /if \(PRODUCTION\) \{\s+const server = serve\(/,
    'if (PRODUCTION && !process.env.VERCEL) {\n    const server = serve('
  );
}

if (code !== before) {
  writeFileSync(serverPath, code, 'utf-8');
  console.log('[patch-serverless] ✅ Patched serve() to skip on Vercel.');
} else {
  console.log('[patch-serverless] ⚠️ Could not find serve() pattern to patch.');
  console.log('[patch-serverless] First 2000 chars:', code.substring(0, 2000));
  process.exit(1);
}
