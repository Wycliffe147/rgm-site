// Admin Crusade Media API (GET, POST, DELETE)

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT cm.id, cm.crusade_id, c.title AS crusade_title, cm.type, cm.youtube_url, cm.title
     FROM crusade_media cm
     JOIN crusades c ON cm.crusade_id = c.id
     ORDER BY cm.id DESC`
  ).all();
  return Response.json(results);
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const { crusade_id, type, youtube_url, title } = body;

    if (!crusade_id || !youtube_url) {
      return Response.json({ error: 'crusade_id and youtube_url are required' }, { status: 400 });
    }

    const info = await env.DB.prepare(
      `INSERT OR REPLACE INTO crusade_media (crusade_id, type, youtube_url, title)
       VALUES (?, ?, ?, ?)`
    ).bind(crusade_id, type || 'highlight', youtube_url, title || null).run();

    return Response.json({ success: true, id: info.meta.last_row_id });
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

    await env.DB.prepare(`DELETE FROM crusade_media WHERE id = ?`).bind(id).run();
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
