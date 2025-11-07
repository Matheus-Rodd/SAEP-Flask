document.addEventListener('DOMContentLoaded', () => {

    // --- VERIFICAÇÃO DE LOGIN ---
    const usuarioLogado = localStorage.getItem('nome_usuario_logado');
    const idUsuarioLogado = localStorage.getItem('id_usuario_logado');
    
    if (!usuarioLogado || !idUsuarioLogado) {
        alert('Você não está logado! Redirecionando para o login.');
        window.location.href = 'index.html';
        return;
    }

    // --- CONSTANTES E VARIÁVEIS ---
    const apiUrl = 'http://127.0.0.1:5000';
    const form = document.getElementById('movimentacao-form');
    const produtoSelect = document.getElementById('produto-select');
    const alertMessage = document.getElementById('alert-message');
    const historicoTableBody = document.getElementById('historico-table-body');

    // --- FUNÇÕES ---

    /**
     * Requisito: Popula o <select> com produtos em ORDEM ALFABÉTICA.
     * Nossa API em /estoque/produtos já faz isso.
     */
    async function popularSelectProdutos() {
        try {
            const response = await fetch(`${apiUrl}/estoque/produtos`);
            if (!response.ok) throw new Error('Falha ao carregar produtos.');
            
            const produtos = await response.json();
            
            produtoSelect.innerHTML = '<option value="">-- Selecione um produto --</option>'; // Limpa "Carregando..."
            
            produtos.forEach(produto => {
                const option = document.createElement('option');
                option.value = produto.id;
                option.textContent = produto.nome;
                produtoSelect.appendChild(option);
            });

        } catch (error) {
            produtoSelect.innerHTML = `<option value="">${error.message}</option>`;
            produtoSelect.disabled = true;
        }
    }

    /**
     * Requisito: Carrega o histórico completo de movimentações.
     */
    async function fetchHistorico() {
        try {
            const response = await fetch(`${apiUrl}/historico`);
            if (!response.ok) throw new Error('Falha ao carregar histórico.');

            const historico = await response.json();
            historicoTableBody.innerHTML = ''; // Limpa tabela

            historico.forEach(item => {
                // Formata a data para pt-BR
                const dataFormatada = new Date(item.data).toLocaleString('pt-BR');
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.id}</td>
                    <td>${dataFormatada}</td>
                    <td>${item.produto_nome || 'N/D'}</td>
                    <td>${item.tipo}</td>
                    <td>${item.quantidade}</td>
                    <td>${item.usuario_nome || 'N/D'}</td>
                `;
                historicoTableBody.appendChild(tr);
            });
        } catch (error) {
            historicoTableBody.innerHTML = `<tr><td colspan="6">${error.message}</td></tr>`;
        }
    }

    /**
     * Requisito: Registrar movimentação (entrada/saída)
     */
    async function handleFormSubmit(event) {
        event.preventDefault(); // Impede o recarregamento

        // Pega os dados do formulário
        const id_produto = produtoSelect.value;
        const tipo = document.querySelector('input[name="tipo"]:checked').value;
        const quantidade = parseInt(document.getElementById('quantidade').value);
        
        // Validação simples
        if (!id_produto || quantidade <= 0) {
            alertMessage.textContent = 'Por favor, selecione um produto e insira uma quantidade válida.';
            alertMessage.className = 'alert-error';
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/estoque/movimentar`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id_produto: id_produto,
                    id_usuario: idUsuarioLogado, // Enviando o ID do usuário logado
                    tipo: tipo,
                    quantidade: quantidade
                })
            });
            
            const data = await response.json();

            if (!response.ok) {
                // Ex: "Estoque insuficiente"
                throw new Error(data.mensagem || 'Erro ao registrar movimentação.');
            }

            // Sucesso!
            alertMessage.textContent = data.mensagem;
            alertMessage.className = 'alert-success';
            
            // --- REQUISITO: ALERTA AUTOMÁTICO ---
            // A API (data.alerta) nos diz se o estoque está baixo.
            if (data.alerta) {
                // Exibe o alerta de forma síncrona (como pede o simulado)
                window.alert(data.alerta); 
            }
            
            form.reset(); // Limpa o formulário
            fetchHistorico(); // Atualiza a tabela de histórico
            
            // Opcional: Atualizar o estoque na página de produtos (se voltarmos lá)
            // (Não é necessário para este requisito)

        } catch (error) {
            alertMessage.textContent = error.message;
            alertMessage.className = 'alert-error';
        }
    }


    // --- INICIALIZAÇÃO E EVENTOS ---
    form.addEventListener('submit', handleFormSubmit);
    
    // Carrega os dados iniciais da página
    popularSelectProdutos();
    fetchHistorico();
});