🚀 Gestão de Estoque - Simulado SAEP
Sistema de gestão de estoque com API em Flask (Python + SQLite) e Interface em HTML, CSS e JavaScript.

🛠️ Tecnologias
Backend: Python, Flask, SQLAlchemy

Banco de Dados: SQLite

Frontend: HTML, CSS, JavaScript (Vanilla)

Ambiente: VS Code + Live Server

🏁 Como Rodar o Projeto (Passo a Passo)
Você precisará de dois terminais abertos para rodar o projeto: um para o Backend (API) e um para o Frontend (Site).

1. Preparação (Instalação)
Clone o Repositório:

Bash

git clone [URL_DO_SEU_REPOSITORIO]
cd [NOME-DO-PROJETO]
Crie e Ative o Ambiente Virtual (venv):

Bash

# Criar
python -m venv venv

# Ativar (Windows)
.\venv\Scripts\activate
Instale as Dependências (com a venv ativa):

(Primeiro, crie o arquivo requirements.txt se ainda não o fez: pip freeze > requirements.txt)

Bash

pip install -r requirements.txt
2. Rodando o Backend (Terminal 1)
O backend é a API (o "cérebro") que se conecta ao banco de dados.

No seu terminal (com a venv ativa), entre na pasta sistema:

Bash

cd sistema
Execute o app.py:

Bash

python app.py
Você verá o servidor rodar em http://127.0.0.1:5000.

Deixe este terminal aberto.

Nota: Na primeira execução, o app.py criará o banco saep_db.db e o populará com dados de teste.

3. Rodando o Frontend (Terminal 2 ou VS Code)
O frontend é o "site" (HTML/CSS/JS) que você vê no navegador.

Abra o VS Code na pasta do projeto.

Instale a extensão Live Server (se ainda não tiver).

No explorador de arquivos, vá até a pasta sistema.

Clique com o botão direito no arquivo index.html.

Selecione "Open with Live Server".

Pronto!
Seu navegador abrirá automaticamente no endereço http://127.0.0.1:5500/sistema/.

O site (Frontend) estará rodando e se comunicando com a sua API (Backend).

Login de Teste:

Usuário: admin

Senha: admin123
