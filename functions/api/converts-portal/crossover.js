// GET: Retrieve crossover registrations or crossover prayers depending on ?type=
export async function onRequestGet(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });

  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'registrations';

  try {
    if (type === 'prayers') {
      const { results } = await db.prepare(
        'SELECT * FROM crossover_prayers ORDER BY created_at DESC'
      ).all();
      return Response.json(results || []);
    } else {
      const { results } = await db.prepare(
        'SELECT * FROM crossover_registrations ORDER BY created_at DESC'
      ).all();
      return Response.json(results || []);
    }
  } catch (err) {
    console.error('Crossover admin GET error:', err);
    return Response.json({ error: 'Failed to retrieve crossover records' }, { status: 500 });
  }
}

// DELETE: Delete a crossover registration or prayer (super_admin only)
export async function onRequestDelete(context) {
  const { request, env } = context;
  const db = env.DB;
  const admin = context.data?.admin;

  if (!db) return Response.json({ error: 'DB unavailable' }, { status: 500 });
  if (!admin || admin.role !== 'super_admin') {
    return Response.json({ error: 'Only super admin accounts can delete records' }, { status: 403 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const type = url.searchParams.get('type') || 'registration';

  if (!id) return Response.json({ error: 'Record ID is required' }, { status: 400 });

  try {
    if (type === 'prayer') {
      await db.prepare('DELETE FROM crossover_prayers WHERE id = ?').bind(id).run();
    } else {
      await db.prepare('DELETE FROM crossover_registrations WHERE id = ?').bind(id).run();
    }
    return Response.json({ success: true });
  } catch (err) {
    console.error('Crossover admin DELETE error:', err);
    return Response.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
