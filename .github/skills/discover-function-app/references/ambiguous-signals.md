# Señales ambiguas de clasificación

Cargar esta referencia cuando el inventario determinista no sea suficiente para clasificar una señal puntual: Programming Model, Runtime, Durable, Configuración o shared resource candidates.

## Programming Model

Ejemplos de evidencia:

- `function.json` observable → señal v3;
- registrations como `app.http`, `app.timer`, etc. → señal v4;
- ambas familias → `MIXED`;
- package major por sí solo puede apoyar una inferencia, no siempre confirma el modelo real.

Registrar `UNKNOWN` cuando no exista evidencia suficiente.

## Runtime

Usar `host.json` y metadata segura observable. No leer configuración protegida para inferir runtime.

## Durable

Detectar señales como:

- orchestration trigger;
- activity trigger;
- entity trigger;
- imports/registrations Durable.

Discovery registra rol y relaciones observables; el análisis profundo del workflow pertenece a etapas posteriores.

Si el workflow contiene nombres literales de activities/sub-orchestrators, registrarlos como relaciones observables. Si la relación depende de variables dinámicas o convenciones de naming, marcarla `INFERRED` o dejarla en unknowns.

## Configuración

Registrar únicamente nombres de claves referenciadas, nunca valores.

Ejemplo:

```text
COSMOS_CONNECTION
SERVICE_BUS_CONNECTION
```

## Shared resource candidates

Una señal candidata requiere más que el mismo SDK. Buscar identidad/reuse observable, por ejemplo:

- mismo módulo de cliente/repository importado por varias Functions;
- misma implementación concreta compartida;
- mismo recurso/configuration key usado por varios consumidores.

En discovery siguen siendo candidatos, no ownership definitivo.

## Múltiples Function Apps

Mantener separadas sus:

- rutas raíz;
- `host.json` y package metadata segura;
- Functions;
- dependencias;
- Programming Model;
- Runtime;
- shared resources.

No fusionar apps por estar en el mismo repositorio.

## Evidence status

Aplicar `../_shared/evidence-policy.md`.

No convertir una convención de naming en hecho confirmado sin evidencia adicional.
