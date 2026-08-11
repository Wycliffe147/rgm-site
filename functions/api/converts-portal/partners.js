// Admin-only partner management API (protected by _middleware.js)

// GET: Fetch partner registrations or testimonies
export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Database unavailable' }, { status: 500 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get('type'); // 'registrations' or 'testimonies'
  const status = url.searchParams.get('status'); // optional filter for registrations

  try {
    if (type === 'registrations') {
      let query = `SELECT * FROM partner_registrations`;
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

    } else if (type === 'testimonies') {
      const { results } = await db.prepare(`
        SELECT * FROM partner_testimonies ORDER BY created_at DESC
      `).all();

      return Response.json(results || []);

    } else {
      return Response.json({ error: 'type parameter required: registrations or testimonies' }, { status: 400 });
    }
  } catch (err) {
    console.error('Partners GET error:', err);
    return Response.json({ error: 'Failed to fetch partner data' }, { status: 500 });
  }
}

// PUT: Update registration status OR approve/reject testimony
export async function onRequestPut(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Database unavailable' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { type, id } = body;

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }

    if (type === 'registration') {
      const { status } = body;
      const validStatuses = ['new', 'contacted', 'active'];
      if (!status || !validStatuses.includes(status)) {
        return Response.json({ error: 'Valid status required: new, contacted, active' }, { status: 400 });
      }

      await db.prepare(`
        UPDATE partner_registrations SET status = ? WHERE id = ?
      `).bind(status, id).run();

      return Response.json({ success: true });

    } else if (type === 'testimony') {
      const { approved } = body;
      if (approved === undefined) {
        return Response.json({ error: 'approved field is required' }, { status: 400 });
      }

      await db.prepare(`
        UPDATE partner_testimonies SET approved = ? WHERE id = ?
      `).bind(approved ? 1 : 0, id).run();

      return Response.json({ success: true });

    } else {
      return Response.json({ error: 'type must be registration or testimony' }, { status: 400 });
    }
  } catch (err) {
    console.error('Partners PUT error:', err);
    return Response.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

// DELETE: Delete a partner registration or testimony (super_admin only)
export async function onRequestDelete(context) {
  const { request, env } = context;
  const db = env.DB;
  const admin = context.data?.admin;

  if (!db) {
    return Response.json({ error: 'Database unavailable' }, { status: 500 });
  }

  if (!admin || admin.role !== 'super_admin') {
    return Response.json({ error: 'Only super_admin can delete partner records' }, { status: 403 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const type = url.searchParams.get('type'); // 'registration' or 'testimony'

  if (!id || !type) {
    return Response.json({ error: 'id and type parameters are required' }, { status: 400 });
  }

  try {
    if (type === 'registration') {
      await db.prepare(`DELETE FROM partner_registrations WHERE id = ?`).bind(id).run();
    } else if (type === 'testimony') {
      await db.prepare(`DELETE FROM partner_testimonies WHERE id = ?`).bind(id).run();
    } else {
      return Response.json({ error: 'type must be registration or testimony' }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Partners DELETE error:', err);
    return Response.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
