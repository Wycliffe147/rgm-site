// POST: Submit RSVP registration for crossover event
export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });

  try {
    const { name, email, phone, guests_count } = await request.json();
    if (!name?.trim()) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }

    const guests = parseInt(guests_count, 10);
    const finalGuests = isNaN(guests) || guests < 0 ? 0 : guests;

    await db.prepare(`
      INSERT INTO crossover_registrations (name, email, phone, guests_count)
      VALUES (?, ?, ?, ?)
    `).bind(name.trim(), email?.trim() || null, phone?.trim() || null, finalGuests).run();

    return Response.json({ success: true });
  } catch (err) {
    console.error('Crossover RSVP error:', err);
    return Response.json({ error: 'Failed to register' }, { status: 500 });
  }
}
