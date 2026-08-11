// GET: List all topics (with counts)
export async function onRequestGet(context) {
  const { env } = context;
  const db = env.DB;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });
  try {
    const { results } = await db.prepare(`
      SELECT t.*,
        (SELECT COUNT(*) FROM discussion_replies WHERE topic_id = t.id) AS reply_count
      FROM discussion_topics t ORDER BY t.pinned DESC, t.created_at DESC
    `).all();
    return Response.json(results || []);
  } catch (err) {
    return Response.json({ error: 'Failed to load' }, { status: 500 });
  }
}

// POST: Create new topic
export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  const admin = context.data?.admin;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });
  try {
    const { title, body, category, pinned } = await request.json();
    if (!title?.trim() || !body?.trim()) {
      return Response.json({ error: 'Title and body are required' }, { status: 400 });
    }
    const validCategories = ['bible-study', 'prayer', 'testimony', 'general'];
    const cat = validCategories.includes(category) ? category : 'general';
    const createdBy = admin?.full_name || admin?.username || 'Admin';
    const result = await db.prepare(`
      INSERT INTO discussion_topics (title, body, category, pinned, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).bind(title.trim(), body.trim(), cat, pinned ? 1 : 0, createdBy).run();
    return Response.json({ success: true, id: result.meta.last_row_id });
  } catch (err) {
    return Response.json({ error: 'Failed to create topic' }, { status: 500 });
  }
}

// PUT: Update topic (pin/unpin, edit)
export async function onRequestPut(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });
  try {
    const { id, title, body, category, pinned } = await request.json();
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });
    const validCategories = ['bible-study', 'prayer', 'testimony', 'general'];
    const cat = validCategories.includes(category) ? category : 'general';
    await db.prepare(`
      UPDATE discussion_topics SET title = ?, body = ?, category = ?, pinned = ? WHERE id = ?
    `).bind(title?.trim(), body?.trim(), cat, pinned ? 1 : 0, id).run();
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// DELETE: Delete topic or reply (super_admin only)
export async function onRequestDelete(context) {
  const { request, env } = context;
  const db = env.DB;
  const admin = context.data?.admin;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });
  if (!admin || admin.role !== 'super_admin') {
    return Response.json({ error: 'Only super_admin can delete' }, { status: 403 });
  }
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const type = url.searchParams.get('type') || 'topic';
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  try {
    if (type === 'reply') {
      await db.prepare('DELETE FROM discussion_replies WHERE id = ?').bind(id).run();
    } else {
      await db.prepare('DELETE FROM discussion_topics WHERE id = ?').bind(id).run();
    }
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
