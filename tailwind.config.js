module.exports = {
    theme: {
        extend: {
            colors: {
                'prime': {
                    'red': '#ea3624',      // Cor principal
                    'gold': '#ff9c00',     // Cor secundária
                    'brown': '#3D2C24',    // Cor para textos
                    'cream': '#f5ccb1',    // Cor de fundo
                    'gray': '#B0B0B0'      // Cor neutra
                }
            },
            fontFamily: {
                'display': ['Oswald', 'sans-serif'],     // Para títulos
                'body': ['Roboto', 'sans-serif']         // Para textos
            },
            backgroundImage: {
                'pattern': "url('/src/img/pattern.png')",
                'home': "url('/src/img/fundo.png')"
            }
        }
    }
} 