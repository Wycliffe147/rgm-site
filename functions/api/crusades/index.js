// GET /api/crusades
// Returns crusades with formatted dates, upcoming first, sortable by date
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const featured = url.searchParams.get('featured');

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

  function getFirstDateForSorting(crusade) {
    const { date_type, start_date, custom_dates } = crusade;
    if (date_type === 'legacy') return new Date('9999-12-31'); // Legacy dates sort to bottom
    if (start_date) return new Date(start_date);
    if (date_type === 'separate' && custom_dates) {
      try {
        const dates = JSON.parse(custom_dates);
        return new Date(dates[0]);
      } catch (e) {
        return new Date('9999-12-31');
      }
    }
    return new Date('9999-12-31');
  }

  if (featured === '1') {
    const { results } = await env.DB.prepare(
      `SELECT slug, title, location, date_range, start_date, end_date, custom_dates, date_type, status, poster_url, description
       FROM crusades
       WHERE show_on_home = 1
       ORDER BY (status = 'upcoming') DESC, start_date ASC NULLS LAST, id DESC`
    ).all();
    
    return Response.json(results.map(c => ({
      ...c,
      date_range: formatDateForDisplay(c)
    })));
  }

  const { results } = await env.DB.prepare(
    `SELECT slug, title, location, date_range, start_date, end_date, custom_dates, date_type, status, poster_url, description
     FROM crusades
     ORDER BY (status = 'upcoming') DESC, start_date ASC NULLS LAST, id DESC`
  ).all();
  
  return Response.json(results.map(c => ({
    ...c,
    date_range: formatDateForDisplay(c)
  })));
}