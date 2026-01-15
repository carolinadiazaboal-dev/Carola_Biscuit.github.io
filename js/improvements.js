/**
 * improvements.js - Mejoras UX/UI Móvil Optimizado
 * Incluye: Barra de progreso, Scroll/Focus mejorado, inputmode, autocomplete
 */

class FormImprovements {
    constructor(formId = 'pedidoForm') {
        this.form = document.getElementById(formId);
        this.progressFill = document.getElementById('progressFill');
        this.progressPercent = document.getElementById('progressPercent');
        this.resumenPanel = document.getElementById('resumenPanel');
        this.resumenToggle = document.getElementById('resumenToggle');
        this.resumenClose = document.getElementById('resumenClose');
        this.resumenContent = document.getElementById('resumenContent');
        this.resumenCounter = document.getElementById('resumenCounter');
        
        // Detectar si es móvil
        this.isMobile = window.innerWidth <= 768;
        
        // Variables para scroll mejorado
        this.keyboardHeight = 0;
        this.originalScrollPosition = 0;
        
        if (!this.form) {
            console.warn('Formulario no encontrado');
            return;
        }

        this.init();
    }

    /**
     * Inicializa todas las mejoras
     */
    init() {
        // Evento para actualizar progreso en tiempo real
        this.form.addEventListener('input', () => this.actualizarProgreso());
        this.form.addEventListener('change', () => this.actualizarProgreso());
        
        // Actualizar progreso al cargar
        setTimeout(() => this.actualizarProgreso(), 100);
        
        // Panel resumen
        if (this.resumenToggle) {
            this.resumenToggle.addEventListener('click', () => this.toggleResumen());
        }
        if (this.resumenClose) {
            this.resumenClose.addEventListener('click', () => this.cerrarResumen());
        }
        
        // Cerrar resumen al hacer scroll (solo móvil)
        if (this.isMobile) {
            document.addEventListener('scroll', () => this.cerrarResumen());
        }
        
        // Cerrar resumen al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.resumen-toggle') && !e.target.closest('.resumen-panel')) {
                this.cerrarResumen();
            }
        });
        
        // Scroll y Focus mejorado para móvil
        this.mejorarScrollYFocus();
        
        // Escuchar cambios de tamaño de ventana
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            this.cerrarResumen();
        });
        
        // Listeners en cada campo para actualizar progreso
        const campos = this.form.querySelectorAll('input, textarea, select');
        campos.forEach(campo => {
            campo.addEventListener('input', () => this.actualizarProgreso());
            campo.addEventListener('change', () => this.actualizarProgreso());
        });
        
        console.log('✅ FormImprovements inicializado correctamente');
        
        // Inicializar progreso
        this.actualizarProgreso();
    }

    /**
     * Mejora el scroll y focus para móvil
     */
    mejorarScrollYFocus() {
        const campos = this.form.querySelectorAll('input, textarea, select');
        
        campos.forEach(campo => {
            // Al hacer focus en un campo
            campo.addEventListener('focus', (e) => {
                if (this.isMobile) {
                    // Cerrar panel resumen si está abierto
                    this.cerrarResumen();
                    
                    // Guardar posición actual
                    this.originalScrollPosition = window.scrollY;
                    
                    // Hacer scroll suave al campo con delay para el teclado
                    setTimeout(() => {
                        this.scrollToCampo(e.target);
                    }, 300);
                }
            });
            
            // Al perder focus
            campo.addEventListener('blur', () => {
                if (this.isMobile) {
                    // Opcional: restaurar scroll
                    // window.scrollTo({ top: this.originalScrollPosition, behavior: 'smooth' });
                }
            });
        });
        
        // Detectar cuando se abre el teclado móvil
        if (this.isMobile) {
            window.visualViewport?.addEventListener('resize', () => {
                const currentHeight = window.visualViewport.height;
                const windowHeight = window.innerHeight;
                this.keyboardHeight = windowHeight - currentHeight;
                
                // Si el teclado está abierto
                if (this.keyboardHeight > 100) {
                    this.cerrarResumen();
                }
            });
        }
    }

    /**
     * Hace scroll al campo con padding extra para el teclado
     */
    scrollToCampo(campo) {
        const rect = campo.getBoundingClientRect();
        const offsetTop = rect.top + window.scrollY;
        
        // Calcular posición con espacio para el teclado móvil
        const offset = this.isMobile ? 120 : 80;
        const scrollPosition = offsetTop - offset;
        
        window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Actualiza el progreso del formulario
     */
    actualizarProgreso() {
        if (!this.form) return;

        const campos = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let camposCompletos = 0;
        let camposVisibles = 0;

        campos.forEach(campo => {
            // Ignorar campos ocultos
            if (campo.offsetParent === null) return;
            
            camposVisibles++;
            let estaCompleto = false;
            
            if (campo.type === 'radio' || campo.type === 'checkbox') {
                const seleccionado = this.form.querySelector(`input[name="${campo.name}"]:checked`);
                estaCompleto = seleccionado !== null;
            } else {
                estaCompleto = campo.value && campo.value.trim() !== '';
            }
            
            if (estaCompleto) camposCompletos++;
        });

        const porcentaje = camposVisibles > 0 ? Math.round((camposCompletos / camposVisibles) * 100) : 0;
        
        // Actualizar barra de progreso
        if (this.progressFill) {
            this.progressFill.style.width = porcentaje + '%';
        }
        
        if (this.progressPercent) {
            this.progressPercent.textContent = porcentaje;
        }
        
        // Actualizar resumen
        this.actualizarResumen();
        
        // Actualizar contador
        if (this.resumenCounter) {
            this.resumenCounter.textContent = camposCompletos;
        }
    }

    /**
     * Actualiza el panel resumen
     */
    actualizarResumen() {
        if (!this.resumenContent) return;
        
        const formData = new FormData(this.form);
        const resumenItems = [];

        const camposResumen = [
            { key: 'nombre', label: '👤 Cliente' },
            { key: 'telefono', label: '📱 Teléfono' },
            { key: 'tipoFunko', label: '🎭 Tipo' },
            { key: 'fechaEntrega', label: '📅 Fecha' }
        ];

        camposResumen.forEach(campo => {
            const valor = formData.get(campo.key);
            if (valor && valor.trim()) {
                let textoMostrar = valor;
                const maxLength = this.isMobile ? 20 : 25;
                if (textoMostrar.length > maxLength) {
                    textoMostrar = textoMostrar.substring(0, maxLength) + '...';
                }
                resumenItems.push({
                    label: campo.label,
                    valor: textoMostrar
                });
            }
        });

        if (resumenItems.length === 0) {
            this.resumenContent.innerHTML = '<p class="resumen-vacio">Completa el formulario para ver el resumen...</p>';
        } else {
            this.resumenContent.innerHTML = resumenItems.map(item => 
                `<div class="resumen-item">
                    <span class="resumen-label">${item.label}</span>
                    <span class="resumen-valor">${item.valor}</span>
                </div>`
            ).join('');
        }
    }

    /**
     * Alterna la visibilidad del panel resumen
     */
    toggleResumen() {
        if (!this.resumenPanel) return;
        this.resumenPanel.classList.toggle('active');
    }

    /**
     * Cierra el panel resumen
     */
    cerrarResumen() {
        if (this.resumenPanel) {
            this.resumenPanel.classList.remove('active');
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        new FormImprovements('pedidoForm');
    }, 100);
});
