// Admin Crusades API (GET, POST, PATCH, DELETE)
// Supports both legacy date_range and new structured dates

function getMalawiTodayStr() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const malawiTime = new Date(utc + (2 * 60 * 60 * 1000)); // UTC+2
  const yyyy = malawiTime.getFullYear();
  const mm = String(malawiTime.getMonth() + 1).padStart(2, '0');
  const dd = String(malawiTime.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function parseLegacyDate(dateRangeText, getEnd = false) {
  if (!dateRangeText) return null;
  const clean = dateRangeText.trim();
  
  const yearMatch = clean.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
  
  const months = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    january: 0, february: 1, march: 2, april: 3, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
  };
  
  const monthWords = clean.toLowerCase().match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\b/g) || [];
  const numbers = clean.replace(/\b(20\d{2})\b/g, '').match(/\b(\d{1,2})\b/g) || [];
  
  if (monthWords.length === 0) return null;
  
  const startMonthIdx = months[monthWords[0]];
  const startDay = numbers.length > 0 ? parseInt(numbers[0], 10) : 1;
  
  if (!getEnd) {
    return new Date(year, startMonthIdx, startDay);
  }
  
  const endMonthIdx = months[monthWords[monthWords.length - 1]];
  const endDay = numbers.length > 0 ? parseInt(numbers[numbers.length - 1], 10) : startDay;
  
  return new Date(year, endMonthIdx, endDay);
}

function getComputedStatus(crusade, todayStr) {
  const { date_type, start_date, end_date, custom_dates, date_range, status } = crusade;
  if (date_type === 'legacy') {
    const legacyEnd = parseLegacyDate(date_range, true);
    if (legacyEnd) {
      const yyyy = legacyEnd.getFullYear();
      const mm = String(legacyEnd.getMonth() + 1).padStart(2, '0');
      const dd = String(legacyEnd.getDate()).padStart(2, '0');
      const legacyEndStr = `${yyyy}-${mm}-${dd}`;
      return legacyEndStr < todayStr ? 'past' : 'upcoming';
    }
    return status || 'upcoming';
  }

  if (date_type === 'single' && start_date) {
    return start_date < todayStr ? 'past' : 'upcoming';
  }
  if (date_type === 'continuous' && start_date) {
    const compareDate = end_date || start_date;
    return compareDate < todayStr ? 'past' : 'upcoming';
  }
  if (date_type === 'separate' && custom_dates) {
    try {
      const dates = JSON.parse(custom_dates);
      if (Array.isArray(dates) && dates.length > 0) {
        const sorted = [...dates].sort();
        const lastDate = sorted[sorted.length - 1];
        return lastDate < todayStr ? 'past' : 'upcoming';
      }
    } catch (e) {}
  }
  return status || 'upcoming';
}

function formatDateDisplay(crusade) {
  const { date_type, start_date, end_date, custom_dates, date_range } = crusade;
  
  if (date_type === 'legacy') return date_range;
  
  if (date_type === 'single' && start_date) {
    const d = new Date(start_date);
    const day = d.getDate();
    const month = d.toLocaleDateString('en-GB', { month: 'short' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }
  
  if (date_type === 'continuous' && start_date && end_date) {
    const start = new Date(start_date);
    const end = new Date(end_date);
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.toLocaleDateString('en-GB', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-GB', { month: 'short' });
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    if (startYear !== endYear) {
      return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
    } else if (startMonth !== endMonth) {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
    } else {
      return `${startDay}-${endDay} ${startMonth} ${startYear}`;
    }
  }
  
  if (date_type === 'separate' && custom_dates) {
    try {
      const dates = JSON.parse(custom_dates);
      const formattedDates = dates.map(dStr => {
        const d = new Date(dStr);
        return `${d.getDate()} ${d.toLocaleDateString('en-GB', { month: 'short' })}`;
      });
      const year = new Date(dates[0]).getFullYear();
      return formattedDates.join(', ') + ` ${year}`;
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
  
  const todayStr = getMalawiTodayStr();

  return Response.json(results.map(c => {
    const computedStatus = getComputedStatus(c, todayStr);
    return {
      ...c,
      status: computedStatus,
      formatted_date: formatDateDisplay(c)
    };
  }));
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