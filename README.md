📦 Sistema de Gestão de Estoque - Simulado SAEP
Este projeto é uma solução completa para o Simulado Prático SAEP, desenvolvendo um sistema web para a gestão de estoque de equipamentos eletrônicos.

O sistema utiliza um Backend (API) criado em Flask (Python) com um banco de dados SQLite, e um Frontend (Interface) construído com HTML, CSS e JavaScript puros (vanilla), que consome a API.

✨ Funcionalidades
Autenticação: Sistema de login (com validação no backend) e logout (com limpeza de localStorage).

Dashboard Principal: Exibe o nome do usuário logado e os menus de navegação.

Gestão de Produtos (CRUD):

Listagem completa de produtos.

Cadastro de novos produtos (via modal).

Edição de produtos existentes (via modal).

Exclusão de produtos (com validação para não excluir itens com histórico).

Busca dinâmica por nome.

Gestão de Estoque:

Registro de entradas e saídas de estoque.

Listagem de produtos em ordem alfabética no formulário.

Alerta de Estoque Mínimo: Dispara um alerta visual (via alert()) quando o estoque de um produto fica abaixo do limite configurado após uma saída.

Histórico: Visualização de todas as movimentações registradas, ordenadas por data (mais recente primeiro).

🚀 Tecnologias Utilizadas
Backend:

Python 3.x

Flask

Flask-SQLAlchemy (para interagir com o banco)

Flask-CORS (para permitir a comunicação Frontend <-> Backend)

Database:

SQLite 3 (baseado em arquivo, saep_db.db)

Frontend:

HTML5

CSS3 (Estilo "Clean" moderno)

JavaScript (ES6+)

fetch() API (para consumir o backend)

Ambiente de Desenvolvimento:

VS Code

Extensão Live Server

🏁 Começando (Setup e Instalação)
Siga estes passos para configurar e rodar o projeto em sua máquina local.

Instalação
Clone o repositório:

Bash

git clone [URL_DO_SEU_REPOSITORIO_AQUI]
cd [NOME-DO-REPOSITORIO]
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

# Se você criou o requirements.txt:
pip install -r requirements.txt

# Se não, instale manualmente:
pip install Flask Flask-SQLAlchemy Flask-CORS
🚀 Executando o Projeto
O sistema é dividido em duas partes (Backend e Frontend) que devem ser executadas simultaneamente em terminais/processos separados.

1. Rodando o Backend (API Flask)
O backend é o "cérebro" que se conecta ao banco de dados.

No seu terminal (com a (venv) ativa), navegue até a pasta sistema (onde o app.py está):

Bash

cd sistema
Execute o arquivo app.py:

Bash

python app.py
Isso iniciará o servidor da API. Você verá no terminal: * Running on http://127.0.0.1:5000

Deixe este terminal rodando.

Nota: Na primeira vez que você rodar, o app.py criará automaticamente o arquivo de banco de dados saep_db.db (dentro da pasta sistema) e o populará com os usuários e produtos iniciais.

2. Rodando o Frontend (Interface Web)
O frontend é o "site" (HTML/CSS/JS) que você acessa no navegador. A forma mais fácil é usando o Live Server no VS Code.

Abra a pasta completa do projeto no VS Code.

Instale a extensão Live Server (procure por ritwickdey.LiveServer na aba de Extensões).

No explorador de arquivos, vá até a pasta sistema.

Clique com o botão direito no arquivo index.html.

Selecione "Open with Live Server".

Isso abrirá automaticamente o seu navegador no endereço http://127.0.0.1:5500/sistema/ (a porta 5500 pode variar).

Pronto! O sistema está no ar. Você pode fazer login com admin / admin123 e testar todas as funcionalidades.

📁 Estrutura do Projeto
seu-projeto/
├── venv/                   # Ambiente virtual do Python (não vai para o GitHub)
├── sistema/                # Pasta principal do sistema
│   ├── app.py              # Backend: App principal Flask (API)
│   ├── config.py           # Backend: Configurações (ex: banco)
│   ├── extensions.py       # Backend: Instância do SQLAlchemy (db)
│   ├── models.py           # Backend: Modelos das tabelas (ORM)
│   ├── saep_db.db          # Backend: O banco de dados SQLite
│   │
│   ├── index.html          # Frontend: Página de Login (Entrega 4)
│   ├── home.html           # Frontend: Dashboard (Entrega 5)
│   ├── produtos.html       # Frontend: CRUD de Produtos (Entrega 6)
│   ├── estoque.html        # Frontend: Gestão de Estoque (Entrega 7)
│   │
│   ├── style.css           # Frontend: Folha de estilos "Clean"
│   ├── login.js            # Frontend: JS do Login
│   ├── home.js             # Frontend: JS do Dashboard
│   ├── produtos.js         # Frontend: JS do CRUD
│   └── estoque.js          # Frontend: JS do Estoque
│
├── ANEXO III - doc.docx    # Documentação (Entregas 1, 8, 9)
├── DER.png                 # Diagrama (Entrega 2)
├── script_banco.sql        # Script SQL (Entrega 3)
├── requirements.txt        # Dependências do Python (Opcional, mas recomendado)
└── README.md               # Este arquivo