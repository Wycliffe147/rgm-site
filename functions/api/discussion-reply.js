// POST: Submit a reply to a discussion topic
export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });

  try {
    const { topic_id, name, message } = await request.json();
    if (!topic_id || !name?.trim() || !message?.trim()) {
      return Response.json({ error: 'topic_id, name, and message are required' }, { status: 400 });
    }

    // Verify topic exists
    const topic = await db.prepare('SELECT id FROM discussion_topics WHERE id = ?').bind(topic_id).first();
    if (!topic) return Response.json({ error: 'Topic not found' }, { status: 404 });

    const result = await db.prepare(`
      INSERT INTO discussion_replies (topic_id, name, message) VALUES (?, ?, ?)
    `).bind(topic_id, name.trim(), message.trim()).run();

    return Response.json({ success: true, id: result.meta.last_row_id });
  } catch (err) {
    console.error('Reply error:', err);
    return Response.json({ error: 'Failed to post reply' }, { status: 500 });
  }
}
