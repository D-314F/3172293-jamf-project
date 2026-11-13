INSERT INTO permissions (permission_name, permission_codename, content_type_id) VALUES
    ('Crear platillos',              'create_dishes', (SELECT content_type_id FROM content_type WHERE app_label='dishes' AND model='dish')),
    ('Ver detalle de platillos',     'view_dishes',   (SELECT content_type_id FROM content_type WHERE app_label='dishes' AND model='dish')),
    ('Listar platillos',             'list_dishes',   (SELECT content_type_id FROM content_type WHERE app_label='dishes' AND model='dish')),
    ('Editar platillos',             'update_dishes', (SELECT content_type_id FROM content_type WHERE app_label='dishes' AND model='dish')),
    ('Cambiar estado de platillos',  'toggle_dishes', (SELECT content_type_id FROM content_type WHERE app_label='dishes' AND model='dish')),
    ('Generar reporte de platillos', 'report_dishes', (SELECT content_type_id FROM content_type WHERE app_label='dishes' AND model='dish'))
ON CONFLICT (permission_codename) DO NOTHING;