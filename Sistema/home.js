// Espera o DOM (a página) ser totalmente carregado
document.addEventListener('DOMContentLoaded', function() {
    
    // Pega os elementos do HTML
    const usernameDisplay = document.getElementById('username-display');
    const logoutButton = document.getElementById('logout-button');

    // 1. VERIFICAR SE O USUÁRIO ESTÁ LOGADO
    // Busca o nome do usuário que salvamos no localStorage (no login.js)
    const nomeUsuario = localStorage.getItem('nome_usuario_logado');

    if (nomeUsuario) {
        // Se encontrou o nome, exibe na tela
        usernameDisplay.textContent = nomeUsuario;
    } else {
        // Se não encontrou, é um acesso não autorizado.
        alert('Você não está logado! Redirecionando para o login.');
        window.location.href = 'index.html'; // Volta para a tela de login
    }

    // 2. ADICIONAR FUNCIONALIDADE AO BOTÃO DE LOGOUT
    logoutButton.addEventListener('click', function() {
        // Apaga os dados do usuário do localStorage
        localStorage.removeItem('nome_usuario_logado');
        localStorage.removeItem('id_usuario_logado');
        
        // Redireciona de volta para a tela de login
        window.location.href = 'index.html';
    });
});