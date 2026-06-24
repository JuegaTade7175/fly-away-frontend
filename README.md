# Fly Away Frontend

Aplicacion frontend para Fly Away - un sistema de reserva de vuelos.

## Integrantes

| Nombre | Código |
|---|---|
| Tadeo Joaquín Cárdenas Soto | 202510004 |

## Stack Tecnologico

- React 19 con TypeScript
- Vite para build
- Tailwind CSS para estilos
- React Router para navegacion
- Axios para llamadas API

## Como Empezar

### Prerrequisitos

- Node.js 18+
- npm

### Instalacion

```bash
cd dummy-frontend
npm install
```

### Variables de Entorno

El archivo `.env` ya esta configurado:

```env
VITE_API_URL=http://localhost:8081
```

### Ejecutar la Aplicacion

```bash
npm run dev
```

La aplicacion estara disponible en `http://localhost:5173`

### Build para Produccion

```bash
npm run build
npm run typecheck
npm run lint
```

## Funcionalidades

- **Registro de Usuario** - Registro con email, nombre y contrasena
- **Login de Usuario** - Autenticacion basada en JWT con localStorage
- **Busqueda de Vuelos** - Buscar vuelos por numero, aerolinea y rango de fechas
- **Reserva de Vuelos** - Reservar vuelos para usuarios autenticados
- **Mis Reservas** - Ver todas las reservas de vuelos

## Estructura del Proyecto

```
src/
├── api/           # Cliente API y endpoints
├── context/       # Proveedores React Context (Auth)
├── pages/         # Componentes de paginas
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── FlightSearchPage.tsx
│   └── MyBookingsPage.tsx
├── types/         # Definiciones de tipos TypeScript
├── App.tsx        # App principal con rutas
├── main.tsx       # Punto de entrada
└── index.css      # Estilos globales
```

## Integracion API

El frontend se conecta a la API del backend Fly Away en `http://localhost:8081`. Todas las llamadas API se manejan a traves del modulo centralizado `api/index.ts` con inyeccion automatica de token JWT.

## Configuracion del Backend

Antes de ejecutar el frontend, asegurate de que el backend este ejecutandose:

```bash
# Desde la raiz del proyecto
./mvnw spring-boot:run
```

El backend iniciara en `http://localhost:8081`

## Flujo de Uso

1. Registrar una nueva cuenta en `/register`
2. Iniciar sesion con tus credenciales en `/login`
3. Buscar vuelos en `/search`
4. Reservar vuelos (requiere autenticacion)
5. Ver tus reservas en `/bookings`
