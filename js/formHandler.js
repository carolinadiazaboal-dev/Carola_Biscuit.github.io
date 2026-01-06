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
            tipoPedido: document.querySelector('input[name="tipoPedido"]:checked'),
            tipoEntrega: document.querySelector('input[name="tipoEntrega"]:checked'),
            direccionDomicilio: document.getElementById('direccionDomicilio'),
            vestuario: document.getElementById('vestuario'),
            colorCabello: document.getElementById('colorCabello'),
            colorPiel: document.getElementById('colorPiel'),
            pielPersonalizadaTexto: document.getElementById('pielPersonalizadaTexto'),
            colorOjos: document.getElementById('colorOjos'),
            ojoPersonalizadoTexto: document.getElementById('ojoPersonalizadoTexto'),
            accesorios: document.getElementById('accesorios'),
            detallesAdicionales: document.getElementById('detallesAdicionales')
        };
    }

    /**
     * Valida que los campos requeridos estén completo
     */
    validar() {
        const tipoFunko = this.campos.tipoFunko.value;
        
        // Campos obligatorios para todos
        const camposRequeridos = [
            { id: 'tipoFunko', nombre: 'Tipo de Funko' },
            { id: 'nombre', nombre: 'Nombre del Cliente' },
            { id: 'telefono', nombre: 'Teléfono' },
            { id: 'fechaEntrega', nombre: 'Fecha de Entrega' }
        ];

        // Validación especial según tipo de funko
        if (tipoFunko === 'personaje') {
            // Para personajes: solo necesita nombre del personaje
            camposRequeridos.push({ id: 'nombrePersonaje', nombre: 'Nombre del Personaje' });
        } else {
            // Para personalizados, personalizado-detalles, pareja y pareja-detalles
            camposRequeridos.push(
                { id: 'vestuario', nombre: 'Descripción de Vestuario' },
                { id: 'colorCabello', nombre: 'Color y largo del cabello' }
            );
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
        const colorOjosSeleccionado = document.querySelector('input[name="colorOjos"]:checked');
        let colorOjos = colorOjosSeleccionado ? colorOjosSeleccionado.value : '';
        
        const colorPielSeleccionado = document.querySelector('input[name="colorPiel"]:checked');
        let colorPiel = colorPielSeleccionado ? colorPielSeleccionado.value : '';
        
        const tipoPedidoSeleccionado = document.querySelector('input[name="tipoPedido"]:checked');
        let tipoPedido = tipoPedidoSeleccionado ? tipoPedidoSeleccionado.value : 'regular';
        
        const tipoEntregaSeleccionado = document.querySelector('input[name="tipoEntrega"]:checked');
        let tipoEntrega = tipoEntregaSeleccionado ? tipoEntregaSeleccionado.value : 'recogida';
        
        return {
            tipoFunko: this.campos.tipoFunko.value,
            nombrePersonaje: this.campos.nombrePersonaje.value.trim(),
            nombre: this.campos.nombre.value.trim(),
            telefono: this.campos.telefono.value.trim(),
            email: this.campos.email.value.trim(),
            nombreCaja: this.campos.nombreCaja.value.trim(),
            fechaEntrega: this.campos.fechaEntrega.value,
            tipoPedido: tipoPedido,
            esExpres: tipoPedido === 'expres',
            tipoEntrega: tipoEntrega,
            esDomicilio: tipoEntrega === 'domicilio',
            esRecogida: tipoEntrega === 'recogida',
            direccionDomicilio: this.campos.direccionDomicilio.value.trim(),
            vestuario: this.campos.vestuario.value.trim(),
            colorCabello: this.campos.colorCabello.value.trim(),
            colorPiel: colorPiel === 'personalizado' ? this.campos.pielPersonalizadaTexto.value.trim() : colorPiel,
            colorOjos: colorOjos === 'personalizado' ? this.campos.ojoPersonalizadoTexto.value.trim() : colorOjos,
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
        const seccionColorPiel = document.getElementById('seccionColorPiel');
        const seccionColorOjos = document.getElementById('seccionColorOjos');
        const avisoPareja = document.getElementById('avisoPareja');

        // Mostrar/ocultar aviso de pareja
        if (tipoFunko === 'pareja' || tipoFunko === 'pareja-detalles') {
            avisoPareja.style.display = 'block';
        } else {
            avisoPareja.style.display = 'none';
        }

        // Mostrar/ocultar sección de personaje
        if (tipoFunko === 'personaje') {
            seccionPersonaje.style.display = 'block';
        } else {
            seccionPersonaje.style.display = 'none';
        }

        // Mostrar/ocultar sección de color de piel y ojos (no mostrar para personajes)
        if (tipoFunko === 'personaje') {
            seccionColorPiel.style.display = 'none';
            seccionColorOjos.style.display = 'none';
        } else {
            seccionColorPiel.style.display = 'block';
            seccionColorOjos.style.display = 'block';
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

// Manejar cambios en el tipo de entrega (recogida o domicilio)
document.addEventListener('DOMContentLoaded', () => {
    const tipoEntregaRadios = document.querySelectorAll('input[name="tipoEntrega"]');
    tipoEntregaRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const seccionDireccion = document.getElementById('seccionDireccion');
            const inputDireccion = document.getElementById('direccionDomicilio');
            
            if (this.value === 'domicilio') {
                seccionDireccion.style.display = 'block';
                inputDireccion.focus();
            } else {
                seccionDireccion.style.display = 'none';
                inputDireccion.value = '';
            }
        });
    });

    // Manejar cambios en el selector de color de ojos (mostrar campo personalizado)
    const colorOjosRadios = document.querySelectorAll('input[name="colorOjos"]');
    colorOjosRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const seccionOjoPersonalizado = document.getElementById('seccionOjoPersonalizado');
            const inputOjoPersonalizado = document.getElementById('ojoPersonalizadoTexto');
            
            if (this.value === 'personalizado') {
                seccionOjoPersonalizado.style.display = 'block';
                inputOjoPersonalizado.focus();
            } else {
                seccionOjoPersonalizado.style.display = 'none';
                inputOjoPersonalizado.value = '';
            }
        });
    });

    // Manejar cambios en el selector de color de piel (mostrar campo personalizado)
    const colorPielRadios = document.querySelectorAll('input[name="colorPiel"]');
    colorPielRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const seccionPielPersonalizada = document.getElementById('seccionPielPersonalizada');
            const inputPielPersonalizada = document.getElementById('pielPersonalizadaTexto');
            
            if (this.value === 'personalizado') {
                seccionPielPersonalizada.style.display = 'block';
                inputPielPersonalizada.focus();
            } else {
                seccionPielPersonalizada.style.display = 'none';
                inputPielPersonalizada.value = '';
            }
        });
    });
});

// Mostrar/ocultar campos condicionales al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    formHandler.mostrarOcultarCamposCondicionales();
});
