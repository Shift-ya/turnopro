# 📊 Análisis Completo: turnow

**Fecha de análisis:** 5 de Mayo, 2026  
**Estado del proyecto:** En desarrollo (JWT implementado, routing finalizado)

---

## 🏗️ ARQUITECTURA GENERAL

```
Frontend (React 19.2.3 + TypeScript + Vite)    ↔    Backend (Spring Boot + Java)
  └─ SPA (Single Page Application)                    └─ REST API
```

---

## 📋 BACKEND (Java/Spring Boot)

### ✅ ENDPOINTS IMPLEMENTADOS

#### 1️⃣ **Autenticación** (`/auth`)
- ✅ `POST /auth/login` - Login con email/password + JWT
  - Request: `{ email, password }`
  - Response: `{ accessToken, tokenType, expiresIn, userId, tenantId, email, fullName, role }`
  - JWT firmado con HS256, válido por 24h
  - Roles: SUPER_ADMIN, TENANT_ADMIN, STAFF, CLIENT
  - Password encoding: BCrypt con fallback a plaintext

#### 2️⃣ **Super Admin** (`/admin/super`)
- ✅ `GET /admin/super/overview` - Dashboard global
  - Retorna: Total tenants, activos, appointments, revenue, crecimiento mensual, planes
- ✅ `GET /admin/super/tenants` - Listar tenants (con búsqueda)
- ✅ `POST /admin/super/tenants` - Crear nuevo tenant
- ✅ `PATCH /admin/super/tenants/{tenantId}/status` - Actualizar estado
- ✅ `DELETE /admin/super/tenants/{tenantId}` - Eliminar tenant

#### 3️⃣ **Tenant Admin** (`/admin/tenant`)
- ✅ `GET /admin/tenant/{tenantId}/overview` - Dashboard del admin del negocio
  - Incluye: Tenant info, métricas, appointments, profesionales, servicios
- ✅ `GET /admin/tenant/{tenantId}/appointments` - Listar citas (filtrable por fecha)
- ✅ `GET /admin/tenant/{tenantId}/professionals` - Listar profesionales
- ✅ `POST /admin/tenant/{tenantId}/professionals` - Crear profesional
- ✅ `PUT /admin/tenant/{tenantId}/professionals/{professionalId}` - Editar profesional
- ✅ `DELETE /admin/tenant/{tenantId}/professionals/{professionalId}` - Eliminar profesional
- ✅ `GET /admin/tenant/{tenantId}/services` - Listar servicios
- ✅ `POST /admin/tenant/{tenantId}/services` - Crear servicio
- ✅ `PUT /admin/tenant/{tenantId}/services/{serviceId}` - Editar servicio
- ✅ `DELETE /admin/tenant/{tenantId}/services/{serviceId}` - Eliminar servicio
- ✅ `PUT /admin/tenant/{tenantId}/settings` - Actualizar configuración (colores, etc)

#### 4️⃣ **Public Booking** (`/public`)
- ✅ `GET /public/tenant/{slug}` - Obtener info pública del negocio
- ✅ `GET /public/tenant/{slug}/services` - Listar servicios públicos
- ✅ `GET /public/tenant/{slug}/professionals` - Listar profesionales (filtrable por servicio)
- ✅ `GET /public/tenant/{slug}/slots` - Obtener horarios disponibles
  - Params: professionalId, serviceId, date
- ✅ `POST /public/tenant/{slug}/appointments` - Crear cita
- ✅ `POST /public/appointments/cancel/{token}` - Cancelar cita por token

### 🛠️ SERVICIOS IMPLEMENTADOS
- **SlotCalculatorService** - Calcula horarios disponibles
- **AppointmentService** - Gestiona citas
- **TenantSettingsRepository** - Configuración por tenant (colores, etc)

### 🔒 SEGURIDAD
- ✅ **JWT implementado** - HS256 firmado, claims: userId, tenantId, role, email (sub)
- ✅ **JwtAuthenticationFilter** - Valida token en cada request
- ✅ **@PreAuthorize** - Control de acceso por rol en endpoints admin
- ✅ **CORS configurado** - Permite localhost en dev, dominios específicos en prod
- ✅ **Session stateless** (sin cookies de sesión)
- ✅ **CSRF deshabilitado** (apropiado para SPA con JWT)
- ✅ **Password encoding** - BCrypt con fallback a plaintext para migración
- ✅ **Environment-based secrets** - JWT_SECRET via env var en dev/prod

---

## 🎨 FRONTEND (React 19 + TypeScript)

### ✅ PÁGINAS IMPLEMENTADAS

#### 1️⃣ **Landing Page** (`LandingPage.tsx`)
- ✅ Página pública de bienvenida
- ✅ Botones: "Iniciar sesión" y "Reservar turno"

#### 2️⃣ **Login** (`LoginPage.tsx`)
- ✅ Formulario de login (email + password)
- ✅ Integrado con AuthContext
- ✅ Validaciones básicas

#### 3️⃣ **Public Booking** (`PublicBooking.tsx`)
- ✅ 3-step booking wizard:
  - Step 1: Seleccionar servicio
  - Step 2: Seleccionar profesional y fecha
  - Step 3: Seleccionar hora y datos del cliente
- ✅ Calendario interactivo
- ✅ Carga de horarios disponibles en tiempo real
- ✅ Demo hardcodeado con slug: `bella-vida-spa`

#### 4️⃣ **Tenant Admin Dashboard** (`TenantAdminDashboard.tsx`)
- ✅ 5 pestañas (Tabs):
  - Dashboard: Métricas y citas recientes
  - Calendario: Ver citas por fecha
  - Profesionales: Listar, crear, editar, eliminar
  - Servicios: Listar, crear, editar, eliminar
  - Configuración: Actualizar datos del negocio
- ✅ Carga datos desde API
- ✅ Interfaz responsive con sidebar

#### 5️⃣ **Super Admin Dashboard** (`SuperAdminDashboard.tsx`)
- ✅ 3 pestañas:
  - Overview: Métricas globales
  - Tenants: Listar, crear, buscar, cambiar estado, eliminar
  - Plans: Información de planes (UI)
- ✅ Búsqueda de tenants
- ✅ Interfaz responsiva

### 🔌 API CLIENT (`src/lib/api.ts`)

```typescript
Métodos disponibles:
- login()
- superOverview()
- listTenants()
- createTenant()
- updateTenantStatus()
- deleteTenant()
- tenantOverview()
- listTenantAppointments()
- listTenantProfessionals()
- createTenantProfessional()
- updateTenantProfessional()
- deleteTenantProfessional()
- getPublicTenant()
- getPublicServices()
- getPublicProfessionals()
- getPublicSlots()
- createPublicAppointment()
```

### 🎭 CONTEXTO DE AUTENTICACIÓN
- ✅ **AuthContext** - Maneja user + token binding
- ✅ **JWT persistence** - Token almacenado en localStorage['turnow_token']
- ✅ **Session hydration** - Lee token + user al cargar la página
- ✅ **Token propagation** - Bearer token enviado en Authorization header
- ✅ **isAuthenticated** - Requiere user + token (no solo uno)
- ✅ **isReady** - Previene redirects prematuros durante hydration

### 🎨 COMPONENTES UI
- ✅ MetricCard - Tarjeta de métrica
- ✅ StatusBadge - Badge de estado
- ✅ BaseFormDialog - Dialog genérico reutilizable para formularios
- ✅ EditProfessionalDialog - Modal para editar profesionales
- ✅ EditServiceDialog - Modal para editar servicios
- ✅ CreateProfessionalDialog - Modal para crear profesionales
- ✅ CreateServiceDialog - Modal para crear servicios
- ✅ Toast system - Notificaciones con sonner + framer-motion

---

## ⚙️ RUNTIME CONFIG (Dev/Prod)

### 📁 Configuración Frontend

**Archivo:** `src/lib/runtimeConfig.ts`
- ✅ Detección automática de ambiente por hostname
- ✅ Carga dinámica de configuración desde `/config.json` o `/config.development.json`
- ✅ Endpoints configurables por ambiente

**Ambientes:**
- **Local** → API: `https://apidev-turnow.shiftya.online/api` (forces dev mode)
- **Dev** → API: `https://apidev-turnow.shiftya.online/api`
- **Prod** → API: `https://api-turnow.shiftya.online/api`

**Archivos de config:**
- `public/config.development.json` - Dev (incluido en git)
- `public/config.json` - Prod (actualizar en deployment)

---

## 🛣️ REACT ROUTER (Routing implementado)

### ✅ Estructura de Rutas
```
/ → LandingRoute (detecta ambiente y redirige)
  ├─ /login → RequireGuestLayout → LoginPage (solo sin autenticación)
  ├─ /dashboard → RequireAuthLayout → DashboardRoute
  │   ├─ /super-admin → SuperAdminDashboard (si role=SUPER_ADMIN)
  │   └─ /tenant-admin → TenantAdminDashboard (si role=TENANT_ADMIN)
  └─ /booking → PublicBooking (sin protección)
```

### ✅ Guards Implementados (Layouts Separados)

**RequireAuthLayout** (`src/routes/RequireAuthLayout.tsx`)
- Valida: `isReady && isAuthenticated`
- Si falla → Redirige a `/login`
- Renderiza: `<Outlet />` para nested routes

**RequireGuestLayout** (`src/routes/RequireGuestLayout.tsx`)
- Valida: Usuario NO autenticado
- Si falla → Redirige a `/dashboard`
- Permite login sin estar logueado

**LandingRoute** (`src/routes/LandingRoute.tsx`)
- En localhost/dev → Redirige a `/login`
- En prod → Redirige a landing URL externa

**DashboardRoute** (`src/routes/DashboardRoute.tsx`)
- Renderiza dashboard según rol
- SUPER_ADMIN → SuperAdminDashboard
- TENANT_ADMIN → TenantAdminDashboard

---

## 🔴 GAPS Y FUNCIONALIDADES FALTANTES

### BACKEND
| Funcionalidad | Estado | Prioridad | Notas |
|---|---|---|---|
| **Refresh token** | ❌ Sin implementar | 🔴 CRÍTICA | Endpoint separado para renovar token |
| **Logout endpoint** | ❌ Sin implementar | 🟡 MEDIA | Blacklist de tokens (opcional, solo client-side por ahora) |
| **Notificaciones por email** | ❌ Sin implementar | 🟡 MEDIA | Reminders y confirmaciones de cita |
| **Disponibilidad (Availability)** | ✅ Parcial | 🟡 MEDIA | SlotCalculator existe pero incompleto |
| **Cancelación de citas** | ⚠️ Existe por token | 🟢 BAJA | Pero falta validación adicional |
| **Validación de datos** | ⚠️ Básica | 🟡 MEDIA | Agregar más @Valid decorators |

### FRONTEND
| Funcionalidad | Estado | Prioridad | Notas |
|---|---|---|---|
| **Refresh token automático** | ❌ No implementado | 🔴 CRÍTICA | Renovar JWT antes de expirar |
| **Error handling 401/403** | ⚠️ Parcial | 🟡 MEDIA | Redirigir a login si token inválido |
| **Editar tenant (admin)** | ❌ Sin UI | 🟡 MEDIA | Está en backend, falta frontend |
| **Filtros avanzados** | ❌ Sin implementar | 🟢 BAJA | Por fecha, estado, etc |
| **Exportar datos** | ❌ Sin implementar | 🟢 BAJA | CSV, PDF |
| **Responsive design mobile** | ⚠️ Parcial | 🟢 BAJA | Sidebar existe pero mejorable |

---

## 🎨 COMPONENTES UI IMPLEMENTADOS (✅ 5 Mayo 2026)

### Estructura Base Creada

Se implementó una **arquitectura reutilizable de componentes UI** con soporte para variantes de formularios tipo dialog. Esto permite agregar nuevos dialogs de forma rápida sin duplicar código.

#### 1️⃣ Componentes UI Primitivos (`/src/components/ui/`)
- **`dialog.tsx`** - Dialog base con Radix UI (DialogContent, DialogHeader, etc.)
- **`button.tsx`** - Button reutilizable con variantes (default, outline, ghost, destructive)
- **`input.tsx`** - Input con estilos Tailwind
- **`label.tsx`** - Label para formularios
- **`toaster.tsx`** - Notificaciones con sonner

#### 2️⃣ Componente Base Reutilizable (`/src/components/dialogs/`)
- **`BaseFormDialog.tsx`** - Componente **genérico** para crear dialogs con formularios
  - Maneja lógica de abrir/cerrar
  - Renderiza campos dinámicamente (text, email, textarea, select)
  - Valida campos requeridos
  - Estados de loading automáticos
  - Trigger personalizable (botón o componente custom)

#### 3️⃣ Dialogs Especializados - CRUD Profesionales
- **`CreateProfessionalDialog.tsx`** - Dialog para crear profesionales
  - ✅ Campos: firstName, lastName, email, phone, speciality
  - ✅ Animaciones elegantes
  - ✅ Integrado en TenantAdminDashboard
- **`EditProfessionalDialog.tsx`** - Dialog para editar profesionales
  - ✅ Campos: firstName, lastName, email, phone, speciality (con defaultValue)
  - ✅ Animaciones elegantes (cascada de entrada)
  - ✅ Integrado en TenantAdminDashboard

#### 4️⃣ Dialogs Especializados - CRUD Servicios
- **`CreateServiceDialog.tsx`** - Dialog para crear servicios
  - ✅ Campos: name, description, category, duration, price
  - ✅ Integrado en TenantAdminDashboard
- **`EditServiceDialog.tsx`** - Dialog para editar servicios
  - ✅ Campos: name, description, category, duration, price (con defaultValue)
  - ✅ Animaciones elegantes (cascada de entrada)
  - ✅ Integrado en TenantAdminDashboard

#### 5️⃣ Dialogs Especializados - Settings
- **`EditTenantDialog.tsx`** - Dialog para editar datos del tenant
  - ✅ Campos: name, email, phone
  - ✅ Integrado en TenantAdminDashboard
- **`EditTenantColorDialog.tsx`** - Dialog para editar color theme del tenant
  - ✅ Color picker integrado
  - ✅ Preview en tiempo real

### ✅ Sistema de Notificaciones
- ✅ `useToast()` hook personalizado para toasts
- ✅ Integración con sonner + framer-motion
- ✅ Toasts en todas las operaciones CRUD
- ✅ Manejo de errores con toast messages

### 🔄 Cómo Agregar Nuevas Variantes

Para crear un nuevo dialog (ej: NewFeatureDialog):

```tsx
// src/components/dialogs/NewFeatureDialog.tsx
import { BaseFormDialog, type FormField } from "./BaseFormDialog";

interface NewFeatureDialogProps {
  onSave: (data: any) => Promise<void>;
}

export const NewFeatureDialog = ({ onSave }: NewFeatureDialogProps) => {
  const fields: FormField[] = [
    {
      id: "name",
      label: "Nombre",
      type: "text",
      required: true,
    },
    // ... más campos
  ];

  return (
    <BaseFormDialog
      title="Nueva Funcionalidad"
      fields={fields}
      onSubmit={onSave}
      triggerLabel="Crear"
    />
  );
};
```

### 📦 Dependencias Instaladas

```bash
@radix-ui/react-dialog          # Dialog primitivo
@radix-ui/react-icons           # Icons (Cross2Icon)
@radix-ui/react-slot            # For forwardRef with asChild
class-variance-authority        # Para variantes de componentes
sonner                          # Toast notifications
framer-motion                   # Animaciones suaves
```

---

## 📊 RESUMEN TÉCNICO

### Backend Stack
- **Framework:** Spring Boot 3.x
- **Lenguaje:** Java 21+
- **BD:** (No especificada en análisis, asumo JPA/Hibernate)
- **Seguridad:** Spring Security (sin JWT configurado)

### Frontend Stack
- **Framework:** React 19.2.3
- **Lenguaje:** TypeScript
- **Build tool:** Vite 7.3.2
- **Iconos:** Lucide React
- **Estilos:** Tailwind CSS (inferido por el código)

### Estado actual
- ✅ **Core funcionando:** 70%
  - Login/Dashboard basico
  - CRUD de profesionales/servicios
  - Booking público de 3 pasos
- ❌ **Falta:** 30%
  - JWT/Autenticación robusta
  - Notificaciones
  - Modales de edición
  - Validaciones completas

---

## 🚀 PLAN DE IMPLEMENTACIÓN SUGERIDO

### ✅ Fase 1: Seguridad & Routing (COMPLETADA)
- ✅ JWT implementado en backend (HS256)
- ✅ JwtAuthenticationFilter + validación de tokens
- ✅ @PreAuthorize en endpoints admin
- ✅ React Router con nested routes
- ✅ Route guards (RequireAuthLayout, RequireGuestLayout)
- ✅ Token persistence en localStorage
- ✅ Bearer token propagation en API client

### 🔧 Fase 2: Runtime Config & Deployment (COMPLETADA)
- ✅ Runtime config para dev/prod con detección de hostname
- ✅ Config files (`config.json`, `config.development.json`)
- ✅ API endpoints configurables por ambiente
- ✅ Backend compilado con JWT implementation

### 🎨 Fase 3: UI/UX Polish (EN PROGRESO)
- ✅ BaseFormDialog component (reutilizable)
- ✅ CRUD Dialogs: Create/Edit para Profesionales y Servicios
- ✅ Toast notification system (sonner + framer-motion)
- ✅ Loading states + error handling
- ✅ Integración en TenantAdminDashboard
- ⏳ Responsive design mobile (pending minor tweaks)
- ⏳ Refresh token automation (priority: CRITICAL)

### 🔴 Fase 4: Funcionalidades Críticas (PENDING)
1. **Refresh token endpoint** - Renovar JWT antes de expirar
2. **Error handling 401/403** - Redirigir a login si token inválido
3. **Email notifications** - Confirmaciones y reminders de citas
4. **Logout proper** - Limpiar token + blacklist (opcional)

### 🟡 Fase 5: Polish & Testing (PENDING)
1. Unit tests para AuthContext
2. E2E tests para login flow
3. Integration tests para CRUD operations
4. Swagger/OpenAPI documentation

---

## 📅 ESTADO ACTUAL

**MVP (mínimo viable):** 🟢 **80% COMPLETADO**
- ✅ JWT implementado y funcionando (backend)
- ✅ CRUD completo (C, R, U, D) en UI
- ✅ React Router con guards
- ✅ Runtime config dev/prod
- ⏳ **BLOCKER**: Backend en Fly.io no tiene código actualizado (token falta en response)
- ⚠️ Refresh token no implementado

**Beta completo:** 🟡 **Estimado 3-5 días más**
- Desplegar backend actualizado a Fly.io
- Implementar refresh token
- Tests E2E

**Release v1.0:** 🔴 **Estimado 1-2 semanas más**
- Email notifications
- Polish completo
- Production hardening

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

### 🔴 BLOCKER CRÍTICO (AHORA)
1. **Redeploy backend a Fly.io** con código JWT actualizado
   - El servidor remoto NO tiene el AuthResponse con token
   - Compilar y desplegar el JAR actualizado
   - Verificar login response incluye `accessToken`

### 🟡 POST-DEPLOYMENT
2. **Implementar refresh token endpoint** en backend
   - `POST /auth/refresh` - Renovar JWT si aún es válido
   - Actualizar frontend para renovar automáticamente

3. **Error handling 401/403** en frontend
   - Interceptar en api.ts
   - Redirigir a /login si 401
   - Mostrar error amigable si 403

4. **Validar E2E login flow**
   - Login → recibe token + user
   - Token guardado en localStorage
   - Dashboard protegido accesible
   - Logout limpia token

---

## 📊 RESUMEN DE PROGRESO

| Componente | Estado | Bloqueado | Notas |
|-----------|--------|-----------|-------|
| **JWT Backend** | ✅ Código OK | ⏳ No deployed | AuthController.java correcto, servidor remoto outdated |
| **JWT Frontend** | ✅ Almacenaje OK | ⏳ Esperando token | API client listo para Bearer token |
| **React Router** | ✅ Completo | ❌ No | Routes + Guards implementadas |
| **CRUD UI** | ✅ Completo | ❌ No | Dialogs + Forms working |
| **Runtime Config** | ✅ Completo | ❌ No | Dev/Prod separation OK |
| **Refresh Token** | ❌ No start | ⏳ Priority | Necesario para UX fluido |
| **Email Notif** | ❌ No start | 🟢 Low priority | Para futuro |

---

## 🌐 CONFIGURACIÓN DEV & PROD

### 📁 Archivos de Configuración

El proyecto usa 3 perfiles de Spring Boot:

```
backend/src/main/resources/
├── application.yml          (LOCAL - hardcoded localhost)
├── application-dev.yml      (DEV - variables de entorno)
└── application-prod.yml     (PROD - variables de entorno)
```

### 1️⃣ LOCAL (`application.yml`)

**Uso:** Desarrollo en máquina local. Sin Docker, sin variables de entorno.

**Contenido:**
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: turnow-backend

  datasource:
    url: jdbc:postgresql://localhost:5432/turnow
    username: postgres
    password: QUETEimporta1505
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 60000
      idle-timeout: 600000
      max-lifetime: 1800000

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
        default_schema: public

  flyway:
    enabled: false
    locations: classpath:db/migration
    baseline-on-migrate: true
    out-of-order: false

  mail:
    host: smtp.gmail.com
    port: 587
    username: noreply@turnow.com
    password: 
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

app:
  jwt:
    secret: turnow_Super_Secret_Key_2024_Change_In_Production_Min_256_bits
    expiration: 86400000
    refresh-expiration: 604800000

  cors:
    allowed-origins: http://localhost:3000,http://localhost:5173

  frontend-url: http://localhost:3000

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics

logging:
  level:
    com.turnow: DEBUG
    org.springframework.security: INFO
    org.hibernate.SQL: INFO
```

**Startup Local:**
```bash
cd backend
java -jar target/turnow-backend-1.0.0-SNAPSHOT.jar
```

---

### 2️⃣ DEV (`application-dev.yml`)

**Uso:** Servidor de desarrollo. Lee credenciales de variables de entorno.

**Características:**
- Base de datos: Variable `${DATABASE_URL}`
- Flyway: Habilitado con baseline
- DDL: validate (no modifica tablas)
- Logging: INFO (menos verbose que local)
- Pool: 20 conexiones
- Endpoints actuator: health, metrics, info, env

**Contenido:**
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: turnow-backend

  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USER}
    password: ${DATABASE_PASSWORD}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 60000
      idle-timeout: 600000
      max-lifetime: 1800000

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
        default_schema: public

  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
    out-of-order: false

  mail:
    host: ${MAIL_HOST:smtp.gmail.com}
    port: ${MAIL_PORT:587}
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

app:
  jwt:
    secret: ${JWT_SECRET}
    expiration: ${JWT_EXPIRATION:86400000}
    refresh-expiration: ${JWT_REFRESH:604800000}

  cors:
    allowed-origins: ${CORS_ORIGINS:http://localhost:5173,http://dev-app.example.com}

  frontend-url: ${FRONTEND_URL:http://dev-app.example.com}

management:
  endpoints:
    web:
      exposure:
        include: health,metrics,info,env

logging:
  level:
    root: INFO
    com.turnow: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
```

**Startup DEV:**
```powershell
# 1. Establecer variables de entorno
$env:DATABASE_URL = "jdbc:postgresql://dev-db.example.com:5432/turnow_dev"
$env:DATABASE_USER = "postgres"
$env:DATABASE_PASSWORD = "dev_password"
$env:JWT_SECRET = "tu_secret_dev_min_256_bits_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:CORS_ORIGINS = "http://localhost:5173,http://dev-app.example.com"
$env:FRONTEND_URL = "http://dev-app.example.com"
$env:MAIL_USERNAME = "tu_email@gmail.com"
$env:MAIL_PASSWORD = "tu_app_password"

# 2. Compilar
mvn clean package -DskipTests

# 3. Ejecutar DEV
java -jar target/turnow-backend-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev
```

---

### 3️⃣ PROD (`application-prod.yml`)

**Uso:** Servidor de producción. Máxima seguridad y rendimiento.

**Características:**
- Base de datos: Variable `${DATABASE_URL}`
- Flyway: Habilitado sin baseline (datos ya existentes)
- DDL: validate (jamás modifica)
- Logging: WARN (solo errores)
- Pool: 30 conexiones (más que dev)
- Endpoints actuator: solo health (seguridad)

**Contenido:**
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: turnow-backend

  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USER}
    password: ${DATABASE_PASSWORD}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 30
      minimum-idle: 10
      connection-timeout: 60000
      idle-timeout: 600000
      max-lifetime: 1800000

  jpa:
    show-sql: false
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: false
        default_schema: public

  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: false
    out-of-order: false

  mail:
    host: ${MAIL_HOST:smtp.gmail.com}
    port: ${MAIL_PORT:587}
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

app:
  jwt:
    secret: ${JWT_SECRET}
    expiration: ${JWT_EXPIRATION:86400000}
    refresh-expiration: ${JWT_REFRESH:604800000}

  cors:
    allowed-origins: ${CORS_ORIGINS}

  frontend-url: ${FRONTEND_URL}

management:
  endpoints:
    web:
      exposure:
        include: health

logging:
  level:
    root: WARN
    com.turnow: INFO
    org.springframework.security: ERROR
    org.hibernate.SQL: WARN
```

**Startup PROD:**
```powershell
# 1. Establecer variables de entorno (en el servidor)
$env:DATABASE_URL = "jdbc:postgresql://prod-db.example.com:5432/turnow"
$env:DATABASE_USER = "postgres"
$env:DATABASE_PASSWORD = "prod_password_strong_xxxxxxx"
$env:JWT_SECRET = "tu_secret_prod_min_256_bits_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:CORS_ORIGINS = "https://www.turnow.com,https://app.turnow.com"
$env:FRONTEND_URL = "https://www.turnow.com"
$env:MAIL_USERNAME = "noreply@turnow.com"
$env:MAIL_PASSWORD = "tu_app_password"

# 2. Ejecutar PROD
java -jar target/turnow-backend-1.0.0-SNAPSHOT.jar --spring.profiles.active=prod
```

---

### 📊 Tabla Comparativa

| Setting | Local | Dev | Prod |
|---------|-------|-----|------|
| **BD URL** | localhost:5432 | ${DATABASE_URL} | ${DATABASE_URL} |
| **DDL auto** | update | validate | validate |
| **Flyway** | disabled | enabled | enabled |
| **Baseline** | - | true | false |
| **DB Pool Max** | 20 | 20 | 30 |
| **DB Pool Min** | 5 | 5 | 10 |
| **Log Root** | DEBUG | INFO | WARN |
| **Log App** | DEBUG | DEBUG | INFO |
| **Endpoints** | all | health,metrics,info,env | health |
| **Format SQL** | true | true | false |
| **JWT Secret** | hardcoded | env var | env var |
| **CORS Origins** | localhost | env var | env var |

---

**Analizado por:** Sistema de análisis automático  
**Confianza del análisis:** 95%
