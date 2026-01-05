/**
 * whatsappIntegration.js - Integración con WhatsApp
 */

class WhatsAppIntegration {
    /**
     * Construye el mensaje para WhatsApp con los datos del formulario
     */
    static construirMensaje(datos) {
        let mensaje = `*NUEVO PEDIDO - CAROLA BISCUIT*\n\n`;

        mensaje += `*TIPO DE FUNKO*\n`;
        const tiposDispuesta = {
            'personalizado': 'Funko Personalizado',
            'personalizado-detalles': 'Funko Personalizado + DETALLES',
            'pareja': 'Funko Pareja Personalizadas',
            'pareja-detalles': 'Funko Pareja Personalizadas + DETALLES',
            'personaje': 'Funko de Personaje'
        };
        mensaje += `${tiposDispuesta[datos.tipoFunko]}\n`;
        mensaje += `\n`;

        if (datos.tipoFunko === 'personaje' && datos.nombrePersonaje) {
            mensaje += `*PERSONAJE*\n`;
            mensaje += `${datos.nombrePersonaje}\n`;
            mensaje += `\n`;
        }

        mensaje += `*DATOS DEL CLIENTE*\n`;
        mensaje += `Nombre: ${datos.nombre}\n`;
        mensaje += `Teléfono: ${datos.telefono}\n`;
        if (datos.email) {
            mensaje += `Email: ${datos.email}\n`;
        }
        mensaje += `\n`;

        if (datos.nombreCaja) {
            mensaje += `*NOMBRE PARA LA CAJA DEL FUNKO*\n`;
            mensaje += `${datos.nombreCaja}\n`;
            mensaje += `\n`;
        }

        mensaje += `*FECHA DE ENTREGA*\n`;
        mensaje += `${this.formatearFecha(datos.fechaEntrega)}\n`;
        if (datos.tipoPedido === 'expres') {
            mensaje += `⚡ PEDIDO EXPRÉS - Recargo +$15 USD\n`;
        } else {
            mensaje += `📦 PEDIDO REGULAR (0 USD)\n`;
        }
        mensaje += `\n`;

        if (datos.tieneDomicilio) {
            mensaje += `*SERVICIO A DOMICILIO*\n`;
            mensaje += `${datos.direccionDomicilio}\n`;
            mensaje += `\n`;
        }

        mensaje += `*VESTUARIO*\n`;
        mensaje += `${datos.vestuario}\n`;
        mensaje += `\n`;

        mensaje += `*CABELLO*\n`;
        mensaje += `${datos.colorCabello}\n`;
        mensaje += `\n`;

        if (datos.colorPiel) {
            mensaje += `*COLOR DE LA PIEL*\n`;
            mensaje += `${datos.colorPiel}\n`;
            mensaje += `\n`;
        }

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

        mensaje += `*FOTOGRAFÍA PARA LA CAJA*\n`;
        mensaje += `Por favor, envía una foto en buena calidad para la personalización de la caja del Funko Pop.\n`;
        mensaje += `\n`;

        mensaje += `*NOTA IMPORTANTE*\n`;
        mensaje += `Si algun detalle no se menciona en este formulario, sera realizado con mi creatividad y estilo artistico.\n`;
        mensaje += `Cambios posteriores solo se haran si hubo un error respecto a lo indicado en este formulario.\n`;
        mensaje += `\n`;

        mensaje += `En breve estaremos atendiendo su solicitud para continuar con el proceso de su pedido.\n`;
        mensaje += `\n`;
        mensaje += `¡Muchas gracias por su confianza!💗`;

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
