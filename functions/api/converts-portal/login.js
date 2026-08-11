export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json({ error: 'Missing username or password' }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();

    // Fetch user from DB
    const admin = await db.prepare('SELECT * FROM portal_admins WHERE username = ?')
      .bind(cleanUsername)
      .first();

    if (!admin) {
      return Response.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Compute SHA-256 hash of password
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const inputHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (inputHash !== admin.password_hash) {
      return Response.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Generate Session Token
    const sessionToken = crypto.randomUUID();
    const durationSeconds = 12 * 60 * 60; // 12 hours
    const expiresAt = Math.floor(Date.now() / 1000) + durationSeconds;

    // Save session to database
    await db.prepare('INSERT INTO portal_sessions (token, admin_id, expires_at) VALUES (?, ?, ?)')
      .bind(sessionToken, admin.id, expiresAt)
      .run();

    return Response.json({
      token: sessionToken,
      username: admin.username,
      full_name: admin.full_name,
      role: admin.role
    });

  } catch (err) {
    console.error('Login API error:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
