// Admin Crusades API (GET, POST, PATCH, DELETE)
// Supports both legacy date_range and new structured dates

function formatDateDisplay(crusade) {
  // Generates display string from structured dates or falls back to date_range
  const { date_type, start_date, end_date, custom_dates, date_range } = crusade;
  
  if (date_type === 'legacy') return date_range;
  
  if (date_type === 'single' && start_date) {
    return new Date(start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  
  if (date_type === 'continuous' && start_date && end_date) {
    const start = new Date(start_date);
    const end = new Date(end_date);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  }
  
  if (date_type === 'separate' && custom_dates) {
    try {
      const dates = JSON.parse(custom_dates);
      return dates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).join(', ');
    } catch (e) {
      return date_range;
    }
  }
  
  return date_range || 'To Be Announced';
}

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT id, slug, title, location, date_range, start_date, end_date, custom_dates, date_type, status, poster_url, description, full_description, partner_churches, show_on_home
     FROM crusades ORDER BY id DESC`
  ).all();
  
  return Response.json(results.map(c => ({
    ...c,
    formatted_date: formatDateDisplay(c)
  })));
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const { slug, title, location, date_range, start_date, end_date, custom_dates, date_type, status, poster_url, description, full_description, partner_churches, show_on_home } = body;

    if (!slug || !title || !status) {
      return Response.json({ error: 'slug, title, and status are required' }, { status: 400 });
    }

    if (!date_type || !['legacy', 'single', 'continuous', 'separate'].includes(date_type)) {
      return Response.json({ error: 'Valid date_type required: legacy, single, continuous, or separate' }, { status: 400 });
    }

    const info = await env.DB.prepare(
      `INSERT INTO crusades (slug, title, location, date_range, start_date, end_date, custom_dates, date_type, status, poster_url, description, full_description, partner_churches, show_on_home)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      slug, title, location || null, date_range || null, start_date || null, end_date || null, custom_dates || null, date_type, status, poster_url || null, description || null, full_description || null, partner_churches || null, show_on_home ? 1 : 0
    ).run();

    return Response.json({ success: true, id: info.meta.last_row_id });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function onRequestPatch({ request, env }) {
  try {
    const body = await request.json();
    const { id, slug, title, location, date_range, start_date, end_date, custom_dates, date_type, status, poster_url, description, full_description, partner_churches, show_on_home } = body;

    if (!id || !slug || !title || !status) {
      return Response.json({ error: 'id, slug, title, and status are required' }, { status: 400 });
    }

    if (date_type && !['legacy', 'single', 'continuous', 'separate'].includes(date_type)) {
      return Response.json({ error: 'Valid date_type required: legacy, single, continuous, or separate' }, { status: 400 });
    }

    await env.DB.prepare(
      `UPDATE crusades
       SET slug = ?, title = ?, location = ?, date_range = ?, start_date = ?, end_date = ?, custom_dates = ?, date_type = ?, status = ?, poster_url = ?, description = ?, full_description = ?, partner_churches = ?, show_on_home = ?
       WHERE id = ?`
    ).bind(
      slug, title, location || null, date_range || null, start_date || null, end_date || null, custom_dates || null, date_type || 'legacy', status, poster_url || null, description || null, full_description || null, partner_churches || null, show_on_home ? 1 : 0, id
    ).run();

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Missing id query parameter' }, { status: 400 });
    }

    // Delete linked media & testimonies first
    await env.DB.prepare(`DELETE FROM crusade_media WHERE crusade_id = ?`).bind(id).run();
    await env.DB.prepare(`UPDATE testimonies SET crusade_id = NULL WHERE crusade_id = ?`).bind(id).run();
    await env.DB.prepare(`DELETE FROM crusades WHERE id = ?`).bind(id).run();

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}