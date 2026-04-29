# Turnow - Configuración Simple de Desarrollo Local

## ✅ Estado: Listo para Usar

El backend está **corriendo** en `http://localhost:8080/api` con PostgreSQL 17.

## Inicio Rápido (Dos Comandos)

### Terminal 1: Inicia Backend
```powershell
.\start-backend.ps1
```
o
```batch
start-backend.bat
```

El backend se iniciará en **http://localhost:8080/api**

### Terminal 2: Inicia Frontend
```powershell
.\start-frontend.ps1
```
o
```batch
start-frontend.bat
```

El frontend se iniciará en **http://localhost:5173**

## Arquitectura: Simple y Local

✅ **Sin Docker** - Usa PostgreSQL 17 local en puerto 5432  
✅ **Sin Perfiles Complejos** - Configuración única hardcodeada a localhost  
✅ **Sin Dependencias Externas** - Todo corre localmente  
✅ **Auto-configuración** - BD y tablas se crean automáticamente  

## Qué Incluye

### Backend
- Spring Boot 3.2.3 + Tomcat en puerto 8080
- PostgreSQL 17 en puerto 5432 (base de datos: `turnow`)
- Creación automática de esquema Hibernate (`ddl-auto=update`)
- Spring Security 6.2.2 con JWT
- Migrations Flyway deshabilitadas (para dev local)

### Frontend
- React 19 + Vite 7
- TypeScript + Tailwind CSS
- Se conecta automáticamente a `http://localhost:8080/api`
- Detección de hostname corregida para entorno dev

### Archivos de Configuración
- **`application.yml`** - Config local por defecto (localhost hardcodeado)
- **`application-dev.yml`** - Template para servidor dev (variables de entorno)
- **`application-prod.yml`** - Template para producción

## Scripts de Inicio

Ubicados en el directorio raíz:

1. **`start-backend.bat/.ps1`** - Inicia backend en puerto 8080
2. **`start-frontend.bat/.ps1`** - Inicia frontend en puerto 5173
3. **`BACKEND_SETUP.md`** - Documentación detallada de configuración

## Base de Datos

- **Se Crea Automáticamente**: El primer inicio del backend crea la BD `turnow`
- **Schema Auto-creado**: Hibernate crea las tablas al iniciar
- **Credenciales**: 
  - Host: localhost
  - Port: 5432
  - Usuario: postgres
  - Contraseña: QUETEimporta1505
  - Base de datos: turnow

## Testing

### Health del Backend
```powershell
# Verifica si el backend responde
curl http://localhost:8080/api/actuator/health
```

### Conexión a BD
Los logs del backend mostrarán la conexión exitosa a PostgreSQL al iniciar.

## Solución de Problemas

### Backend no inicia
1. Verifica que PostgreSQL esté corriendo: `netstat -ano | findstr ":5432"`
2. Puerto 8080 está libre: `netstat -ano | findstr ":8080"`
3. BD existe (se crea automáticamente)

### Frontend no se conecta
1. Asegúrate que el backend está corriendo primero
2. Revisa el output de `start-frontend.ps1` para errores
3. Frontend auto-detecta entorno dev y se conecta a localhost:8080

### Conflicto de puertos
```powershell
# Encuentra el proceso usando puerto
netstat -ano | findstr ":8080"

# Mata el proceso (reemplaza PID)
taskkill /PID <pid> /F
```

## Compatibilidad de Equipo

✅ Puerto 5432 permanece libre para que el equipo use PostgreSQL  
✅ Sin contenedores Docker bloqueando puertos  
✅ Setup simple local compatible con instalación local de PostgreSQL del equipo  

## Próximos Pasos

1. Inicia backend: `.\start-backend.ps1`
2. Inicia frontend: `.\start-frontend.ps1` (en otra terminal)
3. Abre navegador: http://localhost:5173
4. Inicia sesión y prueba la aplicación

---

**Resumen**: Esta es una configuración de desarrollo local completa y simple, sin complejidad Docker. Backend y frontend están listos para usar.
