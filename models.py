from extensions import db
from datetime import datetime

class Usuarios(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nome_usuario = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)

class Produtos(db.Model):
    __tablename__ = 'produtos'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.Text)
    quantidade_estoque = db.Column(db.Integer, nullable=False, default=0)
    estoque_minimo = db.Column(db.Integer, nullable=False, default=10)

class Movimentacoes(db.Model):
    __tablename__ = 'movimentacoes'
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.DateTime, default=datetime.utcnow)
    tipo = db.Column(db.String(10), nullable=False) 
    quantidade = db.Column(db.Integer, nullable=False)
    id_produto = db.Column(db.Integer, db.ForeignKey('produtos.id'), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)

    produto = db.relationship('Produtos')
    usuario = db.relationship('Usuarios')

    def to_json(self):
        return {
            'id': self.id,
            'data': self.data.isoformat(),
            'tipo': self.tipo,
            'quantidade': self.quantidade,
            'produto_nome': self.produto.nome if self.produto else None,
            'usuario_nome': self.usuario.nome_usuario if self.usuario else None
        }