-- Limpeza total antes da recriação
DELETE FROM auth.users WHERE email = 'gabysaboiamartins@gmail.com';

-- Inserção direta no Auth com todos os campos necessários para bypass de confirmação
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud,
    created_at,
    updated_at,
    instance_id
)
VALUES (
    'd290f1ee-6c54-4b01-90e6-d701748f0851',
    'gabysaboiamartins@gmail.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Gaby Saboia Martins"}',
    false,
    'authenticated',
    'authenticated',
    now(),
    now(),
    '00000000-0000-0000-0000-000000000000'
);

-- Identidade obrigatória para login via e-mail
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
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

-- Perfil e Role de Admin (usando DELETE/INSERT para evitar problemas de ON CONFLICT sem constraint)
DELETE FROM public.user_roles WHERE user_id = 'd290f1ee-6c54-4b01-90e6-d701748f0851';
DELETE FROM public.profiles WHERE id = 'd290f1ee-6c54-4b01-90e6-d701748f0851';

INSERT INTO public.profiles (id, name, created_at, updated_at)
VALUES ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Gaby Saboia Martins', now(), now());

INSERT INTO public.user_roles (user_id, role, created_at)
VALUES ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'admin', now());