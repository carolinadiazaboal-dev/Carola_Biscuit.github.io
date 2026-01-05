/**
 * main.js - Punto de entrada principal de la aplicación
 */

document.addEventListener('DOMContentLoaded', function() {
    inicializarAplicacion();
    cargarLogo();
    verificarFondo();
});

/**
 * Carga el logo de Carola Biscuit
 */
function cargarLogo() {
    const logoImg = document.getElementById('logo');
    const logoPlaceholder = document.getElementById('logoPlaceholder');
    
    logoImg.onerror = function() {
        if (logoPlaceholder) {
            logoPlaceholder.classList.add('show');
        }
        console.warn('⚠️ Logo no encontrado, mostrando placeholder');
    };
    
    logoImg.onload = function() {
        if (logoPlaceholder) {
            logoPlaceholder.classList.remove('show');
        }
        console.log('✅ Logo cargado correctamente');
    };
}

/**
 * Verifica si el fondo está cargado correctamente
 */
function verificarFondo() {
    const img = new Image();
    img.src = 'img/background.jpg';
    
    img.onload = function() {
        console.log('✅ Fondo de flores cargado correctamente');
    };
    
    img.onerror = function() {
        console.warn('⚠️ Imagen de fondo no encontrada. Usando fondo blanco.');
        console.info('💡 Para agregar el fondo, coloca "background.png" en la carpeta "img/"');
    };
}

/**
 * Inicializa toda la aplicación
 */
function inicializarAplicacion() {
    // Configurar fecha mínima en el input de fecha PRIMERO
    configurarFechasDisponibles();

    // Configurar listeners del formulario
    formHandler.onSubmit((form) => {
        console.log('📋 Formulario enviado, validando...');
        
        // Validar formulario
        if (!form.validar()) {
            console.warn('⚠️ Validación fallida');
            return;
        }

        // Obtener datos
        const datos = form.obtenerDatos();
        console.log('✅ Datos recolectados:', datos);

        // Procesar y enviar a WhatsApp
        const exito = WhatsAppIntegration.procesarPedido(datos);
        console.log('📲 Resultado envío WhatsApp:', exito);

        if (exito) {
            // Mostrar mensaje de éxito
            mostrarMensajeExito();
            
            // Reiniciar formulario después de 2 segundos
            setTimeout(() => {
                form.reiniciar();
                // Volver a establecer la fecha después de limpiar
                configurarFechasDisponibles();
                console.log('🔄 Formulario reiniciado');
            }, 2000);
        } else {
            console.error('❌ Error al enviar a WhatsApp');
        }
    });

    // Cargar logo si existe
    cargarLogo();
    
    // Configurar preview de foto (solo si el elemento existe)
    const inputFoto = document.getElementById('foto');
    if (inputFoto) {
        configurarPreviewFoto();
    }

    console.log('✅ Aplicación inicializada correctamente');
    console.log('📱 WhatsApp:', CONFIG.NEGOCIO.whatsapp);
}

/**
 * Configura las fechas disponibles en el input
 */
function configurarFechasDisponibles() {
    const inputFecha = document.getElementById('fechaEntrega');
    const radioPedidos = document.querySelectorAll('input[name="tipoPedido"]');
    const textoFecha = document.getElementById('textoFecha');
    const hoy = new Date();

    // Función para obtener la fecha mínima según el tipo de pedido
    function obtenerFechaMinima(tipoPedido) {
        const diasMinimos = tipoPedido === 'expres' ? 15 : 30;
        const fechaMinima = new Date(hoy);
        fechaMinima.setDate(fechaMinima.getDate() + diasMinimos);
        return fechaMinima;
    }

    // Función para actualizar las fechas según el tipo de pedido
    function actualizarFechas() {
        const tipoPedidoSeleccionado = document.querySelector('input[name="tipoPedido"]:checked');
        const tipoPedido = tipoPedidoSeleccionado ? tipoPedidoSeleccionado.value : 'regular';
        
        const fechaMinima = obtenerFechaMinima(tipoPedido);
        const fechaMinimaISO = fechaMinima.toISOString().split('T')[0];
        
        // Establecer fecha mínima en el input
        inputFecha.min = fechaMinimaISO;

        // Actualizar texto de ayuda
        if (textoFecha) {
            if (tipoPedido === 'expres') {
                textoFecha.textContent = '⚡ Pedido Exprés: Mínimo 15 días desde hoy (+15 USD)';
            } else {
                textoFecha.textContent = '📦 Pedido Regular: Mínimo 30 días desde hoy (0 USD)';
            }
        }

        // Si la fecha actual es menor que la mínima, establecer la mínima
        const fechaActual = inputFecha.value;
        if (fechaActual && new Date(fechaActual) < fechaMinima) {
            inputFecha.value = fechaMinimaISO;
            mostrarAdvertencia(`La fecha debe ser al menos ${tipoPedido === 'expres' ? '15 días' : '30 días'} desde hoy`);
        }

        // Si el campo está vacío, establecer la fecha recomendada
        if (!inputFecha.value) {
            const diasRecomendados = tipoPedido === 'expres' ? 15 : 30;
            const fechaRecomendada = new Date(hoy);
            fechaRecomendada.setDate(fechaRecomendada.getDate() + diasRecomendados);
            const fechaRecomendadaISO = fechaRecomendada.toISOString().split('T')[0];
            inputFecha.value = fechaRecomendadaISO;
        }

        // Log para debug
        console.log(`📅 Fechas actualizadas - Tipo: ${tipoPedido === 'expres' ? 'Exprés (10 días mín)' : 'Regular (30 días mín)'}, Mínimo: ${fechaMinimaISO}`);
    }

    // Validar cuando se cambia la fecha manualmente
    function validarFecha() {
        const tipoPedidoSeleccionado = document.querySelector('input[name="tipoPedido"]:checked');
        const tipoPedido = tipoPedidoSeleccionado ? tipoPedidoSeleccionado.value : 'regular';
        const fechaMinima = obtenerFechaMinima(tipoPedido);
        const fechaMinimaISO = fechaMinima.toISOString().split('T')[0];
        
        const fechaIngresada = new Date(inputFecha.value + 'T00:00:00');
        
        if (inputFecha.value && fechaIngresada < fechaMinima) {
            // Mostrar alerta visual
            inputFecha.style.borderColor = '#ff6b6b';
            inputFecha.style.backgroundColor = '#fff5f5';
            mostrarAdvertencia(`⚠️ La fecha debe ser al menos ${tipoPedido === 'expres' ? '15 días' : '30 días'} desde hoy (Mínimo: ${fechaMinimaISO})`);
            
            // Revertir a la fecha mínima después de 2 segundos
            setTimeout(() => {
                inputFecha.value = fechaMinimaISO;
                inputFecha.style.borderColor = '';
                inputFecha.style.backgroundColor = '';
            }, 2000);
            
            return false;
        } else {
            // Limpiar estilos de error
            inputFecha.style.borderColor = '';
            inputFecha.style.backgroundColor = '';
            console.log(`✅ Fecha válida: ${inputFecha.value}`);
            return true;
        }
    }

    // Mostrar advertencia temporal
    function mostrarAdvertencia(mensaje) {
        // Remover advertencia anterior si existe
        const advertenciaAnterior = document.querySelector('.advertencia-fecha');
        if (advertenciaAnterior) {
            advertenciaAnterior.remove();
        }

        // Crear nueva advertencia
        const div = document.createElement('div');
        div.className = 'advertencia-fecha';
        div.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            color: #856404;
            padding: 12px 16px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 1000;
            font-weight: 500;
            animation: slideIn 0.3s ease-in-out;
        `;
        div.textContent = mensaje;
        document.body.appendChild(div);

        // Remover después de 4 segundos
        setTimeout(() => {
            div.style.animation = 'slideOut 0.3s ease-in-out';
            setTimeout(() => div.remove(), 300);
        }, 4000);
    }

    // Llamar cuando se carga la página
    actualizarFechas();

    // Actualizar cuando se cambia el tipo de pedido
    radioPedidos.forEach(radio => {
        radio.addEventListener('change', actualizarFechas);
    });

    // Validar cuando cambie la fecha
    inputFecha.addEventListener('change', validarFecha);
    inputFecha.addEventListener('blur', validarFecha);
}

/**
 * Muestra un mensaje de éxito visual
 */
function mostrarMensajeExito() {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-exito';
    notificacion.textContent = '✅ ' + CONFIG.MENSAJES.exito;
    
    // Agregar estilos
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.5s ease-out;
    `;

    // Agregar animación CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Agregar al documento
    document.body.appendChild(notificacion);

    // Remover después de 4 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => {
            notificacion.remove();
        }, 500);
    }, 4000);
}

/**
 * Carga el logo si existe en la carpeta img
 */
function cargarLogo() {
    const logo = document.getElementById('logo');
    const placeholder = document.getElementById('logoPlaceholder');
    
    // Descomenta esta línea y reemplaza la ruta si tienes tu logo
    // logo.src = 'img/logo.png';
    
    // Si tienes un logo, muéstralo y oculta el placeholder
    logo.onload = function() {
        placeholder.style.display = 'none';
    };
    
    // Si no hay logo, mantén el placeholder visible
    logo.onerror = function() {
        placeholder.style.display = 'flex';
    };
}

/**
 * Configura el preview de la foto
 */
function configurarPreviewFoto() {
    const inputFoto = document.getElementById('foto');
    const previewDiv = document.getElementById('fotoPreview');
    
    inputFoto.addEventListener('change', function(e) {
        previewDiv.innerHTML = ''; // Limpiar preview anterior
        
        if (this.files && this.files[0]) {
            const file = this.files[0];
            
            // Validar que sea una imagen
            if (!file.type.startsWith('image/')) {
                alert('Por favor, sube un archivo de imagen valido');
                this.value = '';
                return;
            }
            
            // Validar tamaño máximo (5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert('La foto es muy grande. Tamaño maximo: 5MB');
                this.value = '';
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.alt = 'Vista previa de la foto';
                
                previewDiv.appendChild(img);
                previewDiv.classList.add('activo');
                
                // Guardar la foto en base64 en el input (como dato oculto)
                inputFoto.dataset.base64 = event.target.result;
                console.log('📸 Foto guardada en memoria');
            };
            
            reader.readAsDataURL(file);
        } else {
            previewDiv.classList.remove('activo');
        }
    });
}

/**
 * Función auxiliar para debug
 */
function debug(mensaje, datos = null) {
    console.log('%c[CAROLA BISCUIT]', 'color: #ff69b4; font-weight: bold;', mensaje);
    if (datos) console.log(datos);
}
