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
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const validPassword = env.ADMIN_PASSWORD || 'rgm2026';

  if (!token || token !== validPassword) {
    return Response.json({ error: 'Unauthorized: Invalid Admin Password' }, { status: 401 });
  }

  return await context.next();
}
