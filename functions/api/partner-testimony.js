// GET: Returns approved partner testimonies with optional limit/offset pagination
export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '9', 10), 50);
  const offset = Math.max(parseInt(url.searchParams.get('offset') || '0', 10), 0);

  try {
    const { results } = await db.prepare(`
      SELECT id, name, location, role, testimony, created_at
      FROM partner_testimonies
      WHERE approved = 1
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(limit + 1, offset).all();

    const hasMore = results.length > limit;
    const items = hasMore ? results.slice(0, limit) : results;

    return Response.json({ items: items || [], hasMore });
  } catch (err) {
    console.error('Fetch partner testimonies error:', err);
    return Response.json({ error: 'Failed to fetch testimonies' }, { status: 500 });
  }
}

// POST: Public testimony submission (pending review)
export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  try {
    const { name, location, role, testimony } = await request.json();

    if (!name || !testimony) {
      return Response.json({ error: 'Name and testimony are required' }, { status: 400 });
    }

    await db.prepare(`
      INSERT INTO partner_testimonies (name, location, role, testimony, approved)
      VALUES (?, ?, ?, ?, 0)
    `).bind(
      name.trim(),
      location ? location.trim() : null,
      role ? role.trim() : null,
      testimony.trim()
    ).run();

    return Response.json({ success: true });
  } catch (err) {
    console.error('Submit partner testimony error:', err);
    return Response.json({ error: 'Failed to submit testimony' }, { status: 500 });
  }
}
