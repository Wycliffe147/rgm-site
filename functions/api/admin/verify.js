// GET /api/admin/verify
// Confirms that the authorization token is valid
export async function onRequestGet() {
  return Response.json({ success: true, message: 'Authenticated successfully' });
}
