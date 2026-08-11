// GET /api/charity-stories
// Supports ?featured=1, ?search=q, and ?limit=N&offset=N for server-side pagination.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const featured = url.searchParams.get('featured');
  const search   = url.searchParams.get('search') || '';
  const limit    = parseInt(url.searchParams.get('limit')  || '0', 10);
  const offset   = parseInt(url.searchParams.get('offset') || '0', 10);

  const headers = { 'Cache-Control': 'public, max-age=60, s-maxage=300' };
  const cols = `id, title, beneficiary_name, location, description, full_description, photo_url, youtube_url`;

  if (featured === '1') {
    const { results } = await env.DB.prepare(
      `SELECT ${cols} FROM charity_stories WHERE show_on_home = 1 ORDER BY id DESC`
    ).all();
    return Response.json(results, { headers });
  }

  const like = `%${search}%`;
  const whereClause = search
    ? `WHERE (title LIKE ? OR beneficiary_name LIKE ? OR location LIKE ?)`
    : '';

  if (limit > 0) {
    const q = `SELECT ${cols} FROM charity_stories ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`;
    const { results } = search
      ? await env.DB.prepare(q).bind(like, like, like, limit, offset).all()
      : await env.DB.prepare(q).bind(limit, offset).all();
    return Response.json(results, { headers });
  }

  const q = `SELECT ${cols} FROM charity_stories ${whereClause} ORDER BY id DESC`;
  const { results } = search
    ? await env.DB.prepare(q).bind(like, like, like).all()
    : await env.DB.prepare(q).all();
  return Response.json(results, { headers });
}
