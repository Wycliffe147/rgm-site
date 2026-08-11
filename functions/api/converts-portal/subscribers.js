// Admin-only newsletter subscribers management API (protected by _middleware.js)

// GET: Fetch all subscribers
export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Database unavailable' }, { status: 500 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get('status');

  try {
    let query = `SELECT * FROM newsletter_subscribers`;
    const params = [];

    if (status) {
      query += ` WHERE status = ?`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC`;

    const { results } = params.length
      ? await db.prepare(query).bind(...params).all()
      : await db.prepare(query).all();

    return Response.json(results || []);
  } catch (err) {
    console.error('Subscribers GET error:', err);
    return Response.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

// PUT: Toggle subscription status
export async function onRequestPut(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Database unavailable' }, { status: 500 });
  }

  try {
    const { id, status } = await request.json();

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }

    const validStatuses = ['subscribed', 'unsubscribed'];
    if (!status || !validStatuses.includes(status)) {
      return Response.json({ error: 'Valid status required: subscribed, unsubscribed' }, { status: 400 });
    }

    await db.prepare(`
      UPDATE newsletter_subscribers SET status = ? WHERE id = ?
    `).bind(status, id).run();

    return Response.json({ success: true });
  } catch (err) {
    console.error('Subscribers PUT error:', err);
    return Response.json({ error: 'Failed to update subscriber' }, { status: 500 });
  }
}

// DELETE: Delete subscriber record (super_admin only)
export async function onRequestDelete(context) {
  const { request, env } = context;
  const db = env.DB;
  const admin = context.data?.admin;

  if (!db) {
    return Response.json({ error: 'Database unavailable' }, { status: 500 });
  }

  if (!admin || admin.role !== 'super_admin') {
    return Response.json({ error: 'Only super_admin can delete subscribers' }, { status: 403 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return Response.json({ error: 'id parameter is required' }, { status: 400 });
  }

  try {
    await db.prepare(`DELETE FROM newsletter_subscribers WHERE id = ?`).bind(id).run();
    return Response.json({ success: true });
  } catch (err) {
    console.error('Subscribers DELETE error:', err);
    return Response.json({ error: 'Failed to delete subscriber' }, { status: 500 });
  }
}
