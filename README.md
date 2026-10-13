# PC-Tienda - E-Commerce de Hardware y Periféricos

Proyecto final de E-commerce desarrollado con **React**, **Vite** y **React Router**.

---

## 🚀 Características Principales

- **Catálogo Dinámico:** Filtrado en cascada por categorías (Periféricos, Componentes, Monitores) y subcategorías (RAM, Fuentes, SSD, Mouse, etc.).
- **Búsqueda en tiempo real y Ordenamiento:** Búsqueda por palabras clave y ordenamiento por menor/mayor precio o relevancia.
- **Carrito de Compras:** Gestión reactiva de stock, cálculo total y flujo de Checkout con SweetAlert2.
- **Autenticación y Perfil:**
  - Registro e Inicio de sesión de usuarios con persistencia local (`localStorage`).
  - Historial de órdenes de compra asociado a cada cuenta.
- **Panel de Administración (CRUD de Inventario):**
  - Carga de nuevos productos con subida de imagen local (FileReader en Base64).
  - Búsqueda y paginación en la tabla de inventario.
  - Modificación de precios y control de stock en tiempo real.
  - Eliminación de productos.
- **Modo Oscuro / Claro:** Selector de tema con contraste adaptativo.
- **Formulario de Contacto:** Conexión asíncrona preparada para Formspree / EmailJS.
- **Boletín / Newsletter:** Suscripción interactiva con validación de correos duplicados.

---

## 🔐 Credenciales de Administrador

Para acceder a las funciones de administración (botón **Panel Admin** en la barra de navegación):
- **Email:** `admin@admin.com`
- **Contraseña:** `Admin123!`

---

## 🛠️ Tecnologías Utilizadas

- **React 19**
- **Vite**
- **React Router Dom**
- **Lucide React** (Iconografía)
- **SweetAlert2** (Notificaciones y modales interactivos)
- **CSS3 Moderno** (Variables CSS adaptativas, Grid, Flexbox)

---

## 💻 Instalación y Ejecución Local

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Para generar el build de producción:
   ```bash
   npm run build
   ```
