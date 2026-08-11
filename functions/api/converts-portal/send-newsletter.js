// POST: Send a newsletter to all subscribed users via Sender.net
export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  const admin = context.data?.admin;

  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Get Sender API key from Cloudflare environment variables
  const senderApiKey = env.SENDER_API_KEY;
  if (!senderApiKey) {
    return Response.json({
      error: 'Sender API key is not configured. Please add SENDER_API_KEY to your Cloudflare environment variables.'
    }, { status: 400 });
  }

  try {
    const { fromName, fromEmail, subject, htmlBody } = await request.json();

    if (!fromName?.trim() || !fromEmail?.trim() || !subject?.trim() || !htmlBody?.trim()) {
      return Response.json({ error: 'fromName, fromEmail, subject, and htmlBody are required' }, { status: 400 });
    }

    // Fetch all active subscribers
    const { results: subscribers } = await db.prepare(
      "SELECT email FROM newsletter_subscribers WHERE status = 'subscribed'"
    ).all();

    if (!subscribers || subscribers.length === 0) {
      return Response.json({ success: true, sent_count: 0, msg: 'No active subscribers found to send to.' });
    }

    let successCount = 0;
    let failCount = 0;
    const errors = [];

    // Loop through each subscriber and send via Sender API
    for (const sub of subscribers) {
      try {
        const res = await fetch('https://api.sender.net/v2/message/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${senderApiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            from: {
              email: fromEmail.trim(),
              name: fromName.trim()
            },
            to: {
              email: sub.email
            },
            subject: subject.trim(),
            html: htmlBody
          })
        });

        if (res.ok) {
          successCount++;
        } else {
          failCount++;
          const errData = await res.json().catch(() => ({}));
          errors.push(`${sub.email}: ${errData.message || res.statusText}`);
        }
      } catch (err) {
        failCount++;
        errors.push(`${sub.email}: ${err.message}`);
      }
    }

    return Response.json({
      success: true,
      sent_count: successCount,
      fail_count: failCount,
      errors: errors.slice(0, 10), // return first 10 errors for troubleshooting
      total: subscribers.length
    });

  } catch (err) {
    console.error('Newsletter sending error:', err);
    return Response.json({ error: 'Failed to process newsletter campaign' }, { status: 500 });
  }
}
