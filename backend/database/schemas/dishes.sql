CREATE TABLE IF NOT EXISTS dishes (
    id SERIAL PRIMARY KEY,
    dish_name VARCHAR(100) NOT NULL,
    dish_price NUMERIC(10, 2) NOT NULL,
    dish_category VARCHAR(50) NOT NULL,
    dish_description VARCHAR(255) NOT NULL,
    dish_image_url TEXT,
    inventory_id INTEGER REFERENCES inventory(id) ON DELETE SET NULL,
    dish_stock INTEGER NOT NULL DEFAULT 15,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
