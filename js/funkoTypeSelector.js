/**
 * funkoTypeSelector.js - Selector desplegable del tipo de Funko
 */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.funko-type-header');
    const grid = document.getElementById('funkoTypeGrid');
    const texto = header.querySelector('.funko-type-selected-text');
    const icono = header.querySelector('.funko-type-selected-icon');
    const textoInicial = texto.textContent;
    const iconoInicial = icono.textContent;

    const funkoTypeMap = {
        'personalizado': { text: 'Funko Personalizado SIMPLE', icon: '💗' },
        'personalizado-detalles': { text: 'Funko Personalizado + DETALLES', icon: '🧜🏻‍♀' },
        'pareja': { text: 'Funko Pareja Personalizadas', icon: '👩🏻‍❤‍👨🏼' },
        'pareja-detalles': { text: 'Funko Pareja + DETALLES', icon: '👩🏻‍❤‍👨🏼' },
        'personaje': { text: 'Funko de Personaje', icon: '🧚🏻‍♀' }
    };

    function expandir(abierto) {
        grid.classList.toggle('expanded', abierto);
        grid.inert = !abierto; // las tarjetas ocultas no reciben foco con Tab
        header.setAttribute('aria-expanded', abierto);
    }

    header.addEventListener('click', () => expandir(!grid.classList.contains('expanded')));

    grid.addEventListener('change', (e) => {
        const seleccion = funkoTypeMap[e.target.value];
        if (!seleccion) return;
        texto.textContent = seleccion.text;
        icono.textContent = seleccion.icon;
        setTimeout(() => expandir(false), 300);
    });

    header.form.addEventListener('reset', () => {
        texto.textContent = textoInicial;
        icono.textContent = iconoInicial;
        expandir(true);
    });
});
