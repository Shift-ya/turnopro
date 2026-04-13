# TurnoPro - Guía Completa del Proyecto

Proyecto **SaaS multi-tenant** para gestión de turnos con autenticación JWT, disponibilidad de profesionales y bookings.

Este repositorio integra:

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Backend**: Spring Boot 3.2.3 + Java 21 + PostgreSQL
- **Arquitectura**: Multi-tenant con autenticación JWT y roles (SUPER_ADMIN, TENANT_ADMIN, PROFESSIONAL, USER)

## 1. Estado Actual del Proyecto

✅ **Estado en Producción Local:**

- ✅ Frontend corriendo en http://localhost:5173 (Vite dev server con HMR)
- ✅ Backend corriendo en http://localhost:8080/api (Spring Boot + JWT)
- ✅ PostgreSQL funcional en Docker (puerto 5432)
- ✅ Autenticación JWT implementada
- ✅ Controladores REST funcionales:
  - `AuthController` - Login, logout, autenticación
  - `PublicBookingController` - Reservas públicas
  - `SuperAdminController` - Administración super usuario
  - `TenantAdminController` - Administración de tenant
- ✅ Entidades de dominio completas (User, Tenant, Professional, Service, Appointment, etc.)
- ✅ Servicios de negocio implementados

**Integración Frontend-Backend:** Parcialmente integrada, con API client configurado en `src/lib/api.ts`

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

- PostgreSQL 16 (en Docker)
- DB: `turnopro`

## 3. Estructura del repo

```txt
.
├─ src/                       # Frontend React
│  ├─ pages/                  # Landing, login, dashboards, booking
│  ├─ context/                # AuthContext (mock)
│  ├─ data/mock.ts            # Datos fake para demo UI
│  └─ components/ui/          # Componentes visuales
├─ backend/
│  ├─ src/main/java/com/turnopro
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
- **Java** 21 (verificar con `java -version`)
- **Maven** 3.9+ (verificar con `mvn -version`)
- **Docker Desktop** (para PostgreSQL)
- **Git** (para control de versiones)

## 5. Levantando el Proyecto Completo

### Ubicación del Proyecto
```
C:\Users\Malu\Documents\saas-multi-tenant-arquitectura-back\saas-multi-tenant-arquitectura-back
```

### Opción A: Levantamiento Automático (Recomendado)

#### 1️⃣ Base de Datos (PostgreSQL en Docker)

```powershell
# Verificar que Docker Desktop está corriendo
docker ps

# Si el contenedor ya existe y está parado:
docker start turnopro-postgres

# Si es primera vez, crearlo:
docker run -d `
  --name turnopro-postgres `
  -e POSTGRES_DB=turnopro `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -p 5432:5432 `
  postgres:16-alpine
```

#### 2️⃣ Frontend (Vite Dev Server)

```powershell
cd "C:\Users\Malu\Documents\saas-multi-tenant-arquitectura-back\saas-multi-tenant-arquitectura-back"
npm install  # Solo primera vez
npm run dev
```

**Resultado esperado:**
```
  VITE v7.2.4  ready in 1625 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### 3️⃣ Backend (Spring Boot)

En **otra terminal**:

```powershell
cd "C:\Users\Malu\Documents\saas-multi-tenant-arquitectura-back\saas-multi-tenant-arquitectura-back\backend"
mvn clean install  # Primera vez para descargar dependencias
mvn spring-boot:run
```

**Resultado esperado:**
```
Started TurnoproApplication in X.XXX seconds
```

### Opción B: Con Build Previo

```powershell
# Backend
cd backend
mvn clean package
java -jar target/turnopro-backend-1.0.0-SNAPSHOT.jar

# Frontend (otra terminal)
npm run build
npm run preview
```

## 6. URLs de Acceso

| Componente | URL | Puerto | Notas |
|-----------|-----|--------|-------|
| **Frontend** | http://localhost:5173 | 5173 | Vite con HMR activo |
| **Backend API** | http://localhost:8080/api | 8080 | Context path: `/api` |
| **PostgreSQL** | localhost:5432 | 5432 | User: `postgres`, Pass: `postgres` |
| **Health Check** | http://localhost:8080/api/actuator/health | - | Verificar backend activo |

## 7. Primeros Pasos en la App

### Acceder a la App

1. Abre http://localhost:5173 en tu navegador
2. Verás la **Landing Page**

### Navegación

- **Landing Page** → Inicio
- **Login** → Autenticación (implementado con JWT)
- **Super Admin Dashboard** → Gestión global (usuarios, tenants)
- **Tenant Admin Dashboard** → Gestión de tenant (profesionales, servicios)  
- **Public Booking** → Reserva de turnos pública

### Endpoints del Backend

#### Autenticación
- `POST /api/auth/login` - Login con email/password
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token JWT

#### Público
- `GET /api/public/bookings` - Listar turnos disponibles
- `POST /api/public/bookings` - Crear reserva

#### Admin
- `GET /api/super-admin/users` - Listar usuarios (super admin)
- `GET /api/tenant-admin/professionals` - Listar profesionales
- `POST /api/tenant-admin/services` - Crear servicio

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
│  ├─ src/main/java/com/turnopro/
│  │  ├─ TurnoproApplication.java  # Punto de entrada
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

## 9. Configuración Avanzada

### Variables de Entorno Backend

Crear archivo `.env` en la raíz o definir en powershell:

```powershell
# Base de Datos
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/turnopro"
$env:DATABASE_USER="postgres"
$env:DATABASE_PASSWORD="postgres"

# JWT
$env:JWT_SECRET="tu-secret-key-muy-segura"
$env:JWT_EXPIRATION="86400000"  # 24 horas en ms

# Email (opcional)
$env:MAIL_HOST="smtp.gmail.com"
$env:MAIL_PORT="587"
$env:MAIL_USERNAME="tu-email@gmail.com"
$env:MAIL_PASSWORD="tu-app-password"

# Hibernate
$env:SPRING_JPA_HIBERNATE_DDL_AUTO="update"  # update | validate | create-drop
```

### Variables de Entorno Frontend

El frontend ya está configurado en `src/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8080/api';
```

Si necesitas cambiar, crear `.env` en la raíz:

```
VITE_API_URL=http://tu-backend:8080/api
```

## 10. Troubleshooting

### ❌ Frontend no inicia

```powershell
# Limpiar caché y reinstalar
rm node_modules -Recurse -Force
npm install
npm run dev
```

### ❌ Backend falla al conectar BD

```powershell
# Verificar que PostgreSQL está corriendo
docker ps | findstr postgres

# Ver logs del contenedor
docker logs turnopro-postgres

# Reiniciar contenedor
docker restart turnopro-postgres
```

### ❌ Puerto 5173 o 8080 ya está en uso

```powershell
# Encontrar proceso usando puerto
netstat -ano | findstr :5173
netstat -ano | findstr :8080

# Matar proceso (ejemplo PID 1234)
taskkill /PID 1234 /F
```

### ❌ Error de dependencias Maven

```powershell
cd backend
mvn clean install -U  # -U fuerza descarga de artifacts nuevos
```

### ❌ HMR (Hot Module Reload) no funciona en frontend

Verificar en `vite.config.ts` que HMR está habilitado:

```typescript
server: {
  hmr: true
}
```

## 11. Scripts Disponibles

### Frontend

```bash
npm run dev       # Iniciar servidor dev (http://localhost:5173)
npm run build     # Build para producción
npm run preview   # Previsualizar build en local
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
psql -h localhost -U postgres -d turnopro

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
      POSTGRES_DB: turnopro
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: jdbc:postgresql://postgres:5432/turnopro
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

- **Proyecto**: TurnoPro SaaS Multi-tenant
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
- `DATABASE_URL` (default `jdbc:postgresql://localhost:5432/turnopro`)
- `DATABASE_USER` (default `postgres`)
- `DATABASE_PASSWORD` (default `postgres`)
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `CORS_ORIGINS`
- `FRONTEND_URL`

Variable util temporal de desarrollo:

- `SPRING_JPA_HIBERNATE_DDL_AUTO=update`

## 10. Comandos operativos utiles

### Ver logs PostgreSQL

```powershell
docker logs -f turnopro-postgres
```

### Entrar a PostgreSQL y listar tablas

```powershell
docker exec -it turnopro-postgres psql -U postgres -d turnopro -c "\dt"
```

### Parar PostgreSQL

```powershell
docker stop turnopro-postgres
```

### Volver a iniciar PostgreSQL

```powershell
docker start turnopro-postgres
```

### Borrar contenedor y datos (solo si queres resetear)

```powershell
docker rm -f turnopro-postgres
```

## 11. Troubleshooting

### Error backend: `Connection to localhost:5432 refused`

Causa:

- PostgreSQL no esta corriendo.

Solucion:

```powershell
docker start turnopro-postgres
```

### Error backend en DB vacia por schema

Causa:

- No hay migraciones Flyway versionadas en `db/migration`.

Solucion temporal:

```powershell
$env:SPRING_JPA_HIBERNATE_DDL_AUTO='update'
mvn spring-boot:run
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

