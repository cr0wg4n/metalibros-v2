---
title: "Metalibros v2"
lang: es
author: "Autor: Mauricio S. Matias Conde"
abstract: "Este proyecto es la segunda versión de Metalibros (trabajo #1), con mejoras en la navegación y el contenido visual, manteniendo la consistencia con la primera versión y principalmente empleando el conocimiento adquirido (desarrollo web cliente-servidor) en el primer módulo de la maestría."
format: 
  typst:
    papersize: us-letter
    toc: true
    mainfont: "DejaVu Sans"
---

**Enlace Repositorio Público:** [https://github.com/cr0wg4n/metalibros-v2](https://github.com/cr0wg4n/metalibros-v2)

**Enlace Pull Request Realizados:** [https://github.com/cr0wg4n/metalibros-v2/pulls](https://github.com/cr0wg4n/metalibros-v2/pulls?q=is%3Apr+is%3Aclosed)

**Enlace Commits Realizados:** [https://github.com/cr0wg4n/metalibros-v2/commits/main](https://github.com/cr0wg4n/metalibros-v2/commits/main)


```{=typst}
#pagebreak()
```

**Metalibros**, es una plataforma para la gestión y venta de libros, que permite a los usuarios publicar, editar y administrar sus libros, así como llevar un control de las ventas y el stock.

Esta segunda versión es la evolución del primer proyecto dentro del 1er módulo de la maestría, se empleó dicha primera versión como inspiración en temas de navegación y contenido visual, obteniendo así una base sólida y una apariencia muy similar, manteniendo la consistencia deseada.

Esta nueva versión, se encuentra funcional y conformado por importantes partes:

- El backend que se encuentra en la carpeta `backend/`: API en NestJS + Prisma (SQLite).
- El frontend que se encuentra en la carpeta `frontend/`: SPA en React + Vite + Tailwind.

## Detalles Técnicos

### Tecnologías Utilizadas
Lista de tecnologías utilizadas en el proyecto:

**Backend**

El lenguaje principal del backend es `TypeScript`, que se utiliza junto con NestJS para construir la API, sin embargo, se detalla a continuación cada una de las tecnologías empleadas:

- NestJS: framework principal de la API
- Prisma: ORM para interacción con la base de datos SQLite
- SQLite: base de datos utilizada por Prisma
- `@nestjs/jwt` y `bcryptjs`: autenticación (tokens y hash de contraseñas)
- `multer`: maneja la subida de imágenes (portadas de libros, avatares de usuarios)
- `cookie-parser`: permite la lectura de las cookies
- `dotenv`: carga de variables de entorno

**Frontend**

Al igual que el backend, el frontend tiene como lenguaje principal `TypeScript`, a continuación se detallan cada una de las tecnologías empleadas:

- React: librería principal de la UI
- React Router DOM: ruteo en la SPA
- Tailwind CSS: facilita la creación de estilos
- Axios: cliente HTTP para realizar solicitudes al backend
- Zustand: manejador de estado global (sesión del usuario)
- Zod: validación de formularios
- `lucide-react`: íconos
- `es-toolkit`: utilidades varias, muy similar a lodash pero con ventajas en rendimiento y tamaño del bundle
- Vite: motor principal para la construcción y desarrollo de la SPA

### Endpoints y Rutas
De igual forma a continuación se detallan los endpoints del backend y las rutas del frontend:

**Backend (endpoints)**

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/auth/signup` | Crea una cuenta |
| POST | `/auth/login` | Inicia sesión |
| POST | `/auth/refresh` | Renueva el access token |
| POST | `/auth/logout` | Cierra sesión |
| GET | `/auth/me` | Perfil del usuario autenticado |
| PATCH | `/auth/me` | Actualiza el perfil |
| POST | `/auth/me/avatar` | Sube el avatar |
| GET | `/books` | Lista libros (público, oculta los no publicados sin sesión) |
| POST | `/books` | Crea un libro |
| GET | `/books/:id` | Detalle de un libro |
| PATCH | `/books/:id` | Edita un libro |
| PATCH | `/books/:id/status` | Publica o archiva un libro |
| POST | `/books/:id/cover` | Sube la portada |
| DELETE | `/books/:id` | Elimina el libro (y su historial de ventas/stock) |
| GET | `/books/:id/stock` | Stock actual del libro |
| GET | `/books/:id/stock-movements` | Historial de movimientos de stock |
| GET | `/categories` | Lista categorías |
| POST | `/categories` | Crea una categoría |
| POST | `/stock-movements` | Registra una entrada o salida de stock |
| GET | `/sales` | Lista ventas |
| POST | `/sales` | Registra una venta |
| GET | `/sales/:id` | Detalle de una venta |
| PATCH | `/sales/:id` | Edita una venta |
| DELETE | `/sales/:id` | Elimina una venta |
| GET | `/metrics/overview` | Totales generales (ventas, ganancia, ROI) |
| GET | `/metrics/top-categories` | Categorías más vendidas |
| GET | `/metrics/top-cities` | Ciudades con más ventas |

**Frontend (rutas)**

| Ruta | Descripción |
| --- | --- |
| `/` | Landing pública |
| `/login` | Inicio de sesión |
| `/signup` | Registro de cuenta |
| `/dashboard` | Panel con métricas de ventas |
| `/books/published` | Vista interna de libros publicados |
| `/books/new` | Formulario para registrar un libro nuevo |
| `/books/:id/edit` | Edición y eliminación de un libro |
| `/books/manage` | Tabla de administración: publicar/archivar, editar, ajustar stock y eliminar |
| `/sales` | Historial de ventas, con registro y edición |
| `/profile` | Perfil del usuario (datos y avatar) |

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Instalación

Desde la raíz del repositorio, un solo comando instala las dependencias de ambos proyectos, ya que este repositorio fue configurado como un mono-repositorio:

```bash
npm install
```

Es básicamente el único comando necesario para instalar todas las dependencias de ambos proyectos.

## Configuración

Cada proyecto tiene su propio archivo de variables de entorno, es cuestion de copiar los ejemplos (no es necesario ajustarlos):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**backend/.env**

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto donde corre la API (`3000` por defecto) |
| `DATABASE_URL` | Ruta del archivo SQLite (por defecto `file:./dev.db`) |
| `JWT_SECRET` | String secreto para firmar los tokens de sesión |
| `FRONTEND_ORIGIN` | URL del frontend, usada para CORS (`http://localhost:5173` por defecto) |

**frontend/.env**

| Variable | Descripción |
| --- | --- |
| `VITE_API_URL` | URL del backend (`http://localhost:3000` por defecto) |

Con los valores de ejemplo funciona correctamente (localmente), no es obligatorio cambiarlos.

### Base de datos

El backend usa `Prisma` como ORM y actualmente `SQLite` como base de datos (para no complicar la configuración local), sin embargo, se puede cambiar a otra base de datos soportada por Prisma si se desea. Antes de levantarlo por primera vez es necesario generar los archivos de cliente de Prisma y aplicar las migraciones, sobre el directorio raíz corre los siguientes comandos:

```bash
npm run generate
npm run migrate
```

Los comandos previos generan el archivo `backend/dev.db` vacío. Para obtener datos de ejemplo (categorías, libros, ventas) corre:

```bash
npm run seed
```

## Ejecución 

### Modo desarrollo

Para levantar frontend y backend juntos en modo desarrollo corre:

```bash
npm run all
```

- Backend: http://localhost:3000 (puerto fijo, configurable con `PORT` en `backend/.env`)
- Frontend: http://localhost:5173 (puerto fijo en `frontend/vite.config.ts`)

También se pueden levantar por separado desde el directorio raíz:

```bash
npm run backend   # solo la API
npm run frontend  # solo la SPA
```

### Modo producción

Compila ambos proyectos con el comando:

```bash
npm run build
```

Como resultado se generan los directorios de salida `backend/dist` y `frontend/dist`.

Finalmente para correr ambos proyectos en modo producción, corre:

```bash
npm run all-prod
```
