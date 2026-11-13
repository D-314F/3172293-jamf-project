INSERT INTO permissions (permission_name, permission_codename, content_type_id) VALUES
    ('Crear órdenes',              'create_orders', (SELECT content_type_id FROM content_type WHERE app_label='orders' AND model='order')),
    ('Ver detalle de órdenes',     'view_orders',   (SELECT content_type_id FROM content_type WHERE app_label='orders' AND model='order')),
    ('Listar órdenes',             'list_orders',   (SELECT content_type_id FROM content_type WHERE app_label='orders' AND model='order')),
    ('Editar órdenes',             'update_orders', (SELECT content_type_id FROM content_type WHERE app_label='orders' AND model='order')),
    ('Cambiar estado de órdenes',  'toggle_orders', (SELECT content_type_id FROM content_type WHERE app_label='orders' AND model='order')),
    ('Generar reporte de órdenes', 'report_orders', (SELECT content_type_id FROM content_type WHERE app_label='orders' AND model='order'))
ON CONFLICT (permission_codename) DO NOTHING;