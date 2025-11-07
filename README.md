Aqui está um README.md completo e profissional, pronto para ser copiado e colado no seu repositório do GitHub.

Este arquivo explica o que é o projeto, quais tecnologias ele usa, e o mais importante: como instalá-lo e executá-lo passo a passo.

Crie um arquivo chamado README.md na pasta raiz do seu projeto (ao lado da pasta sistema e venv) e cole o seguinte conteúdo nele:

📦 Sistema de Gestão de Estoque - Simulado SAEP
Sistema web completo (Flask + SQLite + Vanilla JS) para gestão de estoque, desenvolvido como solução para o Simulado Prático SAEP.

✨ Funcionalidades
Este projeto implementa um sistema de gerenciamento de almoxarifado com as seguintes funcionalidades:

Autenticação: Sistema de login seguro e função de logout.

Dashboard: Página principal com o nome do usuário logado e navegação.

Gestão de Produtos (CRUD):

Listar, cadastrar, editar e excluir produtos.

Busca dinâmica por nome.

Validação de regras de negócio (ex: não permitir exclusão de produto com histórico).

Gestão de Estoque:

Registro de entradas e saídas de estoque.

Formulário com lista de produtos em ordem alfabética.

Alerta de Estoque Mínimo: Dispara um alerta visual imediato quando uma saída de produto resulta em um estoque abaixo do limite configurado.

Histórico: Exibição de todas as movimentações de estoque, ordenadas por data.

🚀 Tecnologias Utilizadas
Backend (API):

Python 3.x

Flask

Flask-SQLAlchemy (ORM para o banco de dados)

Flask-CORS (Para permitir a comunicação entre Frontend e Backend)

Banco de Dados:

SQLite 3 (Armazenado no arquivo saep_db.db)

Frontend (Interface):

HTML5 (Estrutura semântica)

CSS3 (Estilo "Clean" moderno com Variáveis CSS)

JavaScript (Vanilla JS, ES6+)

fetch() API (Para consumir a API Flask)

Ambiente de Desenvolvimento:

VS Code

venv (Ambiente virtual Python)

Live Server (Extensão do VS Code para servir o frontend)

🏁 Como Rodar (Setup Local)
Siga estes passos para configurar e rodar o projeto em sua máquina local.

1. Preparação
Clone o repositório:

Bash

git clone [URL_DO_SEU_REPOSITORIO]
cd [NOME-DO-SEU-PROJETO]
Crie e ative o ambiente virtual (venv):

Bash

# Crie a venv
python -m venv venv

# Ative a venv
# No Windows (PowerShell/CMD):
.\venv\Scripts\activate

# No Mac/Linux (Bash/Zsh):
source venv/bin/activate
(Você verá (venv) no início do seu terminal)

Instale as dependências do Python:

Bash

# O pip vai ler o arquivo requirements.txt e instalar tudo
pip install -r requirements.txt
2. Executando o Projeto
O sistema é dividido em duas partes (Backend e Frontend) que devem ser executadas simultaneamente em terminais/processos separados.

▶️ Parte 1: Rodar o Backend (API Flask)
O backend é o "cérebro" que se conecta ao banco de dados.

No seu terminal (com a (venv) ativa), navegue até a pasta sistema (onde o app.py está):

Bash

cd sistema
Execute o arquivo app.py:

Bash

python app.py
Isso iniciará o servidor da API. Você verá no terminal: * Running on http://127.0.0.1:5000

Deixe este terminal rodando.

Nota: Na primeira vez que você rodar, o app.py criará automaticamente o arquivo de banco de dados saep_db.db (dentro da pasta sistema) e o populará com os dados iniciais.

▶️ Parte 2: Rodar o Frontend (Interface Web)
O frontend é o "site" (HTML/CSS/JS) que você acessa no navegador.

Abra a pasta completa do projeto no VS Code.

Se ainda não tiver, instale a extensão Live Server

No explorador de arquivos, vá até a pasta sistema.

Clique com o botão direito no arquivo index.html.

Selecione "Open with Live Server".

Isso abrirá automaticamente o seu navegador no endereço http://127.0.0.1:5500/sistema/ (a porta 5500 pode variar).

Pronto! O sistema está no ar.

Credenciais de teste:

Usuário: admin

Senha: admin123
