# 🍑 Glute Addicts — PWA Deployment Guide

Esta guía te lleva desde cero hasta tener la app funcionando en vivo en
**app.gluteaddictsmedellin.co** en menos de 1 hora.

---

## Lo que necesitas antes de empezar

| Qué | Dónde |
|---|---|
| Cuenta de GitHub (gratis) | github.com |
| Cuenta de Vercel (gratis) | vercel.com |
| WordPress con el plugin Reservas Colombia instalado | gluteaddictsmedellin.co |
| Llaves de Wompi (producción) | Panel Wompi → Desarrolladores |

---

## PASO 1 — Subir el código a GitHub

1. Ve a **github.com** → Click en **"New repository"**
2. Nombre: `glute-addicts-app` → **Create repository**
3. En tu computador, abre una terminal en la carpeta `glute-addicts-pwa/`
4. Ejecuta estos comandos uno por uno:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/glute-addicts-app.git
git push -u origin main
```

> Si no tienes Git instalado: descárgalo en git-scm.com

---

## PASO 2 — Desplegar en Vercel

1. Ve a **vercel.com** → **"Add New Project"**
2. Conecta tu cuenta de GitHub
3. Selecciona el repositorio `glute-addicts-app`
4. Vercel detectará la configuración automáticamente
5. Antes de hacer deploy, agrega la variable de entorno:
   - **Name:** `VITE_WP_URL`
   - **Value:** `https://gluteaddictsmedellin.co`
6. Click **Deploy** → En 2 minutos tendrás una URL como `glute-addicts-app.vercel.app`

---

## PASO 3 — Conectar tu dominio (app.gluteaddictsmedellin.co)

### En Vercel:
1. Ve a tu proyecto → **Settings → Domains**
2. Escribe `app.gluteaddictsmedellin.co` → **Add**
3. Vercel te dará un valor CNAME, algo como: `cname.vercel-dns.com`

### En tu proveedor de dominio (GoDaddy / Namecheap / etc.):
1. Ve a la gestión de DNS de tu dominio `gluteaddictsmedellin.co`
2. Agrega un registro:
   - **Tipo:** CNAME
   - **Nombre:** `app`
   - **Valor:** `cname.vercel-dns.com` (el que te dio Vercel)
3. Guarda — tarda entre 10 minutos y 1 hora en activarse

---

## PASO 4 — Activar login con WordPress

El app usa el plugin **JWT Authentication for WP REST API** para el login.

1. En WordPress, instala el plugin:
   **Plugins → Agregar nuevo → busca "JWT Authentication for WP REST API"** → Instalar → Activar

2. Edita el archivo `wp-config.php` de tu WordPress y agrega ANTES de `/* That's all */`:

```php
define('JWT_AUTH_SECRET_KEY', 'pon-aqui-una-clave-secreta-larga-y-aleatoria');
define('JWT_AUTH_CORS_ENABLE', true);
```

3. Edita el archivo `.htaccess` de tu WordPress y agrega dentro de `<IfModule mod_rewrite.c>`:

```apache
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule .* - [e=HTTP_AUTHORIZATION:%1]
```

4. Listo — el login de la app conectará directamente con las cuentas de tu WordPress.

---

## PASO 5 — Configurar Wompi producción

1. Ve a tu WordPress → **Reservas → Configuración**
2. Cambia el **Ambiente** de `Sandbox` a `Producción`
3. Pega tus llaves de producción de Wompi:
   - Llave Pública (empieza con `pub_prod_...`)
   - Llave Privada (empieza con `prv_prod_...`)
   - Llave Eventos (para el webhook)
4. La URL del webhook ya está configurada automáticamente

---

## PASO 6 — Habilitar CORS en WordPress

Para que la app en `app.gluteaddictsmedellin.co` pueda hablar con WordPress,
agrega esto al archivo `functions.php` de tu tema hijo (o crea un plugin simple):

```php
add_action('init', function() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = ['https://app.gluteaddictsmedellin.co', 'https://glute-addicts-app.vercel.app'];
    if (in_array($origin, $allowed)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce");
        header("Access-Control-Allow-Credentials: true");
    }
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
});
```

---

## PASO 7 — Instalar como app en el teléfono

### iPhone (Safari):
1. Abre `app.gluteaddictsmedellin.co` en Safari
2. Toca el botón de compartir (cuadrado con flecha)
3. Toca **"Agregar a pantalla de inicio"**
4. ¡Aparece como una app nativa!

### Android (Chrome):
1. Abre la URL en Chrome
2. Chrome mostrará automáticamente un banner **"Instalar app"**
3. Acepta — se instala en el home screen como app nativa

---

## Estructura del proyecto

```
glute-addicts-pwa/
├── src/
│   ├── main.jsx          ← Punto de entrada React
│   ├── App.jsx           ← Todas las pantallas
│   ├── api.js            ← Todas las llamadas al API de WordPress
│   ├── AuthContext.jsx   ← Manejo de sesión (login/logout)
│   ├── constants.js      ← Paquetes, horarios, colores, precios
│   └── components.jsx    ← Componentes UI reutilizables
├── public/
│   ├── icon-192.png      ← Ícono de la app (reemplaza con tu logo)
│   ├── icon-512.png      ← Ícono grande (reemplaza con tu logo)
│   └── favicon.ico       ← Favicon
├── index.html            ← HTML base con meta tags PWA
├── vite.config.js        ← Config de Vite + PWA
├── vercel.json           ← Config de Vercel
├── package.json          ← Dependencias
└── .env.example          ← Variables de entorno (copia a .env.local)
```

---

## Agregar tu logo como ícono de la app

Coloca dos archivos en la carpeta `public/`:
- `icon-192.png` — 192×192 px (PNG con fondo negro o transparente)
- `icon-512.png` — 512×512 px (misma imagen más grande)

Herramienta gratis para generar todos los tamaños: **realfavicongenerator.net**

---

## Actualizar la app

Cualquier cambio que hagas y subas a GitHub se despliega automáticamente en Vercel en ~1 minuto. Sin App Store, sin aprobaciones, sin esperas.

---

## Costos

| Servicio | Costo |
|---|---|
| Vercel (hosting) | $0 gratis |
| GitHub | $0 gratis |
| Tu WordPress actual | Ya lo tienes |
| Wompi | Solo cobran comisión por transacción exitosa |
| **Total extra** | **$0** |

---

## ¿Necesitas ayuda para configurarlo?

Contacta a un desarrollador en **workana.com** (plataforma colombiana) o en **upwork.com**.
Busca: "React PWA deployment Vercel WordPress". Costo estimado: $50–$150 USD una sola vez.
