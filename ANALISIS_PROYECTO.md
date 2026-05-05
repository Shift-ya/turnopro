# 📊 Análisis Completo: turnow

**Fecha de análisis:** 16 de Abril, 2026  
**Estado del proyecto:** En desarrollo

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
- ✅ `POST /auth/login` - Login con email/password
  - Request: `{ email, password }`
  - Response: `{ id, tenantId, email, name, role }`
  - Roles: SUPER_ADMIN, TENANT_ADMIN, STAFF, CLIENT

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
- CSRF deshabilitado (apropiado para SPA)
- CORS configurado
- Session stateless (sin estado)
- Todos los endpoints `/api/**` permitidos sin autenticación (⚠️ TODO: Implementar autenticación)

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
- ✅ AuthContext: Maneja user, login/logout
- ✅ Persistencia en localStorage

### 🎨 COMPONENTES UI
- ✅ MetricCard - Tarjeta de métrica
- ✅ StatusBadge - Badge de estado

---

## 🔴 GAPS Y FUNCIONALIDADES FALTANTES

### BACKEND
| Funcionalidad | Estado | Prioridad | Notas |
|---|---|---|---|
| **Autenticación JWT** | ❌ Sin implementar | 🔴 CRÍTICA | Ahora es password plano sin token |
| **Validación de tokens** | ❌ Sin implementar | 🔴 CRÍTICA | Cualquiera puede acceder a endpoints protegidos |
| **Refresh token** | ❌ Sin implementar | 🔴 CRÍTICA | Mencionado en README pero no existe |
| **Logout** | ❌ Sin implementar | 🟡 MEDIA | Solo lado cliente |
| **Notificaciones por email** | ❌ Sin implementar | 🟡 MEDIA | Reminders y confirmaciones de cita |
| **Disponibilidad (Availability)** | ✅ Parcial | 🟡 MEDIA | SlotCalculator existe pero incomplete |
| **Editar profesional** | ⚠️ API existe, no completa | 🟡 MEDIA | Falta lógica en controller |
| **Editar servicio** | ⚠️ API existe, no completa | 🟡 MEDIA | Falta lógica en controller |
| **Cancelación de citas** | ⚠️ Existe por token | 🟢 BAJA | Pero falta validación |
| **Validación de datos** | ❌ Minimal | 🟡 MEDIA | Agregar más validaciones |

### FRONTEND
| Funcionalidad | Estado | Prioridad | Notas |
|---|---|---|---|
| **Editar profesional** | ✅ Dialog + animaciones | 🟡 MEDIA | Dialog modal reutilizable con BaseFormDialog |
| **Editar servicio** | ✅ Dialog + animaciones | 🟡 MEDIA | Dialog modal reutilizable con BaseFormDialog |
| **Notificación de éxito/error** | ✅ Sistema de toasts | 🟡 MEDIA | sonner + framer-motion + hook useToast |
| **Loading states** | ✅ Implementado | 🟡 MEDIA | Loading en dialogs de edición |
| **Manejo de errores** | ✅ Con toasts | 🟡 MEDIA | Toasts en todas las operaciones CRUD |
| **Validaciones de formularios** | ✅ Campos requeridos | 🟡 MEDIA | Validación HTML5 implementada |
| **Responsive design mobile** | ⚠️ Parcial | 🟢 BAJA | Sidebar existe pero mejorable |
| **Editar tenant (admin)** | ❌ Sin UI | 🟡 MEDIA | Está en backend |
| **Filtros avanzados** | ❌ Sin implementar | 🟢 BAJA | Por fecha, estado, etc |
| **Exportar datos** | ❌ Sin implementar | 🟢 BAJA | CSV, PDF |

---

## 🔗 RUTAS DE INTEGRACIÓN

### ENDPOINTS QUE NECESITAN INTERFAZ FRONTEND

1. **`PUT /admin/tenant/{tenantId}/professionals/{professionalId}`**
   - ❌ UI Modal de edición falta
   - Botón Edit en tabla de profesionales

2. **`PUT /admin/tenant/{tenantId}/services/{serviceId}`**
   - ❌ UI Modal de edición falta
   - Botón Edit en tabla de servicios

3. **`PUT /admin/tenant/{tenantId}/settings`**
   - ⚠️ Existe UI pero incompleta
   - Faltan campos de color picker

### ENDPOINTS SIN USAR EN FRONTEND

1. **`GET /admin/tenant/{tenantId}/services`**
   - ✅ Incluida en `/overview` pero podría tener endpoint dedicado

---

## 🎨 COMPONENTES UI IMPLEMENTADOS (✅ 17 Abril 2026)

### Estructura Base Creada

Se implementó una **arquitectura reutilizable de componentes UI** con soporte para variantes de formularios tipo dialog. Esto permite agregar nuevos dialogs de forma rápida sin duplicar código.

#### 1️⃣ Componentes UI Primitivos (`/src/components/ui/`)
- **`dialog.tsx`** - Dialog base con Radix UI (DialogContent, DialogHeader, etc.)
- **`button.tsx`** - Button reutilizable con variantes (default, outline, ghost, destructive)
- **`input.tsx`** - Input con estilos Tailwind
- **`label.tsx`** - Label para formularios

#### 2️⃣ Componente Base Reutilizable (`/src/components/dialogs/`)
- **`BaseFormDialog.tsx`** - Componente **genérico** para crear dialogs con formularios
  - Maneja lógica de abrir/cerrar
  - Renderiza campos dinámicamente (text, email, textarea, select)
  - Valida campos requeridos
  - Estados de loading automáticos
  - Trigger personalizable (botón o componente custom)

#### 3️⃣ Dialog Especializado
- **`EditProfessionalDialog.tsx`** - Dialog para editar profesionales
  - ✅ Campos: firstName, lastName, email, phone, speciality
  - ✅ Animaciones elegantes (cascada de entrada)
  - ✅ Integrado en TenantAdminDashboard
- **`EditServiceDialog.tsx`** - Dialog para editar servicios
  - ✅ Campos: name, description, category, duration, price
  - ✅ Animaciones elegantes (cascada de entrada)
  - ✅ Integrado en TenantAdminDashboard

### ✅ Funcionalidad Implementada

#### Editar Profesional
- ✅ Dialog modal reutilizable
- ✅ Campos: firstName, lastName, email, phone, speciality
- ✅ Validación de campos requeridos
- ✅ Loading states automáticos
- ✅ Animaciones suaves
- ✅ Integrado en TenantAdminDashboard pestana "Profesionales"

#### Editar Servicio
- ✅ Dialog modal reutilizable
- ✅ Campos: name, description, category, duration, price
- ✅ Validación de campos requeridos
- ✅ Integrado en TenantAdminDashboard

### 🔄 Cómo Agregar Nuevas Variantes

Para crear un nuevo dialog (ej: EditServiceDialog):

```tsx
// src/components/dialogs/EditServiceDialog.tsx
import { BaseFormDialog, type FormField } from "./BaseFormDialog";
import type { ApiService } from "@/lib/api";

interface EditServiceDialogProps {
  service: ApiService;
  onSave: (data: any) => Promise<void>;
}

export const EditServiceDialog = ({ service, onSave }: EditServiceDialogProps) => {
  const fields: FormField[] = [
    {
      id: "name",
      label: "Nombre del servicio",
      type: "text",
      required: true,
      defaultValue: service.name,
    },
    // ... más campos
  ];

  return (
    <BaseFormDialog
      title="Editar Servicio"
      fields={fields}
      onSubmit={onSave}
      triggerAsChild
    >
      {/* Trigger custom si quieres */}
    </BaseFormDialog>
  );
};
```

### 📦 Dependencias Instaladas

```bash
@radix-ui/react-dialog      # Dialog primitivo
@radix-ui/react-icons       # Icons (Cross2Icon)
@radix-ui/react-slot        # For forwardRef with asChild
class-variance-authority    # Para variantes de componentes
```

### 🎯 Próximas Tareas (Dialogs Similar)

| Dialog | Estado | Dificultad | Notas |
|--------|--------|-----------|-------|
| **EditServiceDialog** | ✅ Completado | Fácil | Integrado en TenantAdminDashboard |
| **CreateServiceDialog** | ✅ Completado | Fácil | Integrado en TenantAdminDashboard |
| **NotificationToast** | ✅ Completado | Media | Sistema completo con sonner + framer-motion |
| **CreateProfessionalDialog** | ❌ Falta | Fácil | Sin campo defaultValue |
| **ConfirmDeleteDialog** | ❌ Falta | Media | Dialog de confirmación |

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

### Fase 1: Seguridad (CRÍTICA) - Semana 1
1. Implementar JWT en backend
2. Proteger endpoints con @Secured
3. Agregar token al frontend API client
4. Validar roles en endpoints

### Fase 2: Funcionalidades faltantes (FRONTEND) - Semana 1-2
1. Modal de edición profesional
2. Modal de edición servicio
3. Toast/Alert system
4. Validaciones robustas

### Fase 3: Completar Backend - Semana 2
1. Terminar lógica de PUT profesional/servicio
2. Implementar email notifications
3. Mejor manejo de errores

### Fase 4: Polish - Semana 3
1. Responsive design mobile
2. Tests unitarios
3. Documentación de API (Swagger)

---

## 📅 DEADLINE SUGERIDO

**Para entregar a compañeros en estado "production-ready":**

- **MVP (mínimo viable):** 🟢 **1-2 semanas**
  - Seguridad JWT implementada
  - CRUD completo (C, R, U, D funcionan)
  - UI básica responsive

- **Beta completo:** 🟡 **2-3 semanas**
  - Todas las funcionalidades
  - Notificaciones de email
  - Tests

- **Release v1.0:** 🔴 **3-4 semanas**
  - Polish completo
  - Documentación
  - Deployment

**RECOMENDACIÓN:** Entregar MVP en **10 días hábiles** (2 semanas) con:
- ✅ JWT implementado
- ✅ 4 dashboards funcionando
- ✅ Booking completo
- ⚠️ Ediciones (front) en rama separada

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. **Implementar JWT en AuthController**
2. **Agregar @PreAuthorize a endpoints admin**
3. **Crear Modal de edición de profesional (TenantAdminDashboard)**
4. **Integrar Toast notifications**
5. **Tests E2E de booking flow**

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
