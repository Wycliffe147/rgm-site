// POST /api/contact
// Receives contact form submissions and saves them to the D1 database
export async function onRequestPost({ request, env }) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
      return Response.json({ error: "Name, email/phone, and message are required." }, { status: 400 });
    }

    await env.DB.prepare(
      `INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)`
    )
    .bind(name.trim(), email.trim(), (subject || "").trim(), message.trim())
    .run();

    return Response.json({ message: "Your message has been sent successfully. We will get back to you soon!" });
  } catch (err) {
    console.error("Failed to save contact message", err);
    return Response.json({ error: "Failed to submit your message. Please try again later." }, { status: 500 });
  }
}
