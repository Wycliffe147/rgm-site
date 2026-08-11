export async function onRequestGet(context) {
  const { env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  try {
    const list = await db.prepare(`
      SELECT id, title, location, date_range, status 
      FROM crusades 
      ORDER BY status DESC, id DESC
    `).all();
    return Response.json(list.results || []);
  } catch (err) {
    console.error('Fetch portal crusades error:', err);
    return Response.json({ error: 'Failed to fetch crusades list' }, { status: 500 });
  }
}
