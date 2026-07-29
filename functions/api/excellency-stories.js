// GET /api/excellency-stories
// Supports ?featured=1 filter.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const featured = url.searchParams.get('featured');

  if (featured === '1') {
    const { results } = await env.DB.prepare(
      `SELECT id, title, meta, youtube_url, description, full_description, quote
       FROM excellency_stories WHERE show_on_home = 1 ORDER BY id DESC`
    ).all();
    return Response.json(results);
  }

  const { results } = await env.DB.prepare(
    `SELECT id, title, meta, youtube_url, description, full_description, quote
     FROM excellency_stories ORDER BY id DESC`
  ).all();

  return Response.json(results);
}
