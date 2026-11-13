INSERT INTO content_type (app_label, model, display_name) VALUES
    ('users',     'user',      'Gestión de usuarios'),
    ('dishes',    'dish',      'Gestión de platillos'),
    ('inventory', 'inventory', 'Gestión de inventario'),
    ('orders',    'order',     'Gestión de órdenes'),
    ('providers', 'provider',  'Gestión de proveedores')
ON CONFLICT (app_label, model) DO UPDATE SET display_name = EXCLUDED.display_name;