// POST: Toggle a reaction on a topic
export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });

  try {
    const { topic_id, emoji } = await request.json();
    const validEmojis = ['pray', 'heart', 'amen'];
    if (!topic_id || !validEmojis.includes(emoji)) {
      return Response.json({ error: 'Invalid topic_id or emoji' }, { status: 400 });
    }

    // Use IP hash to identify unique reactors (privacy-friendly)
    const ip = context.request?.headers?.get('CF-Connecting-IP') || 
                request.headers?.get('CF-Connecting-IP') || 
                request.headers?.get('x-forwarded-for') || 'unknown';
    const ipHash = btoa(ip + topic_id + emoji).slice(0, 32);

    // Check if already reacted - toggle off if so
    const existing = await db.prepare(
      'SELECT id FROM discussion_reactions WHERE topic_id = ? AND emoji = ? AND ip_hash = ?'
    ).bind(topic_id, emoji, ipHash).first();

    if (existing) {
      await db.prepare('DELETE FROM discussion_reactions WHERE id = ?').bind(existing.id).run();
      return Response.json({ success: true, action: 'removed' });
    } else {
      await db.prepare(
        'INSERT INTO discussion_reactions (topic_id, emoji, ip_hash) VALUES (?, ?, ?)'
      ).bind(topic_id, emoji, ipHash).run();
      return Response.json({ success: true, action: 'added' });
    }
  } catch (err) {
    console.error('Reaction error:', err);
    return Response.json({ error: 'Failed to react' }, { status: 500 });
  }
}
