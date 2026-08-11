export async function onRequestGet(context) {
  const { request, env, data } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  // Restricts exports to Super Admins only
  if (data.admin.role !== 'super_admin') {
    return Response.json({ error: 'Forbidden: Only Super Admins can export database backups' }, { status: 403 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get('type'); // 'converts' or 'attendance'

  if (type !== 'converts' && type !== 'attendance') {
    return Response.json({ error: 'Invalid export type parameter. Must be converts or attendance.' }, { status: 400 });
  }

  function escapeCSV(val) {
    if (val === null || val === undefined) return '';
    let str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  try {
    let csvContent = '';
    let filename = '';

    if (type === 'converts') {
      filename = `rgm_converts_backup_${new Date().toISOString().split('T')[0]}.csv`;
      
      const headers = ['Record ID', 'Convert Name', 'Phone Number', 'Church/Denomination', 'Crusade Event', 'Follow-up Status', 'Last Contact Date', 'Follow-up Notes', 'Last Handled By', 'Added Date'];
      csvContent += headers.join(',') + '\r\n';

      const list = await db.prepare(`
        SELECT c.id, c.name, c.phone, c.church, cr.title AS crusade_title, c.follow_up_status, c.last_contact_date, c.follow_up_notes, a.full_name AS updated_by_name, c.created_at
        FROM converts c
        LEFT JOIN crusades cr ON c.crusade_id = cr.id
        LEFT JOIN portal_admins a ON c.updated_by = a.id
        ORDER BY c.created_at DESC
      `).all();

      (list.results || []).forEach(row => {
        const line = [
          row.id,
          escapeCSV(row.name),
          escapeCSV(row.phone),
          escapeCSV(row.church),
          escapeCSV(row.crusade_title || 'General Outreach'),
          escapeCSV(row.follow_up_status),
          escapeCSV(row.last_contact_date),
          escapeCSV(row.follow_up_notes),
          escapeCSV(row.updated_by_name || 'System / Seed'),
          escapeCSV(row.created_at)
        ];
        csvContent += line.join(',') + '\r\n';
      });

    } else {
      filename = `rgm_attendance_backup_${new Date().toISOString().split('T')[0]}.csv`;

      const headers = ['Record ID', 'Crusade Event', 'Service Date', 'Service Name', 'Preacher/Minister', 'Attendance Count', 'Authorized By', 'Logged At'];
      csvContent += headers.join(',') + '\r\n';

      const list = await db.prepare(`
        SELECT r.id, cr.title AS crusade_title, r.service_date, r.service_name, r.ministering_name, r.attendance_count, a.full_name AS authorized_by_name, r.created_at
        FROM attendance_register r
        LEFT JOIN crusades cr ON r.crusade_id = cr.id
        LEFT JOIN portal_admins a ON r.authorized_by = a.id
        ORDER BY r.service_date DESC, r.created_at DESC
      `).all();

      (list.results || []).forEach(row => {
        const line = [
          row.id,
          escapeCSV(row.crusade_title || 'General Outreach'),
          escapeCSV(row.service_date),
          escapeCSV(row.service_name),
          escapeCSV(row.ministering_name),
          row.attendance_count,
          escapeCSV(row.authorized_by_name || 'System / Seed'),
          escapeCSV(row.created_at)
        ];
        csvContent += line.join(',') + '\r\n';
      });
    }

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (err) {
    console.error('Export CSV error:', err);
    return Response.json({ error: 'Failed to generate CSV data export' }, { status: 500 });
  }
}
