# turnow - Guía Completa del Proyecto

Proyecto **SaaS multi-tenant** para gestión de turnos con autenticación JWT, disponibilidad de profesionales y bookings.

Este repositorio integra:

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Backend**: Spring Boot 3.2.3 + Java 21 + PostgreSQL
- **Arquitectura**: Multi-tenant con autenticación JWT y roles (SUPER_ADMIN, TENANT_ADMIN, PROFESSIONAL, USER)

---

## 🚀 Quick Start (5 minutos)

Si solo quieres levantar el proyecto rápidamente:

```powershell
# Terminal 1: Backend
cd C:\Users\(usuario)\Documents\turnow\backend
mvn clean package -q  # Primera vez
java -jar target/turnow-backend-1.0.0-SNAPSHOT.jar
# ✅ Backend en: http://localhost:8080/api

# Terminal 2: Frontend
cd C:\Users\(usuario)\Documents\turnow
npm install  # Primera vez
npm run dev
# ✅ Frontend en: http://localhost:5173
```

**Requisito:** PostgreSQL 17 corriendo en `localhost:5432` con:
- Usuario: `postgres`
- Contraseña: `(tu pass de postgres)`

---

## 1. Estado Actual del Proyecto

✅ **Estado en Producción Local:**

- ✅ Frontend corriendo en http://localhost:5173 (Vite dev server con HMR)
- ✅ Backend corriendo en http://localhost:8080/api (Spring Boot + JWT)
- ✅ PostgreSQL funcional (instalado localmente en puerto 5432)
- ✅ Autenticación JWT implementada
- ✅ Controladores REST funcionales:
  - `AuthController` - Login, logout, autenticación
  - `PublicBookingController` - Reservas públicas
  - `SuperAdminController` - Administración super usuario
  - `TenantAdminController` - Administración de tenant
- ✅ Entidades de dominio completas (User, Tenant, Professional, Service, Appointment, etc.)
- ✅ Servicios de negocio implementados
- ✅ Base de datos `turnow` automáticamente creada en el primer inicio

**Integración Frontend-Backend:** Configurada en `src/lib/api.ts` (http://localhost:8080/api)

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

- PostgreSQL 17 (instalado localmente)
- DB: `turnow` (auto-creada)

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
- **PostgreSQL** 17+ (instalado localmente en puerto 5432)
  - Usuario: `postgres`
  - Contraseña: `postgres` (ó tu pass de Postgres)
  - Base de datos: `turnow` (se crea automáticamente en el primer inicio)
- **Git** (para control de versiones)

## 5. Levantando el Proyecto Completo

### Ubicación del Proyecto
```
C:\Users\(usuario)\Documents\turnow
```

### ✅ Pasos Rápidos (Recomendado)

#### 1️⃣ Verificar PostgreSQL

```powershell
# Asegúrate de que PostgreSQL 17 está corriendo
# La BD "turnow" se crea automáticamente en el primer inicio del backend
```

#### 2️⃣ Backend (Spring Boot) - Terminal 1

```powershell
cd C:\Users\(usuario)\Documents\turnow\backend

# Primera vez: compilar
mvn clean package

# Iniciar el servidor
java -jar target/turnow-backend-1.0.0-SNAPSHOT.jar
```

**Resultado esperado:**
```
Started turnowApplication in X.XXX seconds
2026-04-16 09:25:00.000  INFO 1234 --- [main] com.turnow.turnowApplication : Started
```

El backend estará disponible en: **http://localhost:8080/api**

#### 3️⃣ Frontend (React + Vite) - Terminal 2

```powershell
cd C:\Users\(usuario)\Documents\turnow

# Primera vez: instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

**Resultado esperado:**
```
  VITE v7.2.4  ready in 1625 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

El frontend estará disponible en: **http://localhost:5173**

---

### ⚙️ Alternativa: Build de Producción

Si prefieres ejecutar las versiones compiladas:

```powershell
# Backend (ya compilado con mvn clean package)
cd C:\Users\(usuario)\Documents\turnow\backend
java -jar target/turnow-backend-1.0.0-SNAPSHOT.jar

# Frontend (en otra terminal)
cd C:\Users\(usuario)\Documents\turnow
npm run build  # Genera dist/index.html
npm run preview  # Sirve en http://localhost:4173
```

## 6. URLs de Acceso

| Componente | URL | Puerto | Notas |
|-----------|-----|--------|-------|
| **Frontend** | http://localhost:5173 | 5173 | Vite dev server con HMR activo |
| **Backend API** | http://localhost:8080/api | 8080 | Context path: `/api` |
| **PostgreSQL** | localhost:5432 | 5432 | User: `postgres`, Pass: `(tu pass de postgres)` |
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

## 9. Configuración Avanzada

### Variables de Entorno Backend

Crear archivo `.env` en la raíz de `backend/` o definir en powershell:

```powershell
# Base de Datos
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/turnow"
$env:DATABASE_USER="postgres"
$env:DATABASE_PASSWORD="(tu pass de postgres)"

# JWT (generar con: openssl rand -base64 32)
$env:JWT_SECRET="tu-secret-key-muy-segura"
$env:JWT_EXPIRATION="86400000"  # 24 horas en ms

# Email (opcional, para notificaciones)
$env:MAIL_HOST="smtp.gmail.com"
$env:MAIL_PORT="587"
$env:MAIL_USERNAME="tu-email@gmail.com"
$env:MAIL_PASSWORD="tu-app-password"

# Hibernate (opciones: update | validate | create-drop)
$env:SPRING_JPA_HIBERNATE_DDL_AUTO="update"
```

**Nota:** La aplicación usa variables de entorno con fallbacks en `application.yml`. Puedes usar cualquiera de estos métodos.

## 10. Troubleshooting

### ❌ Frontend no inicia

```powershell
# Limpiar caché y reinstalar
rm node_modules -Recurse -Force
npm install
npm run dev
```

### ❌ Backend falla al conectar a BD

```powershell
# 1️⃣ Verificar que PostgreSQL está corriendo
Get-Service -Name postgresql-x64-17 | Select-Object Status

# 2️⃣ Conectar manualmente a PostgreSQL
"C:\Program Files\PostgreSQL\17\bin\psql" -U postgres -h localhost -c "SELECT version();"

# 3️⃣ Verificar que existe la BD "turnow"
"C:\Program Files\PostgreSQL\17\bin\psql" -U postgres -h localhost -c "\l"

# 4️⃣ Si falta la BD, crearla
"C:\Program Files\PostgreSQL\17\bin\psql" -U postgres -h localhost -c "CREATE DATABASE turnow;"

# 5️⃣ Verificar credenciales en backend/src/main/resources/application.yml
# Usuario: postgres
# Contraseña: (tu pass de postgres)
```

### ❌ Puerto 5173 o 8080 ya está en uso

```powershell
# Encontrar proceso usando puerto
netstat -ano | findstr :5173
netstat -ano | findstr :8080

# Matar proceso (ejemplo PID 1234)
taskkill /PID 1234 /F

# O cambiar puerto en aplicación (si es necesario)
```

### ❌ Backend no compila - Error Maven

```powershell
cd backend

# Limpiar caché y reintentar
mvn clean install -U

# Si persiste, verificar Java
java -version  # Debe ser 21.x

# Verificar Maven
mvn -version   # Debe ser 3.9+
```

### ❌ Frontend no carga después de npm run dev

```powershell
# Limpiar caché de npm
npm cache clean --force

# Reinstalar dependencias
npm install

# Reintentar
npm run dev
```

### ❌ Error de conexión API Frontend-Backend

1. Verificar que backend está corriendo en `http://localhost:8080`
2. Revisar `src/lib/api.ts` - URL debe ser correcta
3. Verificar CORS en backend (Spring Security)
4. Revisar browser console (F12) para mensajes de error

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
- `DATABASE_URL` (default `jdbc:postgresql://localhost:5432/turnow`)
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
docker logs -f turnow-postgres
```

### Entrar a PostgreSQL y listar tablas

```powershell
docker exec -it turnow-postgres psql -U postgres -d turnow -c "\dt"
```

### Parar PostgreSQL

```powershell
docker stop turnow-postgres
```

### Volver a iniciar PostgreSQL

```powershell
docker start turnow-postgres
```

### Borrar contenedor y datos (solo si queres resetear)

```powershell
docker rm -f turnow-postgres
```

## 11. Troubleshooting

### Error backend: `Connection to localhost:5432 refused`

Causa:

- PostgreSQL no esta corriendo.

Solucion:

```powershell
docker start turnow-postgres
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

