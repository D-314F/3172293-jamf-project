INSERT INTO permissions (permission_name, permission_codename, content_type_id) VALUES
    ('Registrar insumos',             'create_inventory', (SELECT content_type_id FROM content_type WHERE app_label='inventory' AND model='inventory')),
    ('Ver detalle de insumos',        'view_inventory',   (SELECT content_type_id FROM content_type WHERE app_label='inventory' AND model='inventory')),
    ('Listar inventario',             'list_inventory',   (SELECT content_type_id FROM content_type WHERE app_label='inventory' AND model='inventory')),
    ('Editar insumos',                'update_inventory', (SELECT content_type_id FROM content_type WHERE app_label='inventory' AND model='inventory')),
    ('Cambiar estado de insumos',     'toggle_inventory', (SELECT content_type_id FROM content_type WHERE app_label='inventory' AND model='inventory')),
    ('Generar reporte de inventario', 'report_inventory', (SELECT content_type_id FROM content_type WHERE app_label='inventory' AND model='inventory'))
ON CONFLICT (permission_codename) DO NOTHING;