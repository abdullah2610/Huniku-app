/**
 * Vercel Serverless Handler
 * 
 * Bypasses createHonoServer() which tries to start a long-running HTTP server
 * via serve() — incompatible with Vercel serverless functions.
 * 
 * This manually wires the Hono app with React Router request handling
 * and exports a standard Vercel-compatible handler.
 */

// Set Vercel flag BEFORE any imports to guide conditional logic
process.env.VERCEL = '1';

// Now import the regular server entry — but intercept createHonoServer
import { createHonoServer } from 'react-router-hono-server/node';

// Override to prevent serve() call
const originalCreateHonoServer = createHonoServer;

// We'll import and call the actual index.ts but intercept the createHonoServer result
// Actually, let's just import build/server/index.js which exports the handler
import handler from '../build/server/index.js';

// The handler from build/server/index.js IS the Hono app (with patched serve)
// Vercel wraps it automatically via @vercel/node → just export it
export default handler;
