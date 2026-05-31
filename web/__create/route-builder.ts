import { Hono } from 'hono';
import type { Handler } from 'hono/types';

const API_BASENAME = '/api';
const api = new Hono();

// Static route discovery via Vite's import.meta.glob — works in dev and production.
// Replaces the filesystem scanner which breaks after bundling (paths shift).
const routeModules = import.meta.glob('../src/app/api/**/route.js', { eager: false });

function getHonoPath(moduleKey: string): { name: string; pattern: string }[] {
  // moduleKey example: '../src/app/api/properties/[id]/route.js'
  const apiPath = moduleKey.replace('../src/app/api', '').replace('/route.js', '');
  if (!apiPath) return [{ name: 'root', pattern: '' }];

  return apiPath
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      const match = segment.match(/^\[(\.{3})?([^\]]+)\]$/);
      if (match) {
        const [_, dots, param] = match;
        return dots === '...'
          ? { name: param!, pattern: `:${param}{.+}` }
          : { name: param!, pattern: `:${param}` };
      }
      return { name: segment, pattern: segment };
    });
}

async function registerRoutes() {
  api.routes = [];

  // Longer paths first so specific routes win over param routes
  const entries = Object.entries(routeModules).sort((a, b) => b[0].length - a[0].length);

  for (const [moduleKey, loader] of entries) {
    try {
      const route = (await loader()) as Record<string, unknown>;
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

      for (const method of methods) {
        if (typeof route[method] === 'function') {
          const parts = getHonoPath(moduleKey);
          const honoPath = `/${parts.map(({ pattern }) => pattern).join('/')}`;

          const handler: Handler = async (c) => {
            const params = c.req.param();
            // Re-import in dev for HMR; reuse cached module in production
            const mod = import.meta.env.DEV
              ? ((await (routeModules[moduleKey] as () => Promise<unknown>)()) as Record<string, unknown>)
              : route;
            return await (mod[method] as Function)(c.req.raw, { params });
          };

          const m = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch';
          api[m](honoPath, handler);
        }
      }
    } catch (error) {
      console.error(`Error registering route ${moduleKey}:`, error);
    }
  }
}

await registerRoutes();

// Hot reload route list in development
if (import.meta.env.DEV && import.meta.hot) {
  import.meta.hot.accept(() => {
    registerRoutes().catch(console.error);
  });
}

export { api, API_BASENAME };
