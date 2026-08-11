export async function onRequestGet(context) {
  const { env, data } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  // Only Super Admins can list admin users
  if (data.admin.role !== 'super_admin') {
    return Response.json({ error: 'Forbidden: Only Super Admins can manage users' }, { status: 403 });
  }

  try {
    const list = await db.prepare(`
      SELECT id, username, full_name, role, created_at 
      FROM portal_admins 
      ORDER BY id ASC
    `).all();
    return Response.json(list.results || []);
  } catch (err) {
    console.error('Fetch users error:', err);
    return Response.json({ error: 'Failed to fetch administrator list' }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { request, env, data } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  // Only Super Admins can create new admins
  if (data.admin.role !== 'super_admin') {
    return Response.json({ error: 'Forbidden: Only Super Admins can create users' }, { status: 403 });
  }

  try {
    const { username, password, full_name, role } = await request.json();

    if (!username || !password || !full_name || !role) {
      return Response.json({ error: 'Missing required user parameters' }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername.length < 3) {
      return Response.json({ error: 'Username must be at least 3 characters long' }, { status: 400 });
    }

    // Check if username already exists
    const existing = await db.prepare('SELECT id FROM portal_admins WHERE username = ?')
      .bind(cleanUsername)
      .first();

    if (existing) {
      return Response.json({ error: 'Username is already taken' }, { status: 400 });
    }

    // Hash the password (SHA-256)
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(password));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    await db.prepare(`
      INSERT INTO portal_admins (username, password_hash, full_name, role)
      VALUES (?, ?, ?, ?)
    `).bind(
      cleanUsername,
      passwordHash,
      full_name.trim(),
      role
    ).run();

    return Response.json({ success: true });

  } catch (err) {
    console.error('Create admin error:', err);
    return Response.json({ error: 'Failed to create new user' }, { status: 500 });
  }
}

export async function onRequestPut(context) {
  const { request, env, data } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  try {
    const { id, current_password, new_password, full_name, role } = await request.json();
    const targetId = parseInt(id, 10);

    if (isNaN(targetId)) {
      return Response.json({ error: 'Valid user ID is required' }, { status: 400 });
    }

    const encoder = new TextEncoder();

    // Verification check: User is editing themselves, or is a Super Admin
    const isSelfEdit = data.admin.id === targetId;
    const isSuperAdmin = data.admin.role === 'super_admin';

    if (!isSelfEdit && !isSuperAdmin) {
      return Response.json({ error: 'Forbidden: You do not have permission to edit this account' }, { status: 403 });
    }

    // Fetch existing user record
    const targetUser = await db.prepare('SELECT * FROM portal_admins WHERE id = ?').bind(targetId).first();
    if (!targetUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    let updatedHash = targetUser.password_hash;

    // If changing password
    if (new_password) {
      if (isSelfEdit) {
        // Must verify current password first
        if (!current_password) {
          return Response.json({ error: 'Current password is required to set a new password' }, { status: 400 });
        }

        const curBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(current_password));
        const curHash = Array.from(new Uint8Array(curBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

        if (curHash !== targetUser.password_hash) {
          return Response.json({ error: 'Incorrect current password' }, { status: 400 });
        }
      }

      // Hash the new password
      const newBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(new_password));
      updatedHash = Array.from(new Uint8Array(newBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Only Super Admins can change roles. Standard users editing themselves must keep their existing role.
    const updatedRole = (isSuperAdmin && role) ? role : targetUser.role;
    const updatedName = full_name ? full_name.trim() : targetUser.full_name;

    await db.prepare(`
      UPDATE portal_admins
      SET password_hash = ?, full_name = ?, role = ?
      WHERE id = ?
    `).bind(
      updatedHash,
      updatedName,
      updatedRole,
      targetId
    ).run();

    // If changing own password, invalidate other sessions
    if (new_password && isSelfEdit) {
      // Keep only current session or delete all sessions forcing new login
      // Let's delete all sessions for this user. The client will be kicked to login page.
      context.waitUntil(db.prepare('DELETE FROM portal_sessions WHERE admin_id = ?').bind(targetId).run());
    }

    return Response.json({ success: true });

  } catch (err) {
    console.error('Update admin error:', err);
    return Response.json({ error: 'Failed to update credentials' }, { status: 500 });
  }
}

export async function onRequestDelete(context) {
  const { request, env, data } = context;
  const db = env.DB;

  if (!db) {
    return Response.json({ error: 'Server Error: Database connection unavailable' }, { status: 500 });
  }

  // Only Super Admins can delete users
  if (data.admin.role !== 'super_admin') {
    return Response.json({ error: 'Forbidden: Only Super Admins can delete users' }, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const targetId = parseInt(id, 10);

    if (!id || isNaN(targetId)) {
      return Response.json({ error: 'Missing or invalid user ID' }, { status: 400 });
    }

    // Prevent deleting oneself
    if (data.admin.id === targetId) {
      return Response.json({ error: 'Forbidden: You cannot delete your own account' }, { status: 400 });
    }

    const result = await db.prepare('DELETE FROM portal_admins WHERE id = ?').bind(targetId).run();

    if (result.meta.changes === 0) {
      return Response.json({ error: 'User record not found' }, { status: 404 });
    }

    // Invalidate all active sessions for the deleted user
    context.waitUntil(db.prepare('DELETE FROM portal_sessions WHERE admin_id = ?').bind(targetId).run());

    return Response.json({ success: true });

  } catch (err) {
    console.error('Delete admin error:', err);
    return Response.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
