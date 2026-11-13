CREATE TABLE IF NOT EXISTS user_groups (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_id INTEGER NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, group_id)
);