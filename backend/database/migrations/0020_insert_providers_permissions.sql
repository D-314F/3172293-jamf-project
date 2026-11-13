INSERT INTO permissions (permission_name, permission_codename, content_type_id) VALUES
    ('Registrar proveedores',          'create_providers', (SELECT content_type_id FROM content_type WHERE app_label='providers' AND model='provider')),
    ('Ver detalle de proveedores',     'view_providers',   (SELECT content_type_id FROM content_type WHERE app_label='providers' AND model='provider')),
    ('Listar proveedores',             'list_providers',   (SELECT content_type_id FROM content_type WHERE app_label='providers' AND model='provider')),
    ('Editar proveedores',             'update_providers', (SELECT content_type_id FROM content_type WHERE app_label='providers' AND model='provider')),
    ('Cambiar estado de proveedores',  'toggle_providers', (SELECT content_type_id FROM content_type WHERE app_label='providers' AND model='provider')),
    ('Generar reporte de proveedores', 'report_providers', (SELECT content_type_id FROM content_type WHERE app_label='providers' AND model='provider'))
ON CONFLICT (permission_codename) DO NOTHING;