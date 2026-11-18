CREATE TABLE IF NOT EXISTS media_files (
    id SERIAL PRIMARY KEY,
    folder VARCHAR(40) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    hash_name VARCHAR(255) UNIQUE NOT NULL,
    file_url TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
