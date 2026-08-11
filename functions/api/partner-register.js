export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  try {
    const { name, email, phone, partnership_type, message } = await request.json();

    if (!name || !partnership_type) {
      return Response.json({ error: 'Name and Partnership Type are required' }, { status: 400 });
    }

    const validTypes = ['prayer', 'volunteer', 'church', 'financial'];
    if (!validTypes.includes(partnership_type)) {
      return Response.json({ error: 'Invalid partnership type' }, { status: 400 });
    }

    await db.prepare(`
      INSERT INTO partner_registrations (name, email, phone, partnership_type, message, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `).bind(
      name.trim(),
      email ? email.trim() : null,
      phone ? phone.trim() : null,
      partnership_type,
      message ? message.trim() : null
    ).run();

    return Response.json({ success: true });
  } catch (err) {
    console.error('Submit partner registration error:', err);
    return Response.json({ error: 'Failed to submit registration' }, { status: 500 });
  }
}
