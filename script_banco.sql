CREATE TABLE IF NOT EXISTS Usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_usuario VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    quantidade_estoque INTEGER NOT NULL DEFAULT 0,
    estoque_minimo INTEGER NOT NULL DEFAULT 10
);

CREATE TABLE IF NOT EXISTS Movimentacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo VARCHAR(10) NOT NULL,
    quantidade INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    FOREIGN KEY (id_produto) REFERENCES Produtos(id),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);


-- --- POPULAÇÃO INICIAL (Exemplos) ---
-- (No nosso projeto, isso é feito pelo app.py)

INSERT INTO Usuarios (nome_usuario, senha) VALUES
('admin', 'admin123'),
('estoquista', 'senha456'),
('gerente', 'gerente789');

INSERT INTO Produtos (nome, descricao, quantidade_estoque, estoque_minimo) VALUES
('Smartphone X', 'Tela 6.5", 128GB', 50, 10),
('Notebook Y', '16GB RAM, 512GB SSD', 30, 5),
('Smart TV Z', '4K, WiFi/Bluetooth', 20, 8);

INSERT INTO Movimentacoes (tipo, quantidade, id_produto, id_usuario) VALUES
('entrada', 50, 1, 1),
('entrada', 30, 2, 1),
('entrada', 20, 3, 2);