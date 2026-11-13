CREATE TABLE IF NOT EXISTS group_permissions (
    group_id INTEGER NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(permission_id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, permission_id)
);