export async function onRequestGet(context) {
  // If request got here, it passed the middleware check successfully
  return Response.json({
    valid: true,
    admin: context.data.admin
  });
}
