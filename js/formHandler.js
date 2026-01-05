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
            tipoFunko: document.getElementById('tipoFunko'),
            nombrePersonaje: document.getElementById('nombrePersonaje'),
            nombre: document.getElementById('nombre'),
            telefono: document.getElementById('telefono'),
            email: document.getElementById('email'),
            nombreCaja: document.getElementById('nombreCaja'),
            fechaEntrega: document.getElementById('fechaEntrega'),
            expres: document.getElementById('expres'),
            domicilio: document.getElementById('domicilio'),
            vestuario: document.getElementById('vestuario'),
            colorCabello: document.getElementById('colorCabello'),
            detallesCabello: document.getElementById('detallesCabello'),
            colorOjos: document.getElementById('colorOjos'),
            accesorios: document.getElementById('accesorios'),
            detallesAdicionales: document.getElementById('detallesAdicionales')
        };
    }

    /**
     * Valida que los campos requeridos estén completos
     */
    validar() {
        const camposRequeridos = [
            { id: 'tipoFunko', nombre: 'Tipo de Funko' },
            { id: 'nombre', nombre: 'Nombre' },
            { id: 'telefono', nombre: 'Teléfono' },
            { id: 'fechaEntrega', nombre: 'Fecha de Entrega' },
            { id: 'vestuario', nombre: 'Descripción de Vestuario' },
            { id: 'colorCabello', nombre: 'Color y largo del cabello' }
        ];

        // Validación especial para nombre del personaje si es personaje
        const tipoFunko = this.campos.tipoFunko.value;
        if (tipoFunko === 'personaje') {
            camposRequeridos.push({ id: 'nombrePersonaje', nombre: 'Nombre del Personaje' });
        }

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
            tipoFunko: this.campos.tipoFunko.value,
            nombrePersonaje: this.campos.nombrePersonaje.value.trim(),
            nombre: this.campos.nombre.value.trim(),
            telefono: this.campos.telefono.value.trim(),
            email: this.campos.email.value.trim(),
            nombreCaja: this.campos.nombreCaja.value.trim(),
            fechaEntrega: this.campos.fechaEntrega.value,
            esExpres: this.campos.expres.checked,
            domicilio: this.campos.domicilio.value.trim(),
            vestuario: this.campos.vestuario.value.trim(),
            colorCabello: this.campos.colorCabello.value.trim(),
            detallesCabello: this.campos.detallesCabello.value.trim(),
            colorOjos: this.campos.colorOjos.value.trim(),
            accesorios: this.campos.accesorios.value.trim(),
            detallesAdicionales: this.campos.detallesAdicionales.value.trim()
        };
    }

    /**
     * Reinicia el formulario
     */
    reiniciar() {
        this.form.reset();
        this.mostrarOcultarCamposCondicionales();
    }

    /**
     * Muestra u oculta campos según el tipo de funko seleccionado
     */
    mostrarOcultarCamposCondicionales() {
        const tipoFunko = this.campos.tipoFunko.value;
        const seccionPersonaje = document.getElementById('seccionPersonaje');
        const seccionDetalles = document.getElementById('seccionDetalles');
        const campoNombre = this.campos.nombre;

        // Mostrar/ocultar sección de personaje
        if (tipoFunko === 'personaje') {
            seccionPersonaje.style.display = 'block';
            campoNombre.parentElement.style.display = 'none';
        } else {
            seccionPersonaje.style.display = 'none';
            campoNombre.parentElement.style.display = 'block';
        }

        // Mostrar/ocultar sección de detalles adicionales
        if (tipoFunko === 'personalizado-detalles' || tipoFunko === 'pareja-detalles' || tipoFunko === 'personaje') {
            seccionDetalles.style.display = 'block';
        } else {
            seccionDetalles.style.display = 'none';
        }
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

// Manejar cambios en el dropdown de tipo de funko
document.getElementById('tipoFunko').addEventListener('change', () => {
    formHandler.mostrarOcultarCamposCondicionales();
});

// Mostrar/ocultar campos condicionales al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    formHandler.mostrarOcultarCamposCondicionales();
});
