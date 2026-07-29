export async function onRequestGet() {
  return Response.json({ success: true, message: 'Authenticated successfully' });
}
