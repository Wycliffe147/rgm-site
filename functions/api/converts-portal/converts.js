export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  const url = new URL(request.url);
  const crusadeId = url.searchParams.get('crusade_id');
  const status = url.searchParams.get('follow_up_status');
  const search = url.searchParams.get('search');
  const dateFrom = url.searchParams.get('date_from');
  const dateTo = url.searchParams.get('date_to');
  const lastContactFrom = url.searchParams.get('last_contact_from');
  const lastContactTo = url.searchParams.get('last_contact_to');
  const hasPhone = url.searchParams.get('has_phone'); // 'yes' | 'no'
  const serviceDate = url.searchParams.get('service_date');
  const serviceName = url.searchParams.get('service_name');
  const ministeringName = url.searchParams.get('ministering_name');

  let query = `
    SELECT c.id, c.name, c.phone, c.church, c.follow_up_status, c.follow_up_notes,
           c.service_date, c.service_name, c.ministering_name,
           c.last_contact_date, c.created_at,
           cr.title AS crusade_title, cr.id AS crusade_id,
           a.full_name AS updated_by_name
    FROM converts c
    LEFT JOIN crusades cr ON c.crusade_id = cr.id
    LEFT JOIN portal_admins a ON c.updated_by = a.id
    WHERE 1=1
  `;
  const params = [];

  if (crusadeId) {
    query += ` AND c.crusade_id = ?`;
    params.push(parseInt(crusadeId, 10));
  }
  if (status) {
    query += ` AND c.follow_up_status = ?`;
    params.push(status);
  }
  if (search) {
    query += ` AND (c.name LIKE ? OR c.phone LIKE ? OR c.church LIKE ? OR c.follow_up_notes LIKE ?)`;
    const term = `%${search.trim()}%`;
    params.push(term, term, term, term);
  }
  if (dateFrom) {
    query += ` AND DATE(c.created_at) >= ?`;
    params.push(dateFrom);
  }
  if (dateTo) {
    query += ` AND DATE(c.created_at) <= ?`;
    params.push(dateTo);
  }
  if (lastContactFrom) {
    query += ` AND c.last_contact_date >= ?`;
    params.push(lastContactFrom);
  }
  if (lastContactTo) {
    query += ` AND c.last_contact_date <= ?`;
    params.push(lastContactTo);
  }
  if (hasPhone === 'yes') {
    query += ` AND c.phone IS NOT NULL AND c.phone != ''`;
  } else if (hasPhone === 'no') {
    query += ` AND (c.phone IS NULL OR c.phone = '')`;
  }
  if (serviceDate) {
    query += ` AND c.service_date = ?`;
    params.push(serviceDate);
  }
  if (serviceName) {
    query += ` AND c.service_name LIKE ?`;
    params.push(`%${serviceName.trim()}%`);
  }
  if (ministeringName) {
    query += ` AND c.ministering_name LIKE ?`;
    params.push(`%${ministeringName.trim()}%`);
  }

  query += ` ORDER BY c.created_at DESC`;

  try {
    const list = await db.prepare(query).bind(...params).all();
    return Response.json(list.results || []);
  } catch (err) {
    console.error('Fetch converts error:', err);
    return Response.json({ error: 'Failed to fetch converts list' }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { request, env, data } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  try {
    const { name, phone, church, crusade_id, follow_up_status, follow_up_notes,
            service_date, service_name, ministering_name } = await request.json();

    if (!name) {
      return Response.json({ error: 'Convert Name is required' }, { status: 400 });
    }

    const adminId = data.admin.id;
    const parsedCrusadeId = crusade_id ? parseInt(crusade_id, 10) : null;
    const cleanStatus = follow_up_status || 'pending';
    const cleanNotes = follow_up_notes || '';

    const result = await db.prepare(`
      INSERT INTO converts (name, phone, church, crusade_id, service_date, service_name, ministering_name,
                            follow_up_status, follow_up_notes, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      name.trim(),
      phone ? phone.trim() : null,
      church ? church.trim() : null,
      parsedCrusadeId,
      service_date || null,
      service_name ? service_name.trim() : null,
      ministering_name ? ministering_name.trim() : null,
      cleanStatus,
      cleanNotes,
      adminId
    ).run();

    return Response.json({ success: true, id: result.meta.last_row_id });
  } catch (err) {
    console.error('Add convert error:', err);
    return Response.json({ error: 'Failed to add convert' }, { status: 500 });
  }
}

export async function onRequestPut(context) {
  const { request, env, data } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  try {
    const { id, name, phone, church, crusade_id, follow_up_status, follow_up_notes, last_contact_date } = await request.json();

    if (!id || !name) {
      return Response.json({ error: 'Convert ID and Name are required' }, { status: 400 });
    }

    const adminId = data.admin.id; // From middleware
    const parsedCrusadeId = crusade_id ? parseInt(crusade_id, 10) : null;
    const cleanStatus = follow_up_status || 'pending';
    const cleanNotes = follow_up_notes || '';
    const cleanLastContact = last_contact_date || null;

    const result = await db.prepare(`
      UPDATE converts
      SET name = ?, phone = ?, church = ?, crusade_id = ?, follow_up_status = ?, follow_up_notes = ?, last_contact_date = ?, updated_by = ?
      WHERE id = ?
    `).bind(
      name.trim(),
      phone ? phone.trim() : null,
      church ? church.trim() : null,
      parsedCrusadeId,
      cleanStatus,
      cleanNotes,
      cleanLastContact,
      adminId,
      parseInt(id, 10)
    ).run();

    if (result.meta.changes === 0) {
      return Response.json({ error: 'Convert record not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Update convert error:', err);
    return Response.json({ error: 'Failed to update convert' }, { status: 500 });
  }
}

export async function onRequestDelete(context) {
  const { request, env, data } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  // Audits permissions — only Super Admins are allowed to delete converts
  if (data.admin.role !== 'super_admin') {
    return Response.json({ error: 'Forbidden: Only Super Admins can delete converts' }, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Missing convert ID parameter' }, { status: 400 });
    }

    const result = await db.prepare('DELETE FROM converts WHERE id = ?').bind(parseInt(id, 10)).run();

    if (result.meta.changes === 0) {
      return Response.json({ error: 'Convert record not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Delete convert error:', err);
    return Response.json({ error: 'Failed to delete convert' }, { status: 500 });
  }
}
