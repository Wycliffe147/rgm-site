// GET /api/discussions - list all topics with reply and reaction counts
// GET /api/discussions?id=X - single topic with its replies
export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const category = url.searchParams.get('category');

  try {
    if (id) {
      // Single topic + replies
      const topic = await db.prepare(`
        SELECT t.*,
          (SELECT COUNT(*) FROM discussion_replies WHERE topic_id = t.id) AS reply_count,
          (SELECT COUNT(*) FROM discussion_reactions WHERE topic_id = t.id AND emoji = 'pray') AS react_pray,
          (SELECT COUNT(*) FROM discussion_reactions WHERE topic_id = t.id AND emoji = 'heart') AS react_heart,
          (SELECT COUNT(*) FROM discussion_reactions WHERE topic_id = t.id AND emoji = 'amen') AS react_amen
        FROM discussion_topics t WHERE t.id = ?
      `).bind(id).first();

      if (!topic) return Response.json({ error: 'Not found' }, { status: 404 });

      const { results: replies } = await db.prepare(`
        SELECT * FROM discussion_replies WHERE topic_id = ? ORDER BY created_at ASC
      `).bind(id).all();

      return Response.json({ topic, replies: replies || [] });
    }

    // List all topics
    let query = `
      SELECT t.*,
        (SELECT COUNT(*) FROM discussion_replies WHERE topic_id = t.id) AS reply_count,
        (SELECT COUNT(*) FROM discussion_reactions WHERE topic_id = t.id AND emoji = 'pray') AS react_pray,
        (SELECT COUNT(*) FROM discussion_reactions WHERE topic_id = t.id AND emoji = 'heart') AS react_heart,
        (SELECT COUNT(*) FROM discussion_reactions WHERE topic_id = t.id AND emoji = 'amen') AS react_amen
      FROM discussion_topics t
    `;
    const params = [];
    if (category) {
      query += ` WHERE t.category = ?`;
      params.push(category);
    }
    query += ` ORDER BY t.pinned DESC, t.created_at DESC`;

    const { results } = params.length
      ? await db.prepare(query).bind(...params).all()
      : await db.prepare(query).all();

    return Response.json(results || []);
  } catch (err) {
    console.error('Discussions GET error:', err);
    return Response.json({ error: 'Failed to load discussions' }, { status: 500 });
  }
}
