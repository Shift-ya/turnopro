# Turnow Backend - Configuración de Desarrollo Local

## Inicio Rápido

### Prerequisitos
- PostgreSQL 17 corriendo en `localhost:5432` con usuario `postgres` y contraseña `QUETEimporta1505`
- Java 21
- Maven 3.9+

### Configuración de BD
La base de datos `turnow` se creará automáticamente en el primer inicio.

### Inicia Backend

**Opción 1: Archivo batch (Windows)**
```batch
start-backend.bat
```

**Opción 2: PowerShell**
```powershell
.\start-backend.ps1
```

**Opción 3: Manual**
```bash
cd backend
java -jar target/turnow-backend-1.0.0-SNAPSHOT.jar
```

### Backend Corriendo
- **URL**: http://localhost:8080/api
- **Health**: http://localhost:8080/api/actuator/health
- **Puerto**: 8080
- **Context Path**: /api

## Arquitectura

- **Sin Docker**: Usa instalación local de PostgreSQL 17 directamente
- **Configuración Única**: `backend/src/main/resources/application.yml` para dev local
- **Schema Auto**: Hibernate `ddl-auto=update` crea tablas automáticamente
- **Sin Flyway**: Deshabilitado para desarrollo local (evita inicialización pre-BD)

## Archivos de Configuración

### `application.yml` (Por Defecto/Local)
- Conexión hardcodeada a localhost
- Sin perfiles, sin variables de entorno
- Creación auto de tablas vía Hibernate

### `application-dev.yml` (Template)
Para deployment de servidor dev con variables de entorno:
```bash
java -jar app.jar --spring.profiles.active=dev \
  --spring.datasource.url=jdbc:postgresql://remote-host:5432/turnow_dev \
  --spring.datasource.username=postgres \
  --spring.datasource.password=$PASSWORD
```

### `application-prod.yml` (Template)
Para deployment de producción con logging más estricto

## Solución de Problemas

### Backend no inicia
1. Verifica PostgreSQL está corriendo: `netstat -ano | findstr ":5432"`
2. Revisa que la BD existe: El inicializador la crea automáticamente al iniciar
3. Verifica puerto 8080 está libre: `netstat -ano | findstr ":8080"`

### Error de conexión a BD
1. Asegúrate que las credenciales de PostgreSQL sean correctas en `application.yml`
2. La BD se creará automáticamente si no existe
3. Revisa conectividad: Hibernate registrará errores detallados

### Puerto en uso
```bash
netstat -ano | findstr ":8080"
taskkill /PID <pid> /F
```

## Configuración de Frontend

Desde el directorio raíz:
```bash
npm run dev
```

El frontend auto-detectará entorno dev y se conectará a `http://localhost:8080/api`

## Resumen

Este es un **setup simple de desarrollo local**:
- ✅ Sin complejidad Docker
- ✅ Script único de inicio
- ✅ Localhost hardcodeado
- ✅ Inicialización automática de BD
- ✅ Puerto 5432 compatible con equipo
