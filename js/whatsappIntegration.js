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
        mensaje += `👤 Nombre: ${datos.nombre}\n`;
        mensaje += `📱 Teléfono: ${datos.telefono}\n`;
        if (datos.email) {
            mensaje += `📧 Email: ${datos.email}\n`;
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

        // Tipo de entrega
        mensaje += `*ENTREGA DEL PEDIDO*\n`;
        if (datos.esDomicilio) {
            mensaje += `🚚 Servicio a Domicilio\n`;
            mensaje += `Dirección: ${datos.direccionDomicilio}\n`;
        } else {
            mensaje += `🏪 Recogida en nuestra ubicación\n`;
        }
        mensaje += `\n`;

        // Lógica para pareja-detalles
        if (datos.esParejadetalles) {
            // Persona 1
            mensaje += `*VESTUARIO - PERSONA 1*\n`;
            mensaje += `${datos.vestuarioPersona1}\n`;
            mensaje += `\n`;

            mensaje += `*CABELLO - PERSONA 1*\n`;
            mensaje += `${datos.colorCabelloPersona1}\n`;
            mensaje += `\n`;

            if (datos.accesoriosPersona1) {
                mensaje += `*ACCESORIOS - PERSONA 1*\n`;
                mensaje += `${datos.accesoriosPersona1}\n`;
                mensaje += `\n`;
            }

            if (datos.colorPielPersona1) {
                mensaje += `*COLOR DE LA PIEL - PERSONA 1*\n`;
                mensaje += `${datos.colorPielPersona1}\n`;
                mensaje += `\n`;
            }

            if (datos.colorOjosPersona1) {
                mensaje += `*COLOR DE OJOS - PERSONA 1*\n`;
                mensaje += `${datos.colorOjosPersona1}\n`;
                mensaje += `\n`;
            }

            // Persona 2
            mensaje += `*VESTUARIO - PERSONA 2*\n`;
            mensaje += `${datos.vestuarioPersona2}\n`;
            mensaje += `\n`;

            mensaje += `*CABELLO - PERSONA 2*\n`;
            mensaje += `${datos.colorCabelloPersona2}\n`;
            mensaje += `\n`;

            if (datos.accesoriosPersona2) {
                mensaje += `*ACCESORIOS - PERSONA 2*\n`;
                mensaje += `${datos.accesoriosPersona2}\n`;
                mensaje += `\n`;
            }

            if (datos.colorPielPersona2) {
                mensaje += `*COLOR DE LA PIEL - PERSONA 2*\n`;
                mensaje += `${datos.colorPielPersona2}\n`;
                mensaje += `\n`;
            }

            if (datos.colorOjosPersona2) {
                mensaje += `*COLOR DE OJOS - PERSONA 2*\n`;
                mensaje += `${datos.colorOjosPersona2}\n`;
                mensaje += `\n`;
            }
        } else {
            // Campos simples (para personalizado y pareja)
            mensaje += `*VESTUARIO*\n`;
            mensaje += `${datos.vestuario}\n`;
            mensaje += `\n`;

            mensaje += `*CABELLO*\n`;
            mensaje += `${datos.colorCabello}\n`;
            mensaje += `\n`;

            if (datos.accesorios) {
                mensaje += `*ACCESORIOS*\n`;
                mensaje += `${datos.accesorios}\n`;
                mensaje += `\n`;
            }

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
        mensaje += `Todos los detalles del Funko deben ser indicados en este formulario. Los detalles que no se especifiquen al momento de realizar el pedido no podrán modificarse una vez finalizada la pieza.\n`;
        mensaje += `\n`;
        mensaje += `Una vez recibida toda la información, se enviará la cotización total en USD junto con los detalles del proceso de pago para iniciar tu pedido.\n`;
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
