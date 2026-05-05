# turnow - Guía del Proyecto

Proyecto **SaaS multi-tenant** para gestión de turnos con autenticación JWT, disponibilidad de profesionales y bookings.

Este repositorio integra:

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Backend**: Spring Boot 3.2.3 + Java 21 + PostgreSQL
- **Arquitectura**: Multi-tenant con autenticación JWT y roles

---

## 🚀 Quick Start Local

Hoy el backend local ya no depende de PostgreSQL instalado en tu máquina. Arranca con los scripts del repo y usa **Supabase** como base de datos de desarrollo.

### 1) Backend

```powershell
cd C:\Users\(usuario)\Documents\turnow
.\start-backend.ps1
```

También disponible en batch:

```batch
start-backend.bat
```

Qué hace el script:
- Carga `backend/.env.local`
- Recompila el backend antes de arrancar
- Usa el profile `dev`
- Ajusta automáticamente la conexión al pooler de Supabase cuando detecta una URL `pooler.supabase.com`

### 2) Frontend

```powershell
cd C:\Users\(usuario)\Documents\turnow
npm install   # primera vez
npm run dev
```

Backend esperado: `http://localhost:8080/api`
Frontend esperado: `http://localhost:5173`

### 3) Verificación rápida

- Health check: `http://localhost:8080/api/actuator/health`
- Login demo: `POST http://localhost:8080/api/auth/login`
- Tenant demo público: `GET http://localhost:8080/api/public/tenant/bella-vida-spa`

---

## Configuración local requerida

El archivo `backend/.env.local` debe existir y contener variables como estas:

```env
DATABASE_URL=jdbc:postgresql://aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require
DATABASE_USER=postgres.xxxxxxxxxxxxxxxxxxxx
DATABASE_PASSWORD=tu_password_de_supabase
JWT_SECRET=tu_jwt_secret
SPRING_PROFILES_ACTIVE=dev
```

Notas:
- No hace falta poner la password dentro de `DATABASE_URL`.
- Si la URL apunta al pooler de Supabase, el script agrega `prepareThreshold=0` para evitar errores de prepared statements.
- `backend/.env.local` no debería commitearse.

---

## 1. Estado Actual del Proyecto

✅ **Estado funcional actual:**

- ✅ Frontend corriendo en `http://localhost:5173` (Vite dev server con HMR)
- ✅ Backend corriendo en `http://localhost:8080/api` (Spring Boot + JWT)
- ✅ Conexión a Supabase mediante pooler desde local y también desde Railway
- ✅ Autenticación JWT implementada
- ✅ Controladores REST funcionales:
  - `AuthController` - Login y autenticación
  - `PublicBookingController` - Reservas públicas
  - `SuperAdminController` - Administración super usuario
  - `TenantAdminController` - Administración de tenant
- ✅ Entidades de dominio completas (User, Tenant, Professional, Service, Appointment, etc.)
- ✅ Servicios de negocio implementados
- ✅ Datos demo iniciales cargados en entorno local cuando la base está vacía

**Integración Frontend-Backend:** Configurada en `src/lib/api.ts` para `http://localhost:8080/api`

## 2. Stack tecnico

### Frontend

- React 19
- Vite 7
- TypeScript
- Tailwind CSS
- Lucide React

### Backend

- Java 21
- Spring Boot 3.2.3
- Spring Data JPA
- Spring Security
- Flyway
- PostgreSQL
- JWT (jjwt)
- Lombok
- MapStruct

### Base de datos

- PostgreSQL gestionado en Supabase (pooler para local y Railway)
- El backend usa `backend/.env.local` para cargar credenciales y conectarse al pooler

## 3. Estructura del repo

```txt
.
├─ src/                       # Frontend React
│  ├─ pages/                  # Landing, login, dashboards, booking
│  ├─ context/                # AuthContext (mock)
│  ├─ data/mock.ts            # Datos fake para demo UI
│  └─ components/ui/          # Componentes visuales
├─ backend/
│  ├─ src/main/java/com/turnow
│  │  ├─ domain/              # Entidades, repositorios, servicios
│  │  └─ infrastructure/       # Seguridad JWT y excepciones
│  ├─ src/main/resources/
│  │  ├─ application.yml
│  │  └─ application-prod.yml
│  └─ pom.xml
├─ package.json               # Scripts frontend
└─ vite.config.ts
```

## 4. Requisitos

- **Node.js** 20+ (verificar con `node -v`)
- **npm** 10+ (verificar con `npm -v`)
- **Java** 21 LTS (verificar con `java -version`)
- **Maven** 3.9+ (verificar con `mvn -version`)
- **Git** (para control de versiones)
- **Acceso a Supabase** para las credenciales de desarrollo local y Railway

## 5. Levantando el Proyecto Completo

### Ubicación del Proyecto

```text
C:\Users\(usuario)\Documents\turnow
```

### ✅ Pasos Rápidos (Recomendado)

#### 1️⃣ Backend (PowerShell o BAT)

```powershell
cd C:\Users\(usuario)\Documents\turnow
.\start-backend.ps1
```

Alternativa:

```batch
start-backend.bat
```

El script hace lo siguiente:
- carga `backend/.env.local`
- recompila el backend antes de arrancar
- usa `SPRING_PROFILES_ACTIVE=dev` si no está definido
- habilita compatibilidad con el pooler de Supabase (`prepareThreshold=0`)

**Resultado esperado:**
- `Tomcat started on port 8080 (http) with context path '/api'`
- backend disponible en `http://localhost:8080/api`

#### 2️⃣ Frontend (React + Vite)

```powershell
cd C:\Users\(usuario)\Documents\turnow
npm install   # primera vez
npm run dev
```

**Resultado esperado:**

```text
VITE ... ready
➜ Local: http://localhost:5173/
```

El frontend estará disponible en: **http://localhost:5173**

---

### ⚙️ Alternativa: Build de Producción

Si prefieres ejecutar las versiones compiladas:

```powershell
# Backend (ya compilado por el script de inicio)
cd C:\Users\(usuario)\Documents\turnow\backend
java -jar target\turnow-backend-1.0.0-SNAPSHOT.jar

# Frontend (en otra terminal)
cd C:\Users\(usuario)\Documents\turnow
npm run build
npm run preview   # Sirve en http://localhost:4173
```

## 6. URLs de Acceso

| Componente | URL | Puerto | Notas |
|-----------|-----|--------|-------|
| **Frontend** | http://localhost:5173 | 5173 | Vite dev server con HMR activo |
| **Backend API** | http://localhost:8080/api | 8080 | Context path: `/api` |
| **Health Check** | http://localhost:8080/api/actuator/health | - | Verificar backend activo |
| **Railway API** | `https://apidev-turnow.shift-ya.online/api` | - | Usa el `PORT` inyectado por Railway |

## 7. Primeros Pasos en la App

### Acceder a la App

1. Abre `http://localhost:5173` en tu navegador
2. Verás la landing page

### Navegación

- **Login** → Autenticación (JWT)
- **Super Admin Dashboard** → Gestión global (usuarios, tenants)
- **Tenant Admin Dashboard** → Gestión de tenant (profesionales, servicios)
- **Public Booking** → Reserva de turnos pública

### Endpoints del Backend

#### Salud
- `GET /api/actuator/health` - Verifica que el backend esté vivo

#### Autenticación
- `POST /api/auth/login` - Login con email/password

#### Público
- `GET /api/public/tenant/{slug}` - Datos públicos del tenant
- `GET /api/public/tenant/{slug}/services` - Servicios del tenant
- `GET /api/public/tenant/{slug}/professionals` - Profesionales del tenant
- `GET /api/public/tenant/{slug}/slots` - Slots disponibles
- `POST /api/public/tenant/{slug}/appointments` - Crear reserva
- `POST /api/public/appointments/cancel/{token}` - Cancelar reserva por token

## 8. Estructura del Proyecto

```
.
├─ src/                           # 📱 Frontend React
│  ├─ pages/
│  │  ├─ LandingPage.tsx          # Página de inicio
│  │  ├─ LoginPage.tsx            # Autenticación JWT
│  │  ├─ SuperAdminDashboard.tsx  # Panel admin global
│  │  ├─ TenantAdminDashboard.tsx # Panel admin tenant
│  │  └─ PublicBooking.tsx        # Reserva de turnos
│  ├─ components/ui/
│  │  ├─ MetricCard.tsx
│  │  └─ StatusBadge.tsx
│  ├─ context/
│  │  └─ AuthContext.tsx          # Contexto de autenticación
│  ├─ lib/
│  │  └─ api.ts                   # Cliente HTTP para backend
│  ├─ types/
│  │  └─ index.ts                 # Tipos TypeScript
│  ├─ utils/
│  │  └─ cn.ts                    # Utilidades CSS
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
│
├─ backend/                        # 🔙 Spring Boot + Java 21
│  ├─ src/main/java/com/turnow/
│  │  ├─ turnowApplication.java  # Punto de entrada
│  │  ├─ api/
│  │  │  ├─ AuthController.java
│  │  │  ├─ PublicBookingController.java
│  │  │  ├─ SuperAdminController.java
│  │  │  └─ TenantAdminController.java
│  │  ├─ domain/
│  │  │  ├─ appointment/          # Reservas/Citas
│  │  │  ├─ auth/                 # Autenticación
│  │  │  ├─ availability/         # Disponibilidad profesionales
│  │  │  ├─ notification/         # Notificaciones
│  │  │  ├─ professional/         # Profesionales
│  │  │  ├─ service/             # Servicios
│  │  │  ├─ tenant/              # Multi-tenant
│  │  │  └─ user/                # Usuarios
│  │  └─ infrastructure/
│  │     ├─ exception/           # Excepciones custom
│  │     ├─ security/            # JWT + Security config
│  │     └─ seed/                # Datos iniciales
│  ├─ src/main/resources/
│  │  ├─ application.yml          # Config dev
│  │  ├─ application-prod.yml     # Config producción
│  │  └─ db/migration/            # Flyway migrations
│  └─ pom.xml
│
├─ package.json                    # Scripts Node.js
├─ vite.config.ts                  # Configuración Vite
├─ tsconfig.json                   # Configuración TypeScript
└─ README.md                        # Este archivo
```

## 9. Variables de Entorno y Configuración

### Backend local

El backend local lee `backend/.env.local` automáticamente desde `start-backend.ps1` o `start-backend.bat`.

Ejemplo de contenido:

```env
DATABASE_URL=jdbc:postgresql://aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require
DATABASE_USER=postgres.xxxxxxxxxxxxxxxxxxxx
DATABASE_PASSWORD=tu_password_de_supabase
JWT_SECRET=tu_jwt_secret
SPRING_PROFILES_ACTIVE=dev
```

Notas:
- Si usas el pooler de Supabase, el script agrega `prepareThreshold=0` para evitar errores de prepared statements.
- El backend recompila antes de arrancar, así que no necesitas ejecutar `mvn package` manualmente.
- `HIBERNATE_DDL_AUTO=update` puede usarse temporalmente para bootstrap si la base está vacía.

### Railway

Usa variables equivalentes en Railway:
- `DATABASE_URL`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `PORT` lo inyecta Railway automáticamente

## 10. Troubleshooting

### ❌ El backend no arranca localmente

1. Verifica que exista `backend/.env.local`
2. Ejecuta `.\start-backend.ps1` desde la raiz del repo
3. Revisa el log y confirma que aparezca `Tomcat started on port 8080`

### ❌ Error de conexión a Supabase

1. Verifica que `DATABASE_URL` apunte al pooler `aws-1-us-east-2.pooler.supabase.com:6543`
2. Confirma que `DATABASE_USER` y `DATABASE_PASSWORD` sean válidos
3. Si aparece `prepared statement already exists`, revisa que el script haya aplicado `prepareThreshold=0`

### ❌ Error de schema vacío

Si la base de Supabase está vacía y ves errores de tablas faltantes:

```powershell
$env:HIBERNATE_DDL_AUTO="update"
.\start-backend.ps1
```

Luego podés volver a `validate` si querés dejar el entorno más estricto.

### ❌ Puerto 5173 o 8080 ya está en uso

```powershell
netstat -ano | findstr :5173
netstat -ano | findstr :8080

taskkill /PID <pid> /F
```

### ❌ Frontend no carga después de `npm run dev`

```powershell
npm cache clean --force
npm install
npm run dev
```

### ❌ Error de conexión API Frontend-Backend

1. Verificar que el backend esté corriendo en `http://localhost:8080/api`
2. Revisar `src/lib/api.ts` si la URL está correcta
3. Verificar CORS en backend
4. Revisar la consola del navegador

## 11. Scripts Disponibles

### Backend

```powershell
.\start-backend.ps1
start-backend.bat
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

### Backend

```bash
cd backend

# Compilar
mvn clean compile

# Ejecutar tests
mvn test

# Build sin tests
mvn clean package -DskipTests

# Ejecutar Spring Boot
mvn spring-boot:run

# Ver dependencias
mvn dependency:tree
```

## 12. Bases de Datos

### Acceder a PostgreSQL

```powershell
# Con psql (si está instalado)
psql -h localhost -U postgres -d turnow

# O usar pgAdmin4 (GUI)
# http://localhost:5050 (si lo tienes levantado)
```

### Ver tablas creadas

```sql
\dt  -- psql
```

Tablas principales:
- `users` - Usuarios del sistema
- `tenants` - Organizaciones/Negocios
- `professionals` - Profesionales
- `services` - Servicios ofrecidos
- `appointments` - Reservas/Citas
- `availability` - Disponibilidad profesional

## 13. Deployment a Producción

### Docker Compose (opcional)

Crear `docker-compose.yml`:

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: turnow
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: jdbc:postgresql://postgres:5432/turnow
      DATABASE_USER: postgres
      DATABASE_PASSWORD: postgres
    depends_on:
      - postgres

  frontend:
    build: .
    ports:
      - "80:5173"
```

Ejecutar:

```bash
docker-compose up -d
```

## 14. Contacto y Soporte

- **Proyecto**: turnow SaaS Multi-tenant
- **Versión**: 1.0.0
- **Estado**: En desarrollo
- **Última actualización**: 13 de Abril 2026

- DDD simplificado por dominio.
- Entidades JPA en `domain/*/entity`.
- Repositorios en `domain/*/repository`.
- Casos de negocio en `domain/*/service`.

### Dominios implementados

- `tenant`
- `user`
- `professional`
- `service`
- `availability`
- `appointment`
- `notification`
- `auth` (DTOs)

### Logica de turnos

`AppointmentService` implementa:

- crear turno con validaciones
- detectar conflictos de agenda
- cancelar por token publico
- cancelar por admin
- completar turno
- marcar no-show

Reglas destacadas:

- evita doble reserva en mismo horario/profesional
- respeta minimo y maximo de anticipacion por tenant
- controla ventanas de cancelacion

### Disponibilidad

`SlotCalculatorService` calcula slots:

1. toma disponibilidad semanal del profesional
2. divide por duracion del servicio
3. descuenta turnos ya reservados
4. descuenta bloqueos manuales
5. descarta slots pasados (si la fecha es hoy)

### Seguridad JWT

Infraestructura disponible:

- `JwtTokenProvider`
- `JwtAuthenticationFilter`

Nota:

- Falta configuracion completa de `SecurityFilterChain`.
- Falta capa de endpoints para login/autorizacion real.

## 8. Modelo de datos (tablas principales)

Con backend levantado sobre PostgreSQL se crean/usan tablas:

- `tenants`
- `tenant_settings`
- `users`
- `professionals`
- `services`
- `professional_services`
- `availabilities`
- `availability_blocks`
- `appointments`
- `notifications`
- `flyway_schema_history`

## 9. Variables de configuracion utiles

Definidas en `backend/src/main/resources/application.yml`:

- `server.port` (default `8080`)
- `server.servlet.context-path` (default `/api`)
- `DATABASE_URL` (Supabase pooler en local y Railway)
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `CORS_ORIGINS`
- `FRONTEND_URL`

Variable útil temporal de desarrollo:

- `HIBERNATE_DDL_AUTO=update`

## 10. Comandos operativos útiles

### Backend local

```powershell
cd C:\Users\(usuario)\Documents\turnow
.\start-backend.ps1
```

### Frontend local

```powershell
cd C:\Users\(usuario)\Documents\turnow
npm run dev
```

## 11. Troubleshooting

### Error backend: `prepared statement already exists`

Causa:

- La URL está apuntando al pooler de Supabase y el driver está usando prepared statements.

Solución:

- Dejá que `start-backend.ps1` agregue `prepareThreshold=0` automáticamente.

### Error backend en DB vacía por schema

Causa:

- La base de Supabase no tiene tablas todavía.

Solución temporal:

```powershell
$env:HIBERNATE_DDL_AUTO='update'
.\start-backend.ps1
```

### Frontend no abre en 5173

Verificar proceso y puerto:

```powershell
curl -I http://localhost:5173
```

## 12. Roadmap recomendado

Para pasar de demo a producto integrable:

1. Crear controladores REST por dominio (`auth`, `appointments`, `availability`, etc.).
2. Implementar `SecurityFilterChain` y flujos de login/refresh token.
3. Agregar migraciones Flyway reales (`V1__init.sql`, etc.).
4. Conectar frontend a API real y remover dependencia de `mock.ts`.
5. Agregar tests (unitarios + integracion + e2e).

---



