# La Salsamentaria — menú digital demo

Prototipo Front-End responsive construido con HTML, CSS, JavaScript vanilla, JSON y LocalStorage. Incluye búsqueda, filtros combinados, catálogo, productos destacados, carrito persistente y armado de pedido por WhatsApp.

## Ejecutar
1. Descomprime el proyecto.
2. Abre la carpeta `salsamentaria` en Visual Studio Code.
3. Instala/activa la extensión **Live Server** si no la tienes.
4. Haz clic derecho en `index.html` y selecciona **Open with Live Server**. No abras el archivo directamente con `file://`, porque `fetch()` necesita un servidor para cargar JSON.

## Editar catálogo
- Productos: `data/products.json`. Cada producto usa un `id` único, `price` numérico en COP, `unit`, `category`, `image`, `badge`, `featured` y `available`.
- Categorías: `data/categories.json`. Los IDs de categoría deben coincidir con `category` en los productos.
- Imágenes locales: `assets/img/`. Las imágenes del prototipo son fotografías demostrativas creadas para esta maqueta.
- Datos de negocio y WhatsApp: `js/config.js`. Configura `whatsappNumber` con indicativo internacional, solo dígitos. El número está vacío por defecto para no inventar un contacto.

## Carrito
El carrito se guarda en `localStorage` con la clave `salsamentaria_cart_v1`. Para restablecerlo, usa el botón Vaciar carrito o borra esa clave desde las herramientas de desarrollador del navegador.

## Limitaciones
- No hay backend ni sincronización entre dispositivos.
- Los precios y productos son de demostración: confirma y reemplaza por datos reales.
- WhatsApp solo abre un mensaje preparado; el cliente debe enviarlo manualmente. Abrir WhatsApp no confirma el pedido.
- El estado “Abierto” es visual de demostración y no calcula automáticamente el horario.
- Las librerías de iconos y fuentes requieren conexión a internet; el resto de los archivos y fotografías están incluidos localmente.
