/**
 * formHandler.js - Manejo del formulario y validación
 */

class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.campos = this.obtenerCampos();
    }

    /**
     * Obtiene referencias a todos los campos del formulario
     */
    obtenerCampos() {
        return {
            nombre: document.getElementById('nombre'),
            telefono: document.getElementById('telefono'),
            email: document.getElementById('email'),
            fechaEntrega: document.getElementById('fechaEntrega'),
            expres: document.getElementById('expres'),
            vestuario: document.getElementById('vestuario'),
            colorCabello: document.getElementById('colorCabello'),
            detallesCabello: document.getElementById('detallesCabello'),
            colorOjos: document.getElementById('colorOjos'),
            accesorios: document.getElementById('accesorios'),
            detallesAdicionales: document.getElementById('detallesAdicionales'),
            foto: document.getElementById('foto')
        };
    }

    /**
     * Valida que los campos requeridos estén completos
     */
    validar() {
        const camposRequeridos = [
            { id: 'nombre', nombre: 'Nombre' },
            { id: 'telefono', nombre: 'Teléfono' },
            { id: 'fechaEntrega', nombre: 'Fecha de Entrega' },
            { id: 'vestuario', nombre: 'Descripción de Vestuario' },
            { id: 'colorCabello', nombre: 'Color y largo del cabello' }
        ];

        for (const campo of camposRequeridos) {
            const elemento = this.campos[campo.id];
            const valor = elemento ? elemento.value.trim() : '';
            
            if (!valor) {
                alert(`⚠️ Por favor completa: ${campo.nombre} *`);
                if (elemento) {
                    elemento.focus();
                    elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return false;
            }
        }

        return true;
    }

    /**
     * Obtiene los datos del formulario como objeto
     */
    obtenerDatos() {
        return {
            nombre: this.campos.nombre.value.trim(),
            telefono: this.campos.telefono.value.trim(),
            email: this.campos.email.value.trim(),
            fechaEntrega: this.campos.fechaEntrega.value,
            esExpres: this.campos.expres.checked,
            vestuario: this.campos.vestuario.value.trim(),
            colorCabello: this.campos.colorCabello.value.trim(),
            detallesCabello: this.campos.detallesCabello.value.trim(),
            colorOjos: this.campos.colorOjos.value.trim(),
            accesorios: this.campos.accesorios.value.trim(),
            detallesAdicionales: this.campos.detallesAdicionales.value.trim(),
            tieneFoto: this.campos.foto.files.length > 0,
            fotoBase64: this.campos.foto.dataset.base64 || null
        };
    }

    /**
     * Reinicia el formulario
     */
    reiniciar() {
        this.form.reset();
    }

    /**
     * Agrega un listener al submit del formulario
     */
    onSubmit(callback) {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            callback(this);
        });
    }
}

// Crear instancia global del manejador de formulario
const formHandler = new FormHandler('pedidoForm');
