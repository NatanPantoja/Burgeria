
const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartBtnMobile = document.getElementById("cart-btn-mobile");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const adressWarn = document.getElementById("address-warn");
const pickupOption = document.getElementById("pickup-option");
const addressSection = document.getElementById("address-section");

let cart = [];

// Função para verificar promoções do dia
function checkPromoDay() {
    const hoje = new Date().getDay();

    const promoSegunda = document.getElementById('promo-segunda');
    const promoQuarta = document.getElementById('promo-quarta');
    const promoSexta = document.getElementById('promo-sexta');
    const semPromo = document.getElementById('sem-promo');

    // Esconde todas as promoções
    [promoSegunda, promoQuarta, promoSexta, semPromo].forEach(promo => {
        if (promo) promo.classList.add('hidden');
    });

    // Mostra apenas a promoção do dia
    switch (hoje) {
        case 1: // Segunda
            if (promoSegunda) promoSegunda.classList.remove('hidden');
            break;
        case 3: // Quarta
            if (promoQuarta) promoQuarta.classList.remove('hidden');
            break;
        case 5: // Sexta
            if (promoSexta) promoSexta.classList.remove('hidden');
            break;
        default:
            if (semPromo) semPromo.classList.remove('hidden');
    }
}

// Função para abrir o modal do carrinho
function openCartModal() {
    updataCartModal();
    cartModal.classList.remove("hidden");
    cartModal.style.display = "flex";
}

// Evento de clique para abrir o modal (desktop e mobile)
if (cartBtn) {
    cartBtn.addEventListener("click", openCartModal);
}
if (cartBtnMobile) {
    cartBtnMobile.addEventListener("click", openCartModal);
}

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

// Fechar o modal com o botão de fechar
if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
        cartModal.style.display = "none";
    });
}

// Adicionar ao carrinho
function setupCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart-btn'); // Use uma classe comum para os botões

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));

            if (name && price) {
                addToCart(name, price);
            }
        });
    });
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updataCartModal();
    updateCartCounter();

    Toastify({
        text: "Item adicionado ao carrinho!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
            background: "#4CAF50",
        },
    }).showToast();
}

// Atualizar o modal do carrinho
function updataCartModal() {
    if (!cartItemsContainer) return;

    // Verifica se tem endereço digitado
    const hasAddress = addressInput && addressInput.value && addressInput.value !== "Retirada no local";

    cartItemsContainer.innerHTML = "";
    let subtotal = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p class="flex items-center mt-2">
                        <span class="mr-2">Qtd:</span>
                        <button class="decrement-btn px-2" data-name="${item.name}">-</button>
                        <span class="mx-2 font-bold">${item.quantity}</span>
                        <button class="increment-btn px-2" data-name="${item.name}">+</button>
                    </p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
            </div>
        `;

        subtotal += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });

    // Adiciona a taxa de entrega apenas se tiver endereço
    const deliveryFee = hasAddress ? 6.00 : 0;
    const total = subtotal + deliveryFee;

    // Atualiza o HTML do total
    if (cartTotal) {
        cartItemsContainer.innerHTML += `
            <div class="border-t pt-2 mt-2">
                <p class="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </p>
                ${hasAddress ? `
                    <p class="flex justify-between">
                        <span>Taxa de entrega:</span>
                        <span>${deliveryFee.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                    </p>
                ` : ''}
                <p class="flex justify-between font-bold text-lg mt-2">
                    <span>Total:</span>
                    <span>${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </p>
            </div>
        `;
    }
}

// Atualizar o contador do carrinho
function updateCartCounter() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCounter = document.getElementById('cart-count');
    const mobileCartCounter = document.getElementById('cart-count-mobile');

    if (cartCounter) cartCounter.textContent = count;
    if (mobileCartCounter) mobileCartCounter.textContent = count;
}

// Carregar carrinho do localStorage
function loadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updataCartModal();
        updateCartCounter();
    }
}

// Eventos de incremento/decremento
if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", function (event) {
        const name = event.target.getAttribute("data-name");

        if (event.target.classList.contains("increment-btn")) {
            const item = cart.find(item => item.name === name);
            if (item) {
                item.quantity += 1;
                localStorage.setItem("cart", JSON.stringify(cart));
                updataCartModal();
            }
        }

        if (event.target.classList.contains("decrement-btn")) {
            const item = cart.find(item => item.name === name);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            } else if (item && item.quantity === 1) {
                cart = cart.filter(i => i.name !== name);
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            updataCartModal();
        }
    });
}

// Adicionar evento para monitorar mudanças no campo de endereço
if (addressInput) {
    addressInput.addEventListener('input', function () {
        updataCartModal();
    });
}

// Configurar a opção de retirada no local
function setupPickupOption() {
    if (pickupOption && addressSection) {
        pickupOption.addEventListener('change', function () {
            if (this.checked) {
                // Quando marcar retirada no local
                addressSection.classList.add('hidden');
                addressInput.value = "Retirada no local";
                addressInput.disabled = true;
                addressInput.classList.add('bg-gray-100');
                addressWarn.classList.add('hidden');
                addressInput.classList.remove('border-red-500');
            } else {
                // Quando desmarcar retirada no local
                addressSection.classList.remove('hidden');
                addressInput.value = "";
                addressInput.disabled = false;
                addressInput.classList.remove('bg-gray-100');
            }
            updataCartModal();
        });
    }
}

// Verificar horário de funcionamento
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    const minutos = data.getMinutes();

    // Define o horário de funcionamento (18:00 às 23:30)
    const horaAbertura = 18;
    const horaFechamento = 23;
    const minutoFechamento = 30;

    // Verifica se está dentro do horário
    return (hora > horaAbertura || (hora === horaAbertura && minutos >= 0)) &&
        (hora < horaFechamento || (hora === horaFechamento && minutos < minutoFechamento));
}

// Atualizar visual do horário
function updateRestaurantStatus() {
    const spanItem = document.getElementById("date-span");
    if (spanItem) {
        const isOpen = checkRestaurantOpen();
        if (isOpen) {
            spanItem.classList.remove("bg-red-500");
            spanItem.classList.add("bg-green-600");
        } else {
            spanItem.classList.remove("bg-green-600");
            spanItem.classList.add("bg-red-500");
        }
    }
}

// Evento de checkout
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function (e) {
        if (!checkRestaurantOpen()) {
            e.preventDefault();
            Toastify({
                text: "Desculpe, estamos fechados no momento. Horário de funcionamento: 18:00 às 23:30",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "#ff0000",
                },
            }).showToast();
            return;
        }

        if (cart.length === 0) {
            Toastify({
                text: "Carrinho vazio!",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "#ff0000",
                },
            }).showToast();
            return;
        }

        // Verifica endereço apenas se não for retirada no local
        if (!pickupOption.checked && !addressInput.value) {
            addressWarn.classList.remove("hidden");
            addressInput.classList.add("border-red-500");
            return;
        }

        const cartItems = cart.map(item =>
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(2)}`
        ).join('\n');

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = (!pickupOption.checked && addressInput.value) ? 6.00 : 0;
        const total = subtotal + deliveryFee;
        const deliveryType = pickupOption.checked ? "Retirada no local" : `Entregar em: ${addressInput.value}`;

        const message = encodeURIComponent(
            `Pedido:\n${cartItems}\n\nSubtotal: R$${subtotal.toFixed(2)}` +
            (deliveryFee > 0 ? `\nTaxa de entrega: R$${deliveryFee.toFixed(2)}` : '') +
            `\nTotal: R$${total.toFixed(2)}` +
            `\n\n${deliveryType}`
        );

        window.open(`https://wa.me/61981500971?text=${message}`, '_blank');

        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updataCartModal();
        updateCartCounter();
        cartModal.style.display = "none";
    });
}

// Função de busca no menu
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        const menuItems = document.querySelectorAll('#menu article');

        menuItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();

            // Verifica se o termo de busca está no título ou na descrição
            const matches = title.includes(searchTerm) || description.includes(searchTerm);

            // Mostra ou esconde o item
            item.style.display = matches ? 'flex' : 'none';
        });

        // Mostra mensagem quando não encontrar resultados
        const hasVisibleItems = Array.from(menuItems).some(item => item.style.display !== 'none');
        const noResultsMsg = document.getElementById('no-results');

        if (!hasVisibleItems) {
            if (!noResultsMsg) {
                const msg = document.createElement('div');
                msg.id = 'no-results';
                msg.className = 'text-center py-8 w-full';
                msg.innerHTML = `
                    <p class="text-gray-500 text-lg">Nenhum item encontrado para "${searchTerm}"</p>
                `;
                menuItems[0].parentNode.insertBefore(msg, menuItems[0]);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    });
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    setupCartButtons();
    setupPickupOption();
    updateRestaurantStatus();
    checkPromoDay();
    setupSearch();
});


//Função do menu mobile
function onToggleMenu(icon) {
    const navLinks = document.querySelector('.nav-links');
    const mainLogo = document.querySelector('.logo-link');

    if (!navLinks) return;

    if (icon.name === 'menu') {
        // Abre o menu
        icon.name = 'close';
        navLinks.style.left = '0';
        document.body.style.overflow = 'hidden';
        if (mainLogo) mainLogo.style.opacity = '0';
    } else {
        // Fecha o menu
        icon.name = 'menu';
        navLinks.style.left = '-100%';
        document.body.style.overflow = '';
        if (mainLogo) mainLogo.style.opacity = '1';
    }
}

// Fechar menu ao clicar em um link
document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('.nav-links a');
    const menuIcon = document.querySelector('ion-icon[name="menu"]');

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuIcon && menuIcon.name === 'close') {
                onToggleMenu(menuIcon);
            }
        });
    });
});

// Adicione este código para sincronizar os contadores do carrinho
function updateMobileCartCount() {
    const mobileCount = document.getElementById('cart-count-mobile');
    const desktopCount = document.getElementById('cart-count');
    if (mobileCount && desktopCount) {
        mobileCount.textContent = desktopCount.textContent;
    }
}

// Referências globais para evitar repetição
const cadastroForm = document.getElementById('CadastroSite');
const loginForm = document.getElementById('EntrarPainel');
const indicador = document.getElementById('Indicador');

// Alterna para o formulário de cadastro
function Cadastro() {
    if (cadastroForm && loginForm && indicador) {
        cadastroForm.style.transform = 'translateX(0)';
        loginForm.style.transform = 'translateX(-100%)';
        indicador.style.transform = 'translateX(100%)';
    }
}

// Alterna para o formulário de login
function Entrar() {
    if (cadastroForm && loginForm && indicador) {
        cadastroForm.style.transform = 'translateX(100%)';
        loginForm.style.transform = 'translateX(0)';
        indicador.style.transform = 'translateX(0)';
    }
}

// Formulário de Login
document.getElementById("EntrarPainel").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.querySelector('input[type="email"]').value;
    const senha = document.querySelector('input[type="password"]').value;

    if (email === "primerburgeria@gmail.com" && senha === "burgeria123") {
        alert("Login efetuado com sucesso!");
        window.location.href = "adm.html";
    } else {
        alert("Email ou senha incorretos!");
    }
});

// Formulário de Cadastro
document.getElementById("CadastroSite").addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = this.querySelector('input[name="nome"]').value;
    const email = this.querySelector('input[name="email"]').value;
    const senha = this.querySelector('input[name="senha"]').value;

    if (nome && email && senha) {
        alert("Cadastro realizado com sucesso!");
        this.reset();
    } else {
        alert("Por favor, preencha todos os campos!");
    }
});
