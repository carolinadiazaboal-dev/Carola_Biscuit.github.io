/**
 * whatsappIntegration.js - Integración con WhatsApp
 */

const TIPOS_FUNKO = {
    'personalizado': 'Funko Personalizado',
    'personalizado-detalles': 'Funko Personalizado + DETALLES',
    'pareja': 'Funko Pareja Personalizadas',
    'pareja-detalles': 'Funko Pareja Personalizadas + DETALLES',
    'personaje': 'Funko de Personaje'
};

class WhatsAppIntegration {
    /**
     * Secciones del pedido como [título, valor]. Las usan el mensaje y la ventana de revisión.
     */
    static secciones(d) {
        const secciones = [];
        const agregar = (titulo, valor) => { if (valor) secciones.push([titulo, valor]); };

        agregar('TIPO DE FUNKO', TIPOS_FUNKO[d.tipoFunko]);
        agregar('PERSONAJE', d.nombrePersonaje);
        agregar('DATOS DEL CLIENTE', [
            `👤 Nombre: ${d.nombre}`,
            `📱 Teléfono: ${d.telefono}`,
            d.email && `📧 Email: ${d.email}`
        ].filter(Boolean).join('\n'));
        agregar('NOMBRE PARA LA CAJA DEL FUNKO', d.nombreCaja);
        agregar('FECHA DE ENTREGA', `${this.formatearFecha(d.fechaEntrega)}\n` + (d.esExpres
            ? `⚡ PEDIDO EXPRÉS - Recargo +$${CONFIG.PEDIDOS.recargoExpres} USD`
            : '📦 PEDIDO REGULAR (0 USD)'));
        agregar('ENTREGA DEL PEDIDO', d.esDomicilio
            ? `🚚 Servicio a Domicilio\nDirección: ${d.direccionDomicilio}`
            : '🏪 Recogida en nuestra ubicación');

        d.personas.forEach((p, i) => {
            const quien = d.personas.length > 1 ? ` - PERSONA ${i + 1}` : '';
            agregar(`VESTUARIO${quien}`, p.vestuario);
            agregar(`CABELLO${quien}`, p.colorCabello);
            agregar(`ACCESORIOS${quien}`, p.accesorios);
            agregar(`COLOR DE LA PIEL${quien}`, p.colorPiel);
            agregar(`COLOR DE OJOS${quien}`, p.colorOjos);
        });

        agregar('DETALLES ADICIONALES', d.detallesAdicionales);
        return secciones;
    }

    /**
     * Construye el mensaje para WhatsApp con los datos del formulario
     */
    static construirMensaje(datos) {
        let mensaje = `*NUEVO PEDIDO - CAROLA BISCUIT*\n\n`;
        this.secciones(datos).forEach(([titulo, valor]) => {
            mensaje += `*${titulo}*\n${valor}\n\n`;
        });

        mensaje += `*REFERENCIAS VISUALES*\n`;
        mensaje += `A continuación adjunto mis fotos de referencia (rostro, cabello, vestuario y zapatos).\n\n`;

        mensaje += `*NOTA IMPORTANTE*\n`;
        mensaje += `Todos los detalles del Funko deben ser indicados en este formulario. Los detalles que no se especifiquen al momento de realizar el pedido no podrán modificarse una vez finalizada la pieza.\n\n`;
        mensaje += `Una vez recibida toda la información, se enviará la cotización total en USD junto con los detalles del proceso de pago para iniciar tu pedido.\n\n`;
        mensaje += `En breve estaremos atendiendo su solicitud para continuar con el proceso de su pedido.\n\n`;
        mensaje += `¡Muchas gracias por su confianza!💗`;

        return mensaje;
    }

    /**
     * Formatea una fecha AAAA-MM-DD para mostrarla
     */
    static formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO + 'T00:00:00');
        return fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    /**
     * Abre WhatsApp con el mensaje. Si el navegador bloquea la ventana nueva,
     * abre en la misma pestaña (el borrador queda guardado, así que no se pierde nada).
     */
    static enviar(mensaje) {
        const url = `https://wa.me/${CONFIG.NEGOCIO.whatsappLimpio}?text=${encodeURIComponent(mensaje)}`;
        const ventana = window.open(url, '_blank');
        if (!ventana) window.location.href = url;
    }
}
