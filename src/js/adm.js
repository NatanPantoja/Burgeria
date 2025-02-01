// Gerenciamento de dados
let vendas = {
    dia: { total: 0, pedidos: 0 },
    semana: { total: 0, pedidos: 0 },
    mes: { total: 0, pedidos: 0 },
    ano: { total: 0, pedidos: 0 }
};

let produtos = [];
let pedidos = {
    andamento: [],
    entrega: [],
    devolucoes: []
};

// Variáveis para venda física
let itensVendaAtual = [];

// Atualizar dashboard
function atualizarDashboard() {
    document.getElementById('vendas-dia').textContent = vendas.dia.total.toFixed(2);
    document.getElementById('pedidos-dia').textContent = vendas.dia.pedidos;
    // ... atualizar outros elementos do dashboard
}

// Gerenciamento de Produtos
document.getElementById('produto-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const produto = {
        nome: document.getElementById('produto-nome').value,
        preco: parseFloat(document.getElementById('produto-preco').value),
        categoria: document.getElementById('produto-categoria').value,
        imagem: document.getElementById('produto-imagem').files[0]
    };

    // Adicionar produto à lista
    produtos.push(produto);
    atualizarListaProdutos();
    this.reset();
});

function atualizarListaProdutos() {
    const lista = document.getElementById('lista-produtos');
    lista.innerHTML = '';

    produtos.forEach((produto, index) => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-2 bg-gray-50 rounded';
        item.innerHTML = `
            <span>${produto.nome} - R$ ${produto.preco.toFixed(2)}</span>
            <div>
                <button onclick="editarProduto(${index})" class="text-blue-500 mr-2">Editar</button>
                <button onclick="removerProduto(${index})" class="text-red-500">Remover</button>
            </div>
        `;
        lista.appendChild(item);
    });
}

// Gerenciamento de Pedidos
function atualizarPedidos() {
    // Atualizar pedidos em andamento
    const pedidosAndamento = document.getElementById('pedidos-andamento');
    pedidosAndamento.innerHTML = '';

    pedidos.andamento.forEach((pedido, index) => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-2 bg-gray-50 rounded';
        item.innerHTML = `
            <div>
                <span class="font-bold">#${pedido.id}</span>
                <span>${pedido.items.join(', ')}</span>
            </div>
            <div>
                <button onclick="iniciarEntrega(${index})" class="text-green-500 mr-2">Iniciar Entrega</button>
                <button onclick="marcarDevolucao(${index})" class="text-red-500">Marcar Devolução</button>
            </div>
        `;
        pedidosAndamento.appendChild(item);
    });

    // Atualizar similar para entregas e devoluções
}

// Funções de status de pedido
function iniciarEntrega(index) {
    const pedido = pedidos.andamento.splice(index, 1)[0];
    pedidos.entrega.push(pedido);
    atualizarPedidos();
}

function marcarDevolucao(index) {
    const pedido = pedidos.andamento.splice(index, 1)[0];
    pedidos.devolucoes.push(pedido);
    atualizarPedidos();
}

// Função para carregar produtos no select
function carregarProdutosSelect() {
    const select = document.getElementById('venda-produto');
    select.innerHTML = '<option value="">Selecione um produto</option>';

    produtos.forEach((produto, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2)}`;
        select.appendChild(option);
    });
}

// Adicionar item à venda atual
document.getElementById('adicionar-item').addEventListener('click', () => {
    const produtoSelect = document.getElementById('venda-produto');
    const quantidade = parseInt(document.getElementById('venda-quantidade').value);

    if (produtoSelect.value === '' || quantidade < 1) {
        Toastify({
            text: "Selecione um produto e quantidade válida",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            style: { background: "#ff0000" },
        }).showToast();
        return;
    }

    const produto = produtos[parseInt(produtoSelect.value)];
    const item = {
        produto: produto,
        quantidade: quantidade,
        subtotal: produto.preco * quantidade
    };

    itensVendaAtual.push(item);
    atualizarItensVenda();
});

// Atualizar lista de itens da venda atual
function atualizarItensVenda() {
    const container = document.getElementById('itens-venda');
    const totalElement = document.getElementById('venda-total');
    container.innerHTML = '';

    let total = 0;

    itensVendaAtual.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'flex items-center justify-between p-2 bg-gray-50 rounded';
        itemElement.innerHTML = `
            <span>${item.produto.nome} x ${item.quantidade}</span>
            <div class="flex items-center gap-4">
                <span>R$ ${item.subtotal.toFixed(2)}</span>
                <button onclick="removerItemVenda(${index})" class="text-red-500">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(itemElement);
        total += item.subtotal;
    });

    totalElement.textContent = total.toFixed(2);
}

// Remover item da venda atual
function removerItemVenda(index) {
    itensVendaAtual.splice(index, 1);
    atualizarItensVenda();
}

// Finalizar venda física
document.getElementById('venda-fisica-form').addEventListener('submit', function (e) {
    e.preventDefault();

    if (itensVendaAtual.length === 0) {
        Toastify({
            text: "Adicione pelo menos um item à venda",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            style: { background: "#ff0000" },
        }).showToast();
        return;
    }

    // Calcular total da venda
    const total = itensVendaAtual.reduce((sum, item) => sum + item.subtotal, 0);

    // Atualizar vendas
    vendas.dia.total += total;
    vendas.dia.pedidos++;
    vendas.semana.total += total;
    vendas.semana.pedidos++;
    vendas.mes.total += total;
    vendas.mes.pedidos++;
    vendas.ano.total += total;
    vendas.ano.pedidos++;

    // Atualizar dashboard
    atualizarDashboard();

    // Limpar venda atual
    itensVendaAtual = [];
    atualizarItensVenda();

    // Feedback
    Toastify({
        text: "Venda registrada com sucesso!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        style: { background: "#4CAF50" },
    }).showToast();
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    atualizarDashboard();
    atualizarListaProdutos();
    atualizarPedidos();
    carregarProdutosSelect();
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    window.location.href = '/src/page/login.html';
}); 