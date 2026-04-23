import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    // Validate caller JWT and role
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return json({ error: 'Missing authorization' }, 401);
    }

    const supabaseUser = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: userData, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !userData.user) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verify caller is admin
    const { data: roleRow, error: roleErr } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleErr || !roleRow) {
      return json({ error: 'Forbidden: admin role required' }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    if (action === 'list') {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      if (error) return json({ error: error.message }, 400);
      const users = data.users.map((u) => ({ id: u.id, email: u.email ?? '' }));
      return json({ users });
    }

    if (action === 'update_password') {
      const targetId = body.user_id as string;
      const newPassword = body.password as string;
      if (!targetId || !newPassword || newPassword.length < 6) {
        return json({ error: 'user_id e senha (mín. 6 caracteres) são obrigatórios' }, 400);
      }
      const { error } = await supabaseAdmin.auth.admin.updateUserById(targetId, {
        password: newPassword,
      });
      if (error) return json({ error: error.message }, 400);
      return json({ success: true });
    }

    if (action === 'delete') {
      const targetId = body.user_id as string;
      if (!targetId) return json({ error: 'user_id obrigatório' }, 400);
      if (targetId === userData.user.id) {
        return json({ error: 'Você não pode excluir a si mesmo' }, 400);
      }
      const { error } = await supabaseAdmin.auth.admin.deleteUser(targetId);
      if (error) return json({ error: error.message }, 400);
      return json({ success: true });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('admin-users error:', message);
    return json({ error: message }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
