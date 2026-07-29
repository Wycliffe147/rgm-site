// GET /api/charity-stories
// Supports ?featured=1 filter.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const featured = url.searchParams.get('featured');

  if (featured === '1') {
    const { results } = await env.DB.prepare(
      `SELECT id, title, beneficiary_name, location, description, full_description, photo_url, youtube_url
       FROM charity_stories WHERE show_on_home = 1 ORDER BY id DESC`
    ).all();
    return Response.json(results);
  }

  const { results } = await env.DB.prepare(
    `SELECT id, title, beneficiary_name, location, description, full_description, photo_url, youtube_url
     FROM charity_stories ORDER BY id DESC`
  ).all();

  return Response.json(results);
}
