# Reglas de preparación global

## Cambios típicos

Solo cuando exista acción aprobada:

- `package.json` / engines;
- dependency versions del baseline;
- TypeScript/tooling requerido;
- `host.json` / extension bundle;
- estructura global requerida;
- shared resource implementation con owner global/shared;
- configuración segura por nombre de clave.

## Node.js

Actualizar metadata/configuración necesaria para Node.js 24 sin ejecutar migraciones funcionales locales.

## Runtime

Alinear Azure Functions Runtime v4 y configuración requerida por el plan.

## Dependencies

Actualizar únicamente targets aprobados. Si una API requiere adaptación local, dejarla a la acción `FN-*` correspondiente.

## TypeScript

Modificar compiler/tooling solo si es requisito de compatibilidad/build aprobado.

No modernizar reglas de estilo por conveniencia.

## Shared resources

Ejecutar la acción propietaria una sola vez y registrar qué consumers dependen de ella.

## Validación selectiva

Permitida para detectar errores locales obvios:

- parseo de JSON;
- dependency metadata;
- typecheck parcial cuando sea útil;
- inspección estructural.

El build global final pertenece a `verify-function-app` después de terminar la migración de toda la Function App.
