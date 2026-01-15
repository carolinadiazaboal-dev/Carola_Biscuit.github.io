/**
 * rippleEffect.js - Efecto Ripple Material Design
 * Agrega feedback táctil visual a botones y elementos clicables
 */

class RippleEffect {
    constructor() {
        this.lastRippleTime = 0;
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
        // Prevenir duplicados en touch devices
        if (event.type === 'touchstart' && this.lastRippleTime && Date.now() - this.lastRippleTime < 300) {
            return;
        }
        this.lastRippleTime = Date.now();

        // Limpiar TODOS los ripples anteriores del elemento
        const existingRipples = element.querySelectorAll('.ripple');
        existingRipples.forEach(r => r.remove());

        // Crear elemento ripple
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        // Obtener posición del elemento
        const rect = element.getBoundingClientRect();
        
        // Calcular posición del click/touch
        let x, y;
        if (event.type === 'touchstart' && event.touches && event.touches[0]) {
            const touch = event.touches[0];
            x = touch.clientX - rect.left;
            y = touch.clientY - rect.top;
        } else if (event.clientX !== undefined) {
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        } else {
            // Fallback al centro si no hay coordenadas
            x = rect.width / 2;
            y = rect.height / 2;
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

        // Remover ripple después de la animación con verificación
        setTimeout(() => {
            if (ripple && ripple.parentNode) {
                ripple.remove();
            }
        }, 600);

        // Limpieza de emergencia por si acaso
        setTimeout(() => {
            const stuckRipples = element.querySelectorAll('.ripple');
            stuckRipples.forEach(r => r.remove());
        }, 1000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        new RippleEffect();
    }, 100);
});
