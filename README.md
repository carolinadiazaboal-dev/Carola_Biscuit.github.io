# Carola Biscuit - Formulario de Pedidos

Formulario web profesional para pedidos de Funkos Pop personalizados.

## Características

✨ **Diseño Responsivo** - Se adapta a todos los dispositivos
🎨 **Tema Rosa Personalizado** - Colores de Carola Biscuit
📱 **Integración WhatsApp** - Envía pedidos directamente a WhatsApp
📋 **Validación de Formulario** - Campos requeridos verificados
🎁 **Características Detalladas** - Recoge todos los detalles del Funko
⏰ **Control de Fechas** - Valida fechas mínimas de entrega
📝 **Observaciones** - Espacio para notas adicionales

## Estructura del Proyecto

```
formularios/
├── index.html           # Archivo principal (HTML)
├── README.md           # Este archivo
├── css/
│   └── styles.css      # Estilos personalizados
├── js/
│   ├── config.js       # Configuración centralizada
│   ├── formHandler.js  # Manejo del formulario
│   ├── whatsappIntegration.js  # Integración WhatsApp
│   └── main.js         # Punto de entrada principal
└── img/
    └── (aquí va tu logo)
```

## Configuración

### 1. Agregar Logo

1. Coloca tu logo en la carpeta `img/` (ej: `img/logo.png`)
2. Abre `js/main.js` y descomenta la línea:
   ```javascript
   logo.src = 'img/logo.png';
   ```

### 2. Cambiar Número de WhatsApp

Abre `js/config.js` y modifica:
```javascript
whatsapp: '+53 56145486',  // Formato con espacios
whatsappLimpio: '5356145486', // Sin símbolos
```

### 3. Cambiar Información del Negocio

En `js/config.js`, actualiza:
```javascript
NEGOCIO: {
    nombre: 'Carola Biscuit',
    // ... más opciones
}
```

## Uso

### Local
1. Descarga el proyecto
2. Abre `index.html` en tu navegador
3. Completa el formulario y presiona "Enviar Pedido"

### GitHub Pages
1. Crea un repositorio en GitHub: `carola-biscuit-funkos`
2. Sube todos los archivos
3. Ve a Settings → Pages → Source → Main Branch
4. Tu formulario estará en: `https://tuusuario.github.io/carola-biscuit-funkos/`

## Módulos JavaScript

### config.js
Configuración centralizada de la aplicación.

### formHandler.js
Clase `FormHandler` que maneja:
- Obtención de datos del formulario
- Validación de campos requeridos
- Reinicio del formulario

### whatsappIntegration.js
Clase `WhatsAppIntegration` que:
- Construye el mensaje formateado
- Codifica el mensaje para URL
- Abre WhatsApp con el mensaje pre-llenado

### main.js
- Inicializa la aplicación
- Configura listeners de eventos
- Maneja fechas disponibles
- Muestra notificaciones de éxito

## Flujo de Uso

1. Cliente completa todos los campos
2. Valida que los campos requeridos estén rellenos
3. Presiona "Enviar Pedido por WhatsApp"
4. Se abre WhatsApp con el mensaje pre-formateado
5. Cliente confirma y envía
6. Negocio recibe el pedido detallado

## Personalización

### Cambiar Colores
En `css/styles.css`, modifica las variables CSS:
```css
--color-primary: #ff69b4;  /* Rosa */
--color-primary-dark: #ff1493;  /* Rosa oscuro */
```

### Agregar/Quitar Campos
1. Agregar en `index.html` (dentro de un fieldset)
2. Obtener en `js/formHandler.js` en el método `obtenerCampos()`
3. Incluir en el método `obtenerDatos()`
4. Usar en `js/whatsappIntegration.js` en `construirMensaje()`

## Navegadores Compatibles

✅ Chrome/Edge
✅ Firefox
✅ Safari
✅ Mobile (iOS/Android)

## Notas

- El formulario NO almacena datos en servidores
- Los datos se envían directamente a WhatsApp
- Requiere que WhatsApp Web/Escritorio esté disponible
- Los campos con asterisco (*) son obligatorios

## Soporte

Para agregar más funcionalidades o reportar bugs, edita los archivos modulares manteniendo la estructura.

---

**Carola Biscuit Funkos** 🩷
