/**
 * rippleEffect.js - Efecto Ripple Material Design
 * Agrega feedback táctil visual a botones y elementos clicables
 */

class RippleEffect {
    constructor() {
        this.init();
    }

    /**
     * Inicializa el efecto ripple en todos los elementos
     */
    init() {
        // Seleccionar todos los elementos que tendrán ripple
        const rippleElements = document.querySelectorAll(
            '.btn-enviar, .resumen-toggle, .resumen-close, .form-group.checkbox, .color-option'
        );

        rippleElements.forEach(element => {
            element.addEventListener('click', (e) => this.createRipple(e, element));
            element.addEventListener('touchstart', (e) => this.createRipple(e, element), { passive: true });
        });

        console.log('✅ Ripple Effect inicializado en', rippleElements.length, 'elementos');
    }

    /**
     * Crea el efecto ripple en el elemento
     */
    createRipple(event, element) {
        // Limpiar ripples anteriores
        const existingRipple = element.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        // Crear elemento ripple
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        // Obtener posición del elemento
        const rect = element.getBoundingClientRect();
        
        // Calcular posición del click/touch
        let x, y;
        if (event.type === 'touchstart') {
            const touch = event.touches[0];
            x = touch.clientX - rect.left;
            y = touch.clientY - rect.top;
        } else {
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        }

        // Calcular el diámetro del ripple (el mayor lado del elemento)
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        // Posicionar el ripple
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${x - radius}px`;
        ripple.style.top = `${y - radius}px`;

        // Agregar ripple al elemento
        element.appendChild(ripple);

        // Remover ripple después de la animación
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        new RippleEffect();
    }, 100);
});
