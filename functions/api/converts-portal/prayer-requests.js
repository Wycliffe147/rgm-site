export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const search = url.searchParams.get('search');

  let query = `
    SELECT id, name, phone, email, request_text, status, notes, created_at
    FROM prayer_requests
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }
  if (search) {
    query += ` AND (name LIKE ? OR phone LIKE ? OR email LIKE ? OR request_text LIKE ? OR notes LIKE ?)`;
    const term = `%${search.trim()}%`;
    params.push(term, term, term, term, term);
  }

  query += ` ORDER BY created_at DESC`;

  try {
    const list = await db.prepare(query).bind(...params).all();
    return Response.json(list.results || []);
  } catch (err) {
    console.error('Fetch prayer requests error:', err);
    return Response.json({ error: 'Failed to fetch prayer requests ledger' }, { status: 500 });
  }
}

export async function onRequestPut(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  try {
    const { id, status, notes } = await request.json();

    if (!id || !status) {
      return Response.json({ error: 'Prayer Request ID and Status are required' }, { status: 400 });
    }

    const cleanStatus = status.trim();
    const cleanNotes = notes ? notes.trim() : null;

    const result = await db.prepare(`
      UPDATE prayer_requests
      SET status = ?, notes = ?
      WHERE id = ?
    `).bind(
      cleanStatus,
      cleanNotes,
      parseInt(id, 10)
    ).run();

    if (result.meta.changes === 0) {
      return Response.json({ error: 'Prayer request record not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Update prayer request error:', err);
    return Response.json({ error: 'Failed to update prayer request status' }, { status: 500 });
  }
}

export async function onRequestDelete(context) {
  const { request, env, data } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  // Only Super Admins can delete prayer requests
  if (data.admin.role !== 'super_admin') {
    return Response.json({ error: 'Forbidden: Only Super Admins can delete prayer records' }, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Missing prayer request ID parameter' }, { status: 400 });
    }

    const result = await db.prepare('DELETE FROM prayer_requests WHERE id = ?').bind(parseInt(id, 10)).run();

    if (result.meta.changes === 0) {
      return Response.json({ error: 'Prayer request not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Delete prayer request error:', err);
    return Response.json({ error: 'Failed to delete prayer record' }, { status: 500 });
  }
}
