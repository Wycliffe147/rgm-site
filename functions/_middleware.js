export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Redirect only the main pages.dev production URL to the custom domain.
  // We check for exact match so that preview branches (e.g. branch.rgm-site.pages.dev)
  // are not redirected, allowing you to still preview dev branches.
  if (url.hostname === 'rgm-site.pages.dev') {
    url.hostname = 'rgmmalawi.org';
    return Response.redirect(url.toString(), 301);
  }

  // Otherwise, proceed to render the page/run the API function normally
  return await context.next();
}
