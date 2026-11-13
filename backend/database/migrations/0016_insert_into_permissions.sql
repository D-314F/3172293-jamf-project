INSERT INTO permissions (permission_name, permission_codename, content_type_id) VALUES
    ('Crear usuarios',                  'create_users', (SELECT content_type_id FROM content_type WHERE app_label='users' AND model='user')),
    ('Ver detalle de usuario',          'view_users',   (SELECT content_type_id FROM content_type WHERE app_label='users' AND model='user')),
    ('Listar usuarios',                 'list_users',   (SELECT content_type_id FROM content_type WHERE app_label='users' AND model='user')),
    ('Editar usuarios',                 'update_users', (SELECT content_type_id FROM content_type WHERE app_label='users' AND model='user')),
    ('Habilitar/Deshabilitar usuarios', 'toggle_users', (SELECT content_type_id FROM content_type WHERE app_label='users' AND model='user')),
    ('Generar reporte de usuarios',     'report_users', (SELECT content_type_id FROM content_type WHERE app_label='users' AND model='user'))
ON CONFLICT (permission_codename) DO NOTHING;