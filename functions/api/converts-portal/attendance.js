export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  const url = new URL(request.url);
  const crusadeId = url.searchParams.get('crusade_id');

  let query = `
    SELECT r.id, r.service_date, r.service_name, r.ministering_name, r.attendance_count, r.created_at,
           cr.title AS crusade_title, cr.id AS crusade_id,
           a.full_name AS authorized_by_name
    FROM attendance_register r
    LEFT JOIN crusades cr ON r.crusade_id = cr.id
    LEFT JOIN portal_admins a ON r.authorized_by = a.id
    WHERE 1=1
  `;
  const params = [];

  if (crusadeId) {
    query += ` AND r.crusade_id = ?`;
    params.push(parseInt(crusadeId, 10));
  }

  query += ` ORDER BY r.service_date DESC, r.created_at DESC`;

  try {
    const list = await db.prepare(query).bind(...params).all();
    return Response.json(list.results || []);
  } catch (err) {
    console.error('Fetch attendance error:', err);
    return Response.json({ error: 'Failed to fetch attendance register' }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { request, env, data } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  try {
    const { crusade_id, service_date, service_name, ministering_name, attendance_count } = await request.json();

    if (!service_date || !service_name || !ministering_name || attendance_count == null) {
      return Response.json({ error: 'Missing required attendance fields' }, { status: 400 });
    }

    const adminId = data.admin.id; // From middleware
    const parsedCrusadeId = crusade_id ? parseInt(crusade_id, 10) : null;
    const parsedCount = parseInt(attendance_count, 10);

    if (isNaN(parsedCount) || parsedCount < 0) {
      return Response.json({ error: 'Attendance Count must be a positive number' }, { status: 400 });
    }

    const result = await db.prepare(`
      INSERT INTO attendance_register (crusade_id, service_date, service_name, ministering_name, attendance_count, authorized_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      parsedCrusadeId,
      service_date.trim(),
      service_name.trim(),
      ministering_name.trim(),
      parsedCount,
      adminId
    ).run();

    return Response.json({ success: true, id: result.meta.last_row_id });
  } catch (err) {
    console.error('Add attendance error:', err);
    return Response.json({ error: 'Failed to add attendance record' }, { status: 500 });
  }
}

export async function onRequestPut(context) {
  const { request, env, data } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  try {
    const { id, crusade_id, service_date, service_name, ministering_name, attendance_count } = await request.json();

    if (!id) {
      return Response.json({ error: 'Missing register ID' }, { status: 400 });
    }

    if (!service_date || !service_name || !ministering_name || attendance_count == null) {
      return Response.json({ error: 'Missing required attendance fields' }, { status: 400 });
    }

    const parsedCrusadeId = crusade_id ? parseInt(crusade_id, 10) : null;
    const parsedCount = parseInt(attendance_count, 10);

    if (isNaN(parsedCount) || parsedCount < 0) {
      return Response.json({ error: 'Attendance Count must be a positive number' }, { status: 400 });
    }

    const result = await db.prepare(`
      UPDATE attendance_register
      SET crusade_id = ?, service_date = ?, service_name = ?, ministering_name = ?, attendance_count = ?
      WHERE id = ?
    `).bind(
      parsedCrusadeId,
      service_date.trim(),
      service_name.trim(),
      ministering_name.trim(),
      parsedCount,
      parseInt(id, 10)
    ).run();

    if (result.meta.changes === 0) {
      return Response.json({ error: 'Record not found or no changes made' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Update attendance error:', err);
    return Response.json({ error: 'Failed to update attendance record' }, { status: 500 });
  }
}

export async function onRequestDelete(context) {

  const { request, env, data } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  // Authorize permissions — only Super Admins can delete registers
  if (data.admin.role !== 'super_admin') {
    return Response.json({ error: 'Forbidden: Only Super Admins can delete attendance records' }, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Missing register ID parameter' }, { status: 400 });
    }

    const result = await db.prepare('DELETE FROM attendance_register WHERE id = ?').bind(parseInt(id, 10)).run();

    if (result.meta.changes === 0) {
      return Response.json({ error: 'Record not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Delete attendance error:', err);
    return Response.json({ error: 'Failed to delete attendance record' }, { status: 500 });
  }
}
