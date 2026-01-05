/**
 * whatsappIntegration.js - Integración con WhatsApp
 */

class WhatsAppIntegration {
    /**
     * Construye el mensaje para WhatsApp con los datos del formulario
     */
    static construirMensaje(datos) {
        let mensaje = `*NUEVO PEDIDO - CAROLA BISCUIT*\n\n`;

        mensaje += `*DATOS DEL CLIENTE*\n`;
        mensaje += `Nombre: ${datos.nombre}\n`;
        mensaje += `Teléfono: ${datos.telefono}\n`;
        if (datos.email) {
            mensaje += `Email: ${datos.email}\n`;
        }
        mensaje += `\n`;

        mensaje += `*FECHA DE ENTREGA*\n`;
        mensaje += `${this.formatearFecha(datos.fechaEntrega)}\n`;
        if (datos.esExpres) {
            mensaje += `PEDIDO EXPRES - Recargo +$15 USD\n`;
        }
        mensaje += `\n`;

        mensaje += `*VESTUARIO*\n`;
        mensaje += `${datos.vestuario}\n`;
        mensaje += `\n`;

        mensaje += `*CABELLO*\n`;
        mensaje += `Color y largo: ${datos.colorCabello}\n`;
        if (datos.detallesCabello) {
            mensaje += `Detalles: ${datos.detallesCabello}\n`;
        }
        mensaje += `\n`;

        if (datos.colorOjos) {
            mensaje += `*COLOR DE OJOS*\n`;
            mensaje += `${datos.colorOjos}\n`;
            mensaje += `\n`;
        }

        if (datos.accesorios) {
            mensaje += `*ACCESORIOS*\n`;
            mensaje += `${datos.accesorios}\n`;
            mensaje += `\n`;
        }

        if (datos.detallesAdicionales) {
            mensaje += `*DETALLES ADICIONALES*\n`;
            mensaje += `${datos.detallesAdicionales}\n`;
            mensaje += `\n`;
        }

        mensaje += `*FOTO DE REFERENCIA*\n`;
        mensaje += `${datos.tieneFoto ? 'Si - Adjunta la foto en el siguiente mensaje' : 'No - Se utilizara creatividad artistico'}\n`;
        mensaje += `\n`;

        mensaje += `*PROXIMOS PASOS*\n`;
        mensaje += `1. Se enviara cotizacion en USD\n`;
        mensaje += `2. Pago anticipado: $${CONFIG.PEDIDOS.deposito} USD\n`;
        mensaje += `3. Saldo en entrega\n`;
        mensaje += `\n`;

        mensaje += `*NOTA IMPORTANTE*\n`;
        mensaje += `Si algun detalle no se menciona en este formulario, sera realizado con mi creatividad y estilo artistico.\n`;
        mensaje += `Cambios posteriores solo se haran si hubo un error respecto a lo indicado en este formulario.\n`;
        mensaje += `\n`;

        mensaje += `¡Gracias por tu confianza!\n`;
        mensaje += `\n`;
        mensaje += `*Por favor espere ser atendido*`;

        return mensaje;
    }

    /**
     * Formatea la fecha para mostrar en el mensaje
     */
    static formatearFecha(fechaISO) {
        const opciones = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const fecha = new Date(fechaISO + 'T00:00:00');
        return fecha.toLocaleDateString('es-ES', opciones);
    }

    /**
     * Abre WhatsApp con el mensaje pre-llenado
     */
    static enviar(mensaje) {
        const numeroLimpio = CONFIG.NEGOCIO.whatsappLimpio;
        const mensajeCodificado = encodeURIComponent(mensaje);
        const url = `https://wa.me/${numeroLimpio}?text=${mensajeCodificado}`;
        
        try {
            window.open(url, '_blank');
            return true;
        } catch (error) {
            console.error('Error al abrir WhatsApp:', error);
            alert(CONFIG.MENSAJES.errorWhatsApp);
            return false;
        }
    }

    /**
     * Envía mensaje y maneja la respuesta
     */
    static procesarPedido(datos) {
        if (!this.validarDatos(datos)) {
            return false;
        }

        const mensaje = this.construirMensaje(datos);
        return this.enviar(mensaje);
    }

    /**
     * Valida datos básicos antes de enviar
     */
    static validarDatos(datos) {
        if (!datos.nombre || !datos.telefono || !datos.fechaEntrega) {
            console.error('Datos inválidos:', datos);
            alert(CONFIG.MENSAJES.error);
            return false;
        }
        return true;
    }
}
