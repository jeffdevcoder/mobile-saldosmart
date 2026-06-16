CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    tipo VARCHAR(10) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    descricao VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (
    nome,
    email,
    senha
)
VALUES (
    'Administrador',
    'admin@saldosmart.com',
    '$2b$10$tmF4F5XRMQTU1CJDY6wgZ.M8JHPOucb5PR3xsZm8G43N1Py.OOWHW'
)
ON CONFLICT (email) DO NOTHING;