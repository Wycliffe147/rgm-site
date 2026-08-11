export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  try {
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return Response.json({ error: 'Email address is required' }, { status: 400 });
    }

    const emailTrimmed = email.trim().toLowerCase();
    
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      return Response.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    await db.prepare(`
      INSERT INTO newsletter_subscribers (email, status)
      VALUES (?, 'subscribed')
      ON CONFLICT(email) DO UPDATE SET 
        status = 'subscribed',
        created_at = CURRENT_TIMESTAMP
    `).bind(emailTrimmed).run();

    return Response.json({ success: true, message: 'Thank you for subscribing!' });
  } catch (err) {
    console.error('Newsletter subscribe error:', err);
    return Response.json({ error: 'Failed to subscribe. Please try again later.' }, { status: 500 });
  }
}
