export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  try {
    const { name, phone, email, request_text } = await request.json();

    if (!name || !request_text) {
      return Response.json({ error: 'Name and Prayer Request details are required' }, { status: 400 });
    }

    await db.prepare(`
      INSERT INTO prayer_requests (name, phone, email, request_text, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).bind(
      name.trim(),
      phone ? phone.trim() : null,
      email ? email.trim() : null,
      request_text.trim()
    ).run();

    return Response.json({ success: true });
  } catch (err) {
    console.error('Submit prayer request error:', err);
    return Response.json({ error: 'Failed to submit prayer request' }, { status: 500 });
  }
}
