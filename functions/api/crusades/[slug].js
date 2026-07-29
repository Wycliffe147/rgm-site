// GET /api/crusades/:slug
// Returns one crusade plus its highlight videos and any linked testimonies
export async function onRequestGet({ env, params }) {
  function formatDateForDisplay(crusade) {
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
        return dates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).join(', ') + `, ${new Date(dates[0]).getFullYear()}`;
      } catch (e) {
        return date_range;
      }
    }
    return date_range || 'To Be Announced';
  }

  const crusade = await env.DB.prepare(
    `SELECT id, slug, title, location, date_range, start_date, end_date, custom_dates, date_type, status, poster_url, description, full_description, partner_churches
     FROM crusades WHERE slug = ?`
  ).bind(params.slug).first();

  if (!crusade) {
    return Response.json({ error: 'Crusade not found' }, { status: 404 });
  }

  const { results: media } = await env.DB.prepare(
    `SELECT type, youtube_url, title FROM crusade_media WHERE crusade_id = ?`
  ).bind(crusade.id).all();

  const { results: testimonies } = await env.DB.prepare(
    `SELECT title, youtube_url FROM testimonies WHERE crusade_id = ?`
  ).bind(crusade.id).all();

  return Response.json({ 
    ...crusade, 
    date_range: formatDateForDisplay(crusade),
    media, 
    testimonies 
  });
}