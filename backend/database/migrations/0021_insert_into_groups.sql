INSERT INTO groups (group_name) VALUES
    ('Administrador'),
    ('Cajero'),
    ('Mesero'),
    ('Cocinero')
ON CONFLICT (group_name) DO NOTHING;