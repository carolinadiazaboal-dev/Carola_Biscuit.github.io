/**
 * main.js - Punto de entrada principal de la aplicación
 */

document.addEventListener('DOMContentLoaded', () => {
    configurarFechas();
    if (Borrador.restaurar()) {
        mostrarToast('💾 Recuperamos tu pedido sin terminar');
    }
    formHandler.actualizarProgreso();

    formHandler.form.addEventListener('input', () => Borrador.guardar());
    formHandler.form.addEventListener('change', () => Borrador.guardar());

    formHandler.onSubmit((form) => {
        if (form.validar()) {
            Revision.abrir(form.obtenerDatos());
        } else {
            mostrarToast('Revisa los campos marcados en rojo', 'error');
        }
    });

    Revision.init();
});

/**
 * Fecha local en formato AAAA-MM-DD (toISOString usa UTC y puede correrse un día)
 */
function fechaISO(fecha) {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/**
 * Fecha mínima según el tipo de pedido (regular o exprés)
 */
function configurarFechas() {
    const input = document.getElementById('fechaEntrega');
    const texto = document.getElementById('textoFecha');
    const { diasRegular, diasExpres, recargoExpres } = CONFIG.PEDIDOS;

    function actualizar() {
        const expres = formHandler.valorRadio('tipoPedido') === 'expres';
        const dias = expres ? diasExpres : diasRegular;
        const minima = new Date();
        minima.setDate(minima.getDate() + dias);
        input.min = fechaISO(minima);

        texto.textContent = expres
            ? `⚡ Pedido Exprés: mínimo ${dias} días desde hoy (+${recargoExpres} USD)`
            : `📦 Pedido Regular: mínimo ${dias} días desde hoy`;

        if (input.value && input.value < input.min) {
            mostrarToast(`📅 Ajustamos la fecha al mínimo: ${WhatsAppIntegration.formatearFecha(input.min)}`);
        }
        if (!input.value || input.value < input.min) input.value = input.min;
        formHandler.actualizarProgreso();
    }

    document.querySelectorAll('input[name="tipoPedido"]').forEach(r => r.addEventListener('change', actualizar));
    input.addEventListener('change', () => {
        if (input.value && input.value < input.min) actualizar();
    });
    formHandler.form.addEventListener('reset', () => setTimeout(actualizar));
    actualizar();
}

/**
 * Borrador automático en el navegador: si se recarga la página o WhatsApp
 * no abre, el cliente no pierde lo que escribió.
 */
const Borrador = {
    guardar() {
        const datos = {};
        formHandler.form.querySelectorAll('input[name], textarea[name]').forEach(el => {
            if (el.type !== 'radio') datos[el.name] = el.value;
            else if (el.checked) datos[el.name] = el.value;
        });
        try { localStorage.setItem(CONFIG.BORRADOR_KEY, JSON.stringify(datos)); } catch (e) { /* almacenamiento no disponible */ }
    },

    restaurar() {
        let datos = null;
        try { datos = JSON.parse(localStorage.getItem(CONFIG.BORRADOR_KEY)); } catch (e) { /* sin borrador */ }
        if (!datos) return false;

        const form = formHandler.form;
        Object.entries(datos).forEach(([name, valor]) => {
            form.querySelectorAll(`[name="${CSS.escape(name)}"]`).forEach(el => {
                if (el.type === 'radio') el.checked = el.value === valor;
                else el.value = valor;
            });
        });
        // Vuelve a mostrar las secciones condicionales de lo restaurado
        form.querySelectorAll('input[type="radio"]:checked').forEach(r => {
            r.dispatchEvent(new Event('change', { bubbles: true }));
        });
        return !!(datos.nombre || datos.telefono || datos.vestuario);
    },

    borrar() {
        try { localStorage.removeItem(CONFIG.BORRADOR_KEY); } catch (e) { /* almacenamiento no disponible */ }
    }
};

/**
 * Ventana "Revisa tu pedido" antes de enviar, y confirmación después
 */
const Revision = {
    init() {
        this.dialog = document.getElementById('revision');
        this.dialog.addEventListener('click', (e) => {
            if (e.target === this.dialog) this.dialog.close(); // clic en el fondo
            const accion = e.target.closest('[data-accion]')?.dataset.accion;
            if (accion) this[accion]();
        });
    },

    paso(nombre) {
        this.dialog.querySelectorAll('[data-paso]').forEach(p => { p.hidden = p.dataset.paso !== nombre; });
    },

    abrir(datos) {
        this.mensaje = WhatsAppIntegration.construirMensaje(datos);

        const resumen = document.getElementById('revisionResumen');
        resumen.replaceChildren();
        WhatsAppIntegration.secciones(datos).forEach(([titulo, valor]) => {
            const dt = document.createElement('dt');
            const dd = document.createElement('dd');
            dt.textContent = titulo;
            dd.textContent = valor;
            resumen.append(dt, dd);
        });

        const costos = ['💗 Precio del Funko: se cotiza según los detalles'];
        if (datos.esExpres) costos.push(`⚡ Recargo exprés: +${CONFIG.PEDIDOS.recargoExpres} USD`);
        if (datos.esDomicilio) costos.push('🚚 Envío a domicilio: se confirma por WhatsApp');
        const lista = document.getElementById('revisionCostos');
        lista.replaceChildren(...costos.map(c => Object.assign(document.createElement('li'), { textContent: c })));

        this.paso('revisar');
        this.dialog.showModal();
    },

    editar() { this.dialog.close(); },

    confirmar() {
        WhatsAppIntegration.enviar(this.mensaje);
        this.paso('enviado');
    },

    reabrir() { WhatsAppIntegration.enviar(this.mensaje); },

    nuevo() {
        Borrador.borrar();
        formHandler.form.reset();
        formHandler.limpiarErrores();
        setTimeout(() => {
            formHandler.form.querySelectorAll('input[type="radio"]:checked').forEach(r => {
                r.dispatchEvent(new Event('change', { bubbles: true }));
            });
            formHandler.actualizarSecciones();
        });
        this.dialog.close();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

/**
 * Aviso temporal en pantalla
 */
function mostrarToast(mensaje, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.setAttribute('role', 'status');
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('saliendo'), 3500);
    setTimeout(() => toast.remove(), 4000);
}

/**
 * Efectos visuales: aparición al hacer scroll y spotlight que sigue al cursor
 */
document.addEventListener('DOMContentLoaded', () => {
    const tarjetas = document.querySelectorAll('.seccion, .referencias-visuales');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        tarjetas.forEach(tarjeta => {
            tarjeta.classList.add('reveal');
            observer.observe(tarjeta);
        });
    }

    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('pointermove', (e) => {
            const rect = tarjeta.getBoundingClientRect();
            tarjeta.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            tarjeta.style.setProperty('--my', `${e.clientY - rect.top}px`);
        });
    });
});
