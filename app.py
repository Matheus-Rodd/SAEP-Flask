# --- 1. IMPORTS ---
from flask import Flask, jsonify, request
from flask_cors import CORS # Importar o CORS
from config import Config # Importar nossa classe de Config
from extensions import db # Importar a instância do DB
from models import Usuarios, Produtos, Movimentacoes # Importar os Modelos
from sqlalchemy import desc # Para ordenação

# --- 2. INICIALIZAÇÃO DO APP ---
app = Flask(__name__)
# Carrega as configurações do arquivo 'config.py'
app.config.from_object(Config) 

# --- 3. CONFIGURAÇÃO DO CORS (A CORREÇÃO CRÍTICA) ---
# Esta é a linha corrigida.
# Ela permite que o frontend (http://127.0.0.1:5500)
# envie requisições GET, POST, PUT, e DELETE para este backend.
CORS(app, 
     origins="http://127.0.0.1:5500", 
     methods=["GET", "POST", "PUT", "DELETE"], 
     supports_credentials=True
)

# --- 4. INICIALIZAÇÃO DO BANCO ---
# Vincula a instância do SQLAlchemy (do extensions.py) ao app Flask
db.init_app(app)

# --- 5. ROTAS DA API ---

@app.route('/')
def index():
    return "API de Gestão de Estoque SAEP (SQLite) - Pronta!"

# --- ENTREGA 4: Autenticação ---
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    nome_usuario = data.get('nome_usuario')
    senha = data.get('senha')

    if not nome_usuario or not senha:
        return jsonify({'mensagem': 'Usuário e senha são obrigatórios!'}), 400

    usuario = Usuarios.query.filter_by(nome_usuario=nome_usuario).first()

    if usuario and usuario.senha == senha: # Comparação simples
        return jsonify({
            'mensagem': 'Login bem-sucedido!', 
            'usuario_id': usuario.id, 
            'nome_usuario': usuario.nome_usuario
        }), 200
    else:
        return jsonify({'mensagem': 'Falha na autenticação. Usuário ou senha inválidos.'}), 401

# --- ENTREGA 6: CRUD de Produtos ---
# (Aqui estavam faltando as rotas, o que causava o erro 404/Failed to fetch)

# 6.1: Listar produtos (com filtro de busca)
@app.route('/produtos', methods=['GET'])
def get_produtos():
    query_nome = request.args.get('nome') 
    if query_nome:
        produtos = Produtos.query.filter(Produtos.nome.ilike(f'%{query_nome}%')).all()
    else:
        produtos = Produtos.query.all()
        
    return jsonify([{
        'id': p.id,
        'nome': p.nome,
        'descricao': p.descricao,
        'quantidade_estoque': p.quantidade_estoque,
        'estoque_minimo': p.estoque_minimo
    } for p in produtos]), 200

# 6.2: Inserir produto (A ROTA QUE ESTAVA FALHANDO)
@app.route('/produtos', methods=['POST'])
def create_produto():
    data = request.json
    if not data.get('nome') or data.get('estoque_minimo') is None:
        return jsonify({'mensagem': 'Nome e estoque mínimo são obrigatórios.'}), 400
    
    novo_produto = Produtos(
        nome=data.get('nome'),
        descricao=data.get('descricao'),
        quantidade_estoque=data.get('quantidade_estoque', 0),
        estoque_minimo=data.get('estoque_minimo', 10)
    )
    db.session.add(novo_produto)
    db.session.commit()
    return jsonify({'mensagem': 'Produto cadastrado com sucesso!', 'id': novo_produto.id}), 201

# 6.3: Editar produto
@app.route('/produtos/<int:id>', methods=['PUT'])
def update_produto(id):
    # db.session.get é a forma moderna de buscar pela Primary Key
    produto = db.session.get(Produtos, id) 
    if not produto:
        return jsonify({'mensagem': 'Produto não encontrado'}), 404
        
    data = request.json
    
    produto.nome = data.get('nome', produto.nome)
    produto.descricao = data.get('descricao', produto.descricao)
    produto.quantidade_estoque = data.get('quantidade_estoque', produto.quantidade_estoque)
    produto.estoque_minimo = data.get('estoque_minimo', produto.estoque_minimo)
    
    db.session.commit()
    return jsonify({'mensagem': 'Produto atualizado com sucesso!'}), 200

# 6.4: Excluir produto
@app.route('/produtos/<int:id>', methods=['DELETE'])
def delete_produto(id):
    produto = db.session.get(Produtos, id)
    if not produto:
        return jsonify({'mensagem': 'Produto não encontrado'}), 404
    
    # Regra de negócio: não excluir se houver histórico
    movimentacoes = Movimentacoes.query.filter_by(id_produto=id).first()
    if movimentacoes:
        return jsonify({'mensagem': 'Não é possível excluir. Produto possui histórico de movimentações.'}), 400
        
    db.session.delete(produto)
    db.session.commit()
    return jsonify({'mensagem': 'Produto excluído com sucesso!'}), 200

# --- ENTREGA 7: Gestão de Estoque ---

# 7.1: Listar produtos (em ordem alfabética)
@app.route('/estoque/produtos', methods=['GET'])
def get_produtos_ordenados():
    produtos = Produtos.query.order_by(Produtos.nome.asc()).all()
    return jsonify([{'id': p.id, 'nome': p.nome} for p in produtos]), 200

# 7.2: Registrar movimentação (Entrada/Saída)
@app.route('/estoque/movimentar', methods=['POST'])
def registrar_movimentacao():
    data = request.json
    id_produto = data.get('id_produto')
    id_usuario = data.get('id_usuario')
    tipo = data.get('tipo')
    quantidade = data.get('quantidade')

    if not all([id_produto, id_usuario, tipo, quantidade]):
        return jsonify({'mensagem': 'Todos os campos são obrigatórios.'}), 400

    if tipo not in ['entrada', 'saida']:
        return jsonify({'mensagem': "Tipo de movimentação inválido. Use 'entrada' ou 'saida'."}), 400

    produto = db.session.get(Produtos, id_produto)
    if not produto:
        return jsonify({'mensagem': 'Produto não encontrado'}), 404
        
    alerta_estoque = None
    
    if tipo == 'entrada':
        produto.quantidade_estoque += quantidade
    elif tipo == 'saida':
        if produto.quantidade_estoque < quantidade:
            return jsonify({'mensagem': f'Estoque insuficiente. Disponível: {produto.quantidade_estoque}'}), 400
        produto.quantidade_estoque -= quantidade
    
    # Requisito: Gerar alerta automático
    if produto.quantidade_estoque < produto.estoque_minimo:
        alerta_estoque = f"ALERTA: Estoque do produto '{produto.nome}' está abaixo do mínimo ({produto.estoque_minimo})!"

    nova_movimentacao = Movimentacoes(
        id_produto=id_produto,
        id_usuario=id_usuario,
        tipo=tipo,
        quantidade=quantidade
    )
    
    db.session.add(nova_movimentacao)
    db.session.commit() # Salva o produto e a movimentação juntos

    response = {'mensagem': f'{tipo.capitalize()} registrada com sucesso.'}
    if alerta_estoque:
        response['alerta'] = alerta_estoque
        
    return jsonify(response), 200

# 7.3: Histórico de movimentações
@app.route('/historico', methods=['GET'])
def get_historico():
    historico = Movimentacoes.query.order_by(Movimentacoes.data.desc()).all()
    return jsonify([item.to_json() for item in historico]), 200

# --- 6. FUNÇÃO DE POPULAR O BANCO ---
def popular_banco():
    # Só popula se a tabela de usuários estiver vazia
    if Usuarios.query.first() is None:
        print("Populando o banco de dados inicial...")
        
        # 1. Criar Usuários
        u1 = Usuarios(nome_usuario='admin', senha='admin123')
        u2 = Usuarios(nome_usuario='estoquista', senha='senha456')
        u3 = Usuarios(nome_usuario='gerente', senha='gerente789')
        db.session.add_all([u1, u2, u3])
        
        # 2. Criar Produtos
        p1 = Produtos(nome='Smartphone X', descricao='Tela 6.5", 128GB', quantidade_estoque=50, estoque_minimo=10)
        p2 = Produtos(nome='Notebook Y', descricao='16GB RAM, 512GB SSD', quantidade_estoque=30, estoque_minimo=5)
        p3 = Produtos(nome='Smart TV Z', descricao='4K, WiFi/Bluetooth', quantidade_estoque=20, estoque_minimo=8)
        db.session.add_all([p1, p2, p3])
        
        # Salva para que os IDs sejam gerados
        db.session.commit() 
        
        # 3. Criar Movimentações Iniciais
        m1 = Movimentacoes(tipo='entrada', quantidade=50, id_produto=p1.id, id_usuario=u1.id)
        m2 = Movimentacoes(tipo='entrada', quantidade=30, id_produto=p2.id, id_usuario=u1.id)
        m3 = Movimentacoes(tipo='entrada', quantidade=20, id_produto=p3.id, id_usuario=u2.id)
        db.session.add_all([m1, m2, m3])
        
        db.session.commit()
        print("Banco de dados populado com sucesso.")

# --- 7. PONTO DE ENTRADA (EXECUTAR O APP) ---
if __name__ == '__main__':
    # 'with app.app_context()' é necessário para comandos do DB fora de uma rota
    with app.app_context():
        db.create_all() # Cria as tabelas se não existirem
        popular_banco() # Popula o banco se estiver vazio
    app.run(debug=True) # Roda o servidor Flask