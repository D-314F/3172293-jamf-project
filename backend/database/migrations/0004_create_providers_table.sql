CREATE TABLE IF NOT EXISTS providers (
    id SERIAL PRIMARY KEY,
    provider_document_type VARCHAR(20) NOT NULL,
    provider_document_number VARCHAR(50) UNIQUE NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    provider_observations VARCHAR(255),
    provider_products VARCHAR(100) NOT NULL,
    provider_phone VARCHAR(20) NOT NULL,
    provider_email VARCHAR(150) UNIQUE NOT NULL,
    provider_address VARCHAR(150) NOT NULL,
    provider_image_url TEXT,
    provider_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);