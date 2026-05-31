import { getToken } from '@auth/core/jwt';

// Safe origin for postMessage — must match the Expo app origin
const ALLOWED_ORIGIN = process.env.AUTH_URL || process.env.EXPO_PUBLIC_APP_URL || '';

// Escape JSON for safe embedding inside a <script> tag
// Uses split/join to avoid regex with literal Unicode line terminators
function safeJsonScript(obj) {
	const LS = String.fromCharCode(0x2028);
	const PS = String.fromCharCode(0x2029);
	return JSON.stringify(obj)
		.split('<').join('\\u003c')
		.split('>').join('\\u003e')
		.split(LS).join('\\u2028')
		.split(PS).join('\\u2029');
}

export async function GET(request) {
	const isSecure = process.env.AUTH_URL?.startsWith('https') ?? request.url?.startsWith('https') ?? false;
	const [token, jwt] = await Promise.all([
		getToken({
			req: request,
			secret: process.env.AUTH_SECRET,
			secureCookie: isSecure,
			raw: true,
		}),
		getToken({
			req: request,
			secret: process.env.AUTH_SECRET,
			secureCookie: isSecure,
		}),
	]);

	const securityHeaders = {
		'Content-Type': 'text/html',
		'X-Frame-Options': 'SAMEORIGIN',
		'Content-Security-Policy': `frame-ancestors ${ALLOWED_ORIGIN || "'self'"}`,
	};

	if (!jwt) {
		const errPayload = safeJsonScript({ type: 'AUTH_ERROR', error: 'Unauthorized' });
		return new Response(
			`<html><body><script>window.parent.postMessage(${errPayload}, ${JSON.stringify(ALLOWED_ORIGIN || '*')});</script></body></html>`,
			{ status: 401, headers: securityHeaders }
		);
	}

	const message = {
		type: 'AUTH_SUCCESS',
		jwt: token,
		user: {
			id: jwt.sub,
			email: jwt.email,
			name: jwt.name,
		},
	};

	const payload = safeJsonScript(message);
	return new Response(
		`<html><body><script>window.parent.postMessage(${payload}, ${JSON.stringify(ALLOWED_ORIGIN || '*')});</script></body></html>`,
		{ headers: securityHeaders }
	);
}
