export async function onRequest(context) {
  const { request, env } = context;

  // Handle preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const authHeader = request.headers.get('Authorization') || '';
  // Correct Basic Auth handling: decode base64 and split on ":"
  if (authHeader.startsWith('Basic ')) {
    const base64 = authHeader.replace('Basic ', '');
    const [, password] = atob(base64).split(':');
    const validPassword = env.ADMIN_PASSWORD || 'rgm2026';

    if (password !== validPassword) {
      return Response.json({ error: 'Unauthorized: Invalid Admin Password' }, { status: 401 });
    }
  } else {
    return Response.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, { status: 401 });
  }

  return await context.next();
}
