// Espera o DOM carregar
document.addEventListener('DOMContentLoaded', () => {

    // --- VERIFICAÇÃO DE LOGIN ---
    // (Igual ao home.js, essencial para segurança)
    const usuarioLogado = localStorage.getItem('nome_usuario_logado');
    if (!usuarioLogado) {
        alert('Você não está logado! Redirecionando para o login.');
        window.location.href = 'index.html';
        return; // Para a execução
    }

    // --- CONSTANTES E VARIÁVEIS GLOBAIS ---
    const apiUrl = 'http://127.0.0.1:5000'; // URL da nossa API Flask
    const productTableBody = document.getElementById('product-table-body');
    const searchInput = document.getElementById('search-input');
    const addProductBtn = document.getElementById('add-product-btn');
    
    // Elementos do Modal
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const closeModalBtn = document.querySelector('.close-btn');
    const productForm = document.getElementById('product-form');
    const productIdInput = document.getElementById('product-id');
    const modalError = document.getElementById('modal-error');

    // --- FUNÇÕES ---

    /**
     * Função principal: Busca produtos na API e popula a tabela
     * Requisito: Listagem e Busca
     */
    async function fetchProdutos(searchTerm = '') {
        try {
            // Se tiver um termo de busca, adiciona na URL
            const url = searchTerm 
                ? `${apiUrl}/produtos?nome=${searchTerm}` 
                : `${apiUrl}/produtos`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Falha ao buscar produtos.');
            }
            const produtos = await response.json();

            // Limpa a tabela antes de popular
            productTableBody.innerHTML = '';

            // Popula a tabela
            produtos.forEach(produto => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>${produto.descricao}</td>
                    <td>${produto.quantidade_estoque}</td>
                    <td>${produto.estoque_minimo}</td>
                    <td>
                        <button class="btn-edit" data-id="${produto.id}">Editar</button>
                        <button class="btn-delete" data-id="${produto.id}">Excluir</button>
                    </td>
                `;
                productTableBody.appendChild(tr);
            });

            // Adiciona os event listeners para os novos botões
            addTableButtonListeners();

        } catch (error) {
            console.error('Erro:', error);
            alert(error.message);
        }
    }

    /**
     * Adiciona "ouvintes" aos botões de Editar e Excluir da tabela
     */
    function addTableButtonListeners() {
        // Botões de Editar
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                // Busca os dados completos do produto para editar
                const produto = await getProdutoById(id);
                if (produto) {
                    openModal(produto); // Abre o modal em modo "Edição"
                }
            });
        });

        // Botões de Excluir
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                deleteProduto(id); // Chama a função de deletar
            });
        });
    }

    /**
     * Função auxiliar para buscar um único produto pelo ID (para edição)
     */
    async function getProdutoById(id) {
        try {
            // Nota: Nossa API não tem um endpoint "GET /produtos/id"
            // Vamos "simular" buscando o produto na lista que já temos
            // Em um app real, o ideal seria ter o endpoint na API
            
            // Re-busca todos os produtos
            const response = await fetch(`${apiUrl}/produtos`);
            const produtos = await response.json();
            return produtos.find(p => p.id == id);

        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            return null;
        }
    }

    /**
     * Requisito: Função Excluir
     */
    async function deleteProduto(id) {
        // Pede confirmação
        if (!confirm('Tem certeza que deseja excluir este produto?')) {
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/produtos/${id}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();

            if (!response.ok) {
                // Exibe a mensagem de erro da API (ex: "Produto possui movimentações")
                throw new Error(data.mensagem || 'Falha ao excluir produto.');
            }

            alert(data.mensagem); // "Produto excluído com sucesso!"
            fetchProdutos(); // Atualiza a tabela

        } catch (error) {
            console.error('Erro:', error);
            alert(error.message);
        }
    }

    /**
     * Funções do Modal (Popup)
     */
    function openModal(produto = null) {
        productForm.reset(); // Limpa o formulário
        productIdInput.value = ''; // Limpa o ID
        modalError.textContent = '';

        if (produto) {
            // Modo Edição
            modalTitle.textContent = 'Editar Produto';
            productIdInput.value = produto.id;
            document.getElementById('nome').value = produto.nome;
            document.getElementById('descricao').value = produto.descricao;
            document.getElementById('quantidade_estoque').value = produto.quantidade_estoque;
            document.getElementById('estoque_minimo').value = produto.estoque_minimo;
        } else {
            // Modo Cadastro
            modalTitle.textContent = 'Cadastrar Novo Produto';
        }
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    /**
     * Requisito: Função Inserir e Editar (Formulário)
     */
    async function handleFormSubmit(event) {
        event.preventDefault(); // Impede o recarregamento da página

        const id = productIdInput.value;
        const produtoData = {
            nome: document.getElementById('nome').value,
            descricao: document.getElementById('descricao').value,
            quantidade_estoque: parseInt(document.getElementById('quantidade_estoque').value),
            estoque_minimo: parseInt(document.getElementById('estoque_minimo').value)
        };

        // Validação simples
        if (!produtoData.nome || produtoData.estoque_minimo < 0) {
            modalError.textContent = 'Nome e Estoque Mínimo são obrigatórios.';
            return;
        }

        let url = `${apiUrl}/produtos`;
        let method = 'POST';

        // Se tem ID, é uma edição (PUT)
        if (id) {
            url = `${apiUrl}/produtos/${id}`;
            method = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produtoData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro ao salvar produto.');
            }

            alert(data.mensagem);
            closeModal();
            fetchProdutos(); // Atualiza a tabela

        } catch (error) {
            console.error('Erro:', error);
            modalError.textContent = error.message;
        }
    }

    // --- EVENT LISTENERS (Ouvintes de eventos) ---

    // Busca (keyup: a cada tecla digitada)
    searchInput.addEventListener('keyup', (e) => {
        fetchProdutos(e.target.value);
    });

    // Botão "Cadastrar Novo Produto"
    addProductBtn.addEventListener('click', () => {
        openModal(); // Abre o modal em modo "Cadastro"
    });

    // Botão de fechar o modal
    closeModalBtn.addEventListener('click', closeModal);

    // Envio do formulário (Salvar)
    productForm.addEventListener('submit', handleFormSubmit);

    // Fechar o modal se clicar fora dele
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    // --- INICIALIZAÇÃO ---
    // Carrega os produtos assim que a página é aberta
    fetchProdutos(); 
});