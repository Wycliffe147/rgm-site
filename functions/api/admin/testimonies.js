// Admin Testimonies API (GET, POST, PATCH, DELETE)
 
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT t.id, t.title, t.youtube_url, t.crusade_id, c.title AS crusade_title, t.show_on_home
     FROM testimonies t
     LEFT JOIN crusades c ON t.crusade_id = c.id
     ORDER BY t.id DESC`
  ).all();
  return Response.json(results);
}
 
export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const { title, youtube_url, crusade_id, show_on_home } = body;
 
    if (!title || !youtube_url) {
      return Response.json({ error: 'title and youtube_url are required' }, { status: 400 });
    }
 
    const info = await env.DB.prepare(
      `INSERT OR REPLACE INTO testimonies (title, youtube_url, crusade_id, show_on_home)
       VALUES (?, ?, ?, ?)`
    ).bind(title, youtube_url, crusade_id || null, show_on_home ? 1 : 0).run();
 
    return Response.json({ success: true, id: info.meta.last_row_id });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
 
export async function onRequestPatch({ request, env }) {
  try {
    const body = await request.json();
    const { id, title, youtube_url, crusade_id, show_on_home } = body;
 
    if (!id || !title || !youtube_url) {
      return Response.json({ error: 'id, title, and youtube_url are required' }, { status: 400 });
    }
 
    await env.DB.prepare(
      `UPDATE testimonies SET title = ?, youtube_url = ?, crusade_id = ?, show_on_home = ? WHERE id = ?`
    ).bind(title, youtube_url, crusade_id || null, show_on_home ? 1 : 0, id).run();
 
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
 
    await env.DB.prepare(`DELETE FROM testimonies WHERE id = ?`).bind(id).run();
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
