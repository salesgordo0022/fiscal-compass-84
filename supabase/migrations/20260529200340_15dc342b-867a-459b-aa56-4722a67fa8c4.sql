-- Insere o usuário na tabela de autenticação do Supabase (Auth)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
VALUES (
    'd290f1ee-6c54-4b01-90e6-d701748f0851', 
    '00000000-0000-0000-0000-000000000000', 
    'gabysaboiamartins@gmail.com', 
    crypt('admin123', gen_salt('bf')), 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Gaby Saboia Martins"}', 
    false, 
    'authenticated', 
    now(), 
    now(), 
    '', 
    '', 
    '', 
    ''
);

-- Garante que existe uma identidade associada com o provider_id correto
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'd290f1ee-6c54-4b01-90e6-d701748f0851',
    format('{"sub":"%s","email":"%s"}', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'gabysaboiamartins@gmail.com')::jsonb,
    'email',
    'd290f1ee-6c54-4b01-90e6-d701748f0851',
    now(),
    now(),
    now()
);

-- Cria o perfil público
INSERT INTO public.profiles (id, name, created_at, updated_at)
VALUES (
    'd290f1ee-6c54-4b01-90e6-d701748f0851',
    'Gaby Saboia Martins',
    now(),
    now()
);

-- Define o papel como administrador
INSERT INTO public.user_roles (user_id, role, created_at)
VALUES (
    'd290f1ee-6c54-4b01-90e6-d701748f0851',
    'admin',
    now()
);