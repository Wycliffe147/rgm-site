export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Handle preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Bypass authentication for the login endpoint
  if (url.pathname === '/api/converts-portal/login') {
    return await context.next();
  }

  // Retrieve Authorization Header
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return Response.json({ error: 'Unauthorized: Missing or invalid token format' }, { status: 401 });
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    return Response.json({ error: 'Unauthorized: Empty token' }, { status: 401 });
  }

  const db = env.DB;
  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  try {
    const currentEpoch = Math.floor(Date.now() / 1000);
    const session = await db.prepare(`
      SELECT s.token, s.expires_at, a.id, a.username, a.full_name, a.role
      FROM portal_sessions s
      JOIN portal_admins a ON s.admin_id = a.id
      WHERE s.token = ?
    `).bind(token).first();

    if (!session) {
      return Response.json({ error: 'Unauthorized: Invalid session token' }, { status: 401 });
    }

    if (session.expires_at < currentEpoch) {
      // Clean up expired session in background
      context.waitUntil(db.prepare('DELETE FROM portal_sessions WHERE token = ?').bind(token).run());
      return Response.json({ error: 'Unauthorized: Session expired. Please log in again.' }, { status: 401 });
    }

    // Attach admin details to data context for use in downstream endpoints
    context.data.admin = {
      id: session.id,
      username: session.username,
      full_name: session.full_name,
      role: session.role
    };

    return await context.next();
  } catch (err) {
    console.error('Middleware auth error:', err);
    return Response.json({ error: 'Internal Server Error during auth check' }, { status: 500 });
  }
}
