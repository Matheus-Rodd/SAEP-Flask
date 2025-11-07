// Adiciona um "ouvinte" que espera o formulário ser enviado
document.getElementById('login-form').addEventListener('submit', async function(event) {
    // Impede o comportamento padrão do formulário (que é recarregar a página)
    event.preventDefault(); 

    // Pega os valores digitados pelo usuário
    const nome_usuario = document.getElementById('username').value;
    const senha = document.getElementById('password').value;
    
    // Pega o elemento <p> onde exibiremos o erro
    const errorMessage = document.getElementById('error-message');

    try {
        // Envia os dados para a API Flask (nosso backend)
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Converte os dados do JavaScript para o formato JSON
            body: JSON.stringify({ 
                nome_usuario: nome_usuario, 
                senha: senha 
            })
        });

        // Converte a resposta da API (que é JSON) para um objeto JavaScript
        const data = await response.json();

        // Verifica se a API respondeu com sucesso (código 200)
        if (response.ok) {
            // SUCESSO!
            errorMessage.textContent = ''; // Limpa qualquer erro antigo

            // Salva os dados do usuário no "cache" do navegador (LocalStorage)
            // Usaremos isso na próxima tela para mostrar o nome
            localStorage.setItem('nome_usuario_logado', data.nome_usuario); 
            localStorage.setItem('id_usuario_logado', data.usuario_id);
            
            // Requisito: Redireciona para a tela principal (home.html) [cite: 45]
            window.location.href = 'home.html'; 
        } else {
            // FALHA! (A API retornou um erro, ex: 401)
            // Requisito: Exibe a mensagem de erro que veio da API [cite: 38]
            errorMessage.textContent = data.mensagem; 
        }
    } catch (error) {
        // FALHA DE CONEXÃO!
        // (Ex: O `python app.py` não está rodando)
        errorMessage.textContent = 'Erro de conexão. A API está rodando?';
    }
});