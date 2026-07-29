// Admin Charity Stories API (GET, POST, PATCH, DELETE)
 
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT id, title, beneficiary_name, location, description, full_description, photo_url, youtube_url, show_on_home
     FROM charity_stories ORDER BY id DESC`
  ).all();
  return Response.json(results);
}
 
export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const { title, beneficiary_name, location, description, full_description, photo_url, youtube_url, show_on_home } = body;
 
    if (!title) {
      return Response.json({ error: 'title is required' }, { status: 400 });
    }
 
    const info = await env.DB.prepare(
      `INSERT INTO charity_stories (title, beneficiary_name, location, description, full_description, photo_url, youtube_url, show_on_home)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(title, beneficiary_name || null, location || null, description || null, full_description || null, photo_url || null, youtube_url || null, show_on_home ? 1 : 0).run();
 
    return Response.json({ success: true, id: info.meta.last_row_id });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
 
export async function onRequestPatch({ request, env }) {
  try {
    const body = await request.json();
    const { id, title, beneficiary_name, location, description, full_description, photo_url, youtube_url, show_on_home } = body;
 
    if (!id || !title) {
      return Response.json({ error: 'id and title are required' }, { status: 400 });
    }
 
    await env.DB.prepare(
      `UPDATE charity_stories
       SET title = ?, beneficiary_name = ?, location = ?, description = ?, full_description = ?, photo_url = ?, youtube_url = ?, show_on_home = ?
       WHERE id = ?`
    ).bind(title, beneficiary_name || null, location || null, description || null, full_description || null, photo_url || null, youtube_url || null, show_on_home ? 1 : 0, id).run();
 
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
 
    await env.DB.prepare(`DELETE FROM charity_stories WHERE id = ?`).bind(id).run();
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
