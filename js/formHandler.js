/**
 * formHandler.js - Campos condicionales, validación, progreso y datos del formulario
 */

const TIPOS_PAREJA = ['pareja', 'pareja-detalles'];
const TIPOS_CON_DETALLES = ['personalizado-detalles', 'pareja-detalles', 'personaje'];

// Radios de color → [sección del texto personalizado, input del texto personalizado]
const COLORES_PERSONALIZABLES = {
    colorPiel: ['seccionPielPersonalizada', 'pielPersonalizadaTexto'],
    colorOjos: ['seccionOjoPersonalizado', 'ojoPersonalizadoTexto']
};

class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.crearPersona2();

        this.form.addEventListener('change', (e) => this.alCambiar(e));
        ['input', 'change'].forEach(evento => this.form.addEventListener(evento, (e) => {
            this.limpiarError(e.target);
            this.actualizarProgreso();
        }));

        this.actualizarSecciones();
    }

    campo(id) { return document.getElementById(id); }
    texto(id) { const el = this.campo(id); return el ? el.value.trim() : ''; }

    valorRadio(name) {
        const radio = this.form.querySelector(`input[name="${name}"]:checked`);
        return radio ? radio.value : '';
    }

    get tipoFunko() { return this.valorRadio('tipoFunko'); }
    get esPareja() { return TIPOS_PAREJA.includes(this.tipoFunko); }

    mostrar(id, visible) {
        const el = this.campo(id);
        if (el) el.hidden = !visible;
    }

    /**
     * Duplica el bloque de "Persona 1" para los Funko pareja.
     * Los ids, names y referencias de la copia llevan el sufijo _2.
     */
    crearPersona2() {
        const persona1 = this.campo('persona1');
        const persona2 = persona1.cloneNode(true);
        persona2.id = 'persona2';
        persona2.querySelectorAll('[id]').forEach(el => { el.id += '_2'; });
        persona2.querySelectorAll('[for]').forEach(el => { el.htmlFor += '_2'; });
        persona2.querySelectorAll('[name]').forEach(el => { el.name += '_2'; });
        persona2.querySelectorAll('[aria-labelledby]').forEach(el => {
            el.setAttribute('aria-labelledby', el.getAttribute('aria-labelledby') + '_2');
        });
        persona2.querySelector('.persona-titulo').textContent = '👤 Persona 2';
        persona1.after(persona2);
    }

    /**
     * Muestra u oculta campos según lo que se elige
     */
    alCambiar(e) {
        const { name, value } = e.target;
        const porUsuario = e.isTrusted; // al restaurar el borrador no movemos el foco

        if (name === 'tipoFunko') this.actualizarSecciones();

        if (name === 'tipoEntrega') {
            this.mostrar('seccionDireccion', value === 'domicilio');
            if (value === 'domicilio' && porUsuario) this.campo('direccionDomicilio').focus();
        }

        const base = name.replace(/_2$/, '');
        const sufijo = name.slice(base.length);
        if (COLORES_PERSONALIZABLES[base]) {
            const [seccion, input] = COLORES_PERSONALIZABLES[base];
            const personalizado = value === 'personalizado';
            this.mostrar(seccion + sufijo, personalizado);
            if (personalizado && porUsuario) this.campo(input + sufijo).focus();
        }
    }

    actualizarSecciones() {
        const tipo = this.tipoFunko;
        const personaje = tipo === 'personaje';

        this.form.dataset.tipo = tipo;
        this.form.classList.toggle('es-pareja', this.esPareja);
        this.mostrar('avisoPareja', this.esPareja);
        this.mostrar('persona2', this.esPareja);
        this.mostrar('seccionPersonaje', personaje);
        this.mostrar('seccionDetalles', TIPOS_CON_DETALLES.includes(tipo));
        ['', '_2'].forEach(s => {
            this.mostrar('seccionColorPiel' + s, !personaje);
            this.mostrar('seccionColorOjos' + s, !personaje);
        });
        this.actualizarProgreso();
    }

    /**
     * Reglas de validación según el estado actual del formulario.
     * Las marcadas como opcionales no cuentan para el progreso.
     */
    reglas() {
        const reglas = [];
        const requerido = (id, msg) => reglas.push({ el: this.campo(id), ok: !!this.texto(id), msg });

        reglas.push({
            el: this.form.querySelector('.funko-type-wrapper'),
            ok: !!this.tipoFunko,
            msg: 'Elige el tipo de Funko'
        });

        requerido('nombre', 'Escribe tu nombre');

        const digitos = this.texto('telefono').replace(/\D/g, '').length;
        reglas.push({
            el: this.campo('telefono'),
            ok: digitos >= 8,
            msg: digitos ? 'El teléfono debe tener al menos 8 dígitos' : 'Escribe tu teléfono'
        });

        const email = this.texto('email');
        if (email) {
            reglas.push({
                el: this.campo('email'),
                ok: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
                msg: 'El email no parece válido',
                opcional: true
            });
        }

        const fecha = this.campo('fechaEntrega');
        reglas.push({
            el: fecha,
            ok: !!fecha.value && fecha.value >= fecha.min,
            msg: `La fecha mínima es ${WhatsAppIntegration.formatearFecha(fecha.min)}`
        });

        if (this.tipoFunko === 'personaje') {
            requerido('nombrePersonaje', 'Escribe el nombre del personaje');
        } else {
            const personas = this.esPareja ? ['', '_2'] : [''];
            personas.forEach(s => {
                const quien = this.esPareja ? ` (Persona ${s ? 2 : 1})` : '';
                requerido('vestuario' + s, 'Describe el vestuario' + quien);
                requerido('colorCabello' + s, 'Describe el cabello' + quien);
                if (this.valorRadio('colorPiel' + s) === 'personalizado') {
                    requerido('pielPersonalizadaTexto' + s, 'Indica el color de piel' + quien);
                }
                if (this.valorRadio('colorOjos' + s) === 'personalizado') {
                    requerido('ojoPersonalizadoTexto' + s, 'Indica el color de ojos' + quien);
                }
            });
        }

        if (this.valorRadio('tipoEntrega') === 'domicilio') {
            requerido('direccionDomicilio', 'Escribe la dirección de entrega');
        }

        return reglas;
    }

    /**
     * Marca los errores junto a cada campo y lleva al primero
     */
    validar() {
        this.limpiarErrores();
        const fallos = this.reglas().filter(r => !r.ok);
        fallos.forEach(f => this.marcarError(f.el, f.msg));

        if (fallos.length) {
            const primero = fallos[0].el;
            primero.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (primero.matches('input, textarea')) primero.focus({ preventScroll: true });
        }
        return fallos.length === 0;
    }

    marcarError(el, msg) {
        const grupo = el.closest('.form-group') || el;
        const error = document.createElement('p');
        error.className = 'field-error';
        error.id = `${el.id || 'tipoFunko'}-error`;
        error.textContent = msg;
        grupo.classList.add('has-error');
        grupo.appendChild(error);
        el.setAttribute('aria-invalid', 'true');
        el.setAttribute('aria-describedby', error.id);
    }

    limpiarError(el) {
        const grupo = el.closest && el.closest('.has-error');
        if (!grupo) return;
        grupo.classList.remove('has-error');
        grupo.querySelector('.field-error')?.remove();
        grupo.querySelectorAll('[aria-invalid]').forEach(c => {
            c.removeAttribute('aria-invalid');
            c.removeAttribute('aria-describedby');
        });
    }

    limpiarErrores() {
        this.form.querySelectorAll('.has-error').forEach(g => this.limpiarError(g));
    }

    actualizarProgreso() {
        const reglas = this.reglas().filter(r => !r.opcional);
        const pct = Math.round(reglas.filter(r => r.ok).length / reglas.length * 100);
        this.campo('progressFill').style.width = pct + '%';
        this.campo('progressPercent').textContent = pct;
    }

    /**
     * Obtiene los datos del formulario como objeto
     */
    obtenerDatos() {
        const tipo = this.tipoFunko;
        const personaje = tipo === 'personaje';
        const color = (name, textoId, s) => {
            if (personaje) return '';
            const valor = this.valorRadio(name + s);
            return valor === 'personalizado' ? this.texto(textoId + s) : valor;
        };
        const persona = (s) => ({
            vestuario: this.texto('vestuario' + s),
            colorCabello: this.texto('colorCabello' + s),
            accesorios: this.texto('accesorios' + s),
            colorPiel: color('colorPiel', 'pielPersonalizadaTexto', s),
            colorOjos: color('colorOjos', 'ojoPersonalizadoTexto', s)
        });
        const esExpres = this.valorRadio('tipoPedido') === 'expres';
        const esDomicilio = this.valorRadio('tipoEntrega') === 'domicilio';

        return {
            tipoFunko: tipo,
            nombrePersonaje: personaje ? this.texto('nombrePersonaje') : '',
            nombre: this.texto('nombre'),
            telefono: this.texto('telefono'),
            email: this.texto('email'),
            nombreCaja: this.texto('nombreCaja'),
            fechaEntrega: this.campo('fechaEntrega').value,
            esExpres,
            esDomicilio,
            direccionDomicilio: esDomicilio ? this.texto('direccionDomicilio') : '',
            personas: this.esPareja ? [persona(''), persona('_2')] : [persona('')],
            detallesAdicionales: TIPOS_CON_DETALLES.includes(tipo) ? this.texto('detallesAdicionales') : ''
        };
    }

    onSubmit(callback) {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            callback(this);
        });
    }
}

const formHandler = new FormHandler('pedidoForm');
