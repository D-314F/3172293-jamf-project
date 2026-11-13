INSERT INTO group_permissions (group_id, permission_id)
SELECT g.group_id, p.permission_id
FROM groups g
CROSS JOIN permissions p
WHERE g.group_name = 'Administrador'
ON CONFLICT DO NOTHING;