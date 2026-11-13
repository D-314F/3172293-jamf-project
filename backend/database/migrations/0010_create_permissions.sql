CREATE TABLE IF NOT EXISTS permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_name VARCHAR(150) NOT NULL,
    permission_codename VARCHAR(100) UNIQUE NOT NULL,
    content_type_id INTEGER REFERENCES content_type(content_type_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);