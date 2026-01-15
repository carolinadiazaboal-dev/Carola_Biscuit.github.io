/**
 * funkoTypeSelector.js - Manejador del selector de tipo de Funko con dropdown
 */

document.addEventListener('DOMContentLoaded', () => {
    const funkoTypeRadios = document.querySelectorAll('input[name="tipoFunko"]');
    const selectedText = document.querySelector('.funko-type-selected-text');
    const selectedIcon = document.querySelector('.funko-type-selected-icon');
    const funkoTypeGrid = document.querySelector('.funko-type-grid');
    
    // Mapeo de valores a textos e iconos
    const funkoTypeMap = {
        'personalizado': {
            text: 'Funko Personalizado SIMPLE',
            icon: '💗'
        },
        'personalizado-detalles': {
            text: 'Funko Personalizado + DETALLES',
            icon: '🧜🏻‍♀'
        },
        'pareja': {
            text: 'Funko Pareja Personalizadas',
            icon: '👩🏻‍❤‍👨🏼'
        },
        'pareja-detalles': {
            text: 'Funko Pareja + DETALLES',
            icon: '👩🏻‍❤‍👨🏼'
        },
        'personaje': {
            text: 'Funko de Personaje',
            icon: '🧚🏻‍♀'
        }
    };
    
    // Manejar cambios en la selección
    funkoTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked && funkoTypeMap[this.value]) {
                const selected = funkoTypeMap[this.value];
                selectedText.textContent = selected.text;
                selectedIcon.textContent = selected.icon;
                
                // Colapsar el grid después de seleccionar (opcional)
                setTimeout(() => {
                    funkoTypeGrid.classList.remove('expanded');
                }, 300);
            }
        });
    });
    
    // Verificar si hay una opción pre-seleccionada al cargar
    const checkedRadio = document.querySelector('input[name="tipoFunko"]:checked');
    if (checkedRadio && funkoTypeMap[checkedRadio.value]) {
        const selected = funkoTypeMap[checkedRadio.value];
        selectedText.textContent = selected.text;
        selectedIcon.textContent = selected.icon;
    }
});
