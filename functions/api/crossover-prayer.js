// POST: Submit a special crossover prayer request
export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });

  try {
    const { name, prayer_request } = await request.json();
    if (!name?.trim() || !prayer_request?.trim()) {
      return Response.json({ error: 'Name and prayer request are required' }, { status: 400 });
    }

    await db.prepare(`
      INSERT INTO crossover_prayers (name, prayer_request)
      VALUES (?, ?)
    `).bind(name.trim(), prayer_request.trim()).run();

    return Response.json({ success: true });
  } catch (err) {
    console.error('Crossover prayer error:', err);
    return Response.json({ error: 'Failed to submit prayer petition' }, { status: 500 });
  }
}
