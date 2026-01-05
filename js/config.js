/**
 * config.js - Configuración centralizada de la aplicación
 */

const CONFIG = {
    // Información del negocio
    NEGOCIO: {
        nombre: 'Carola Biscuit',
        whatsapp: '+53 56145486',
        whatsappLimpio: '5356145486', // Sin símbolos para WhatsApp API
        pais: 'Cuba'
    },

    // Configuración de pedidos
    PEDIDOS: {
        diasMinimos: 20,
        diasMaximos: 30,
        recargExpress: 15, // USD
        deposito: 5 // USD
    },

    // Mensajes
    MENSAJES: {
        exito: 'Tu pedido ha sido enviado correctamente',
        error: 'Por favor, completa todos los campos requeridos (*)',
        errorWhatsApp: 'No se pudo abrir WhatsApp. Intenta nuevamente o contacta directamente.'
    }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
