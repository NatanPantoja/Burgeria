// Sistema de Busca
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        // Implementar lógica de busca aqui
    });
}

// FAQ Toggle
const faqButtons = document.querySelectorAll('.faq-button');
faqButtons.forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const icon = button.querySelector('ion-icon');

        answer.classList.toggle('hidden');
        icon.setAttribute('name',
            answer.classList.contains('hidden')
                ? 'chevron-down-outline'
                : 'chevron-up-outline'
        );
    });
}); 