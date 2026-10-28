CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    table_number INTEGER NOT NULL,
    waiter_id VARCHAR(100) NOT NULL,
    dish_id VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    order_status VARCHAR(30) DEFAULT 'Pendiente',
    observations VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);