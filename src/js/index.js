// Verificar a hora atual e manipular o card horário
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    const minutos = data.getMinutes();

    // Define o horário de funcionamento
    const horaAbertura = 18;
    const horaFechamento = 23;
    const minutoFechamento = 30;

    // Verifica se está dentro do horário de funcionamento
    const isOpen = (hora > horaAbertura || (hora === horaAbertura && minutos >= 0)) &&
        (hora < horaFechamento || (hora === horaFechamento && minutos < minutoFechamento));

    // Atualiza o visual do indicador
    const spanItem = document.getElementById("date-span");
    if (spanItem) {
        spanItem.classList.toggle("bg-green-600", isOpen);
        spanItem.classList.toggle("bg-red-500", !isOpen);
    }

    return isOpen;
}

// Atualiza o status a cada minuto
setInterval(checkRestaurantOpen, 60000);

// MENU CELULAR
const navLinks = document.querySelector('.nav-links');

