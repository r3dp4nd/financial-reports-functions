# Reglas de discovery

Cargar esta referencia cuando el inventario determinista no sea suficiente para clasificar una señal.

## Progressive disclosure

```text
security exclusions
→ inventory script
→ Function entrypoints/configuration metadata
→ direct related source only when needed
```

No construir call graphs completos.

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

## Configuración

Registrar únicamente nombres de claves referenciadas, nunca valores.

Ejemplo:

```text
COSMOS_CONNECTION
SERVICE_BUS_CONNECTION
```

## Arquitectura observable

Describir sin puntuar:

- entrypoints;
- ubicación de lógica funcional;
- adapters o composition roots existentes;
- módulos/capabilities observables;
- infraestructura compartida observable;
- acoplamiento directo al runtime cuando sea evidente.

No comparar todavía contra arquitectura target.

## Shared resource candidates

Una señal candidata requiere más que el mismo SDK. Buscar identidad/reuse observable, por ejemplo:

- mismo módulo de cliente/repository importado por varias Functions;
- misma implementación concreta compartida;
- mismo recurso/configuration key usado por varios consumidores.

En discovery siguen siendo candidatos, no ownership definitivo.

## Evidence status

Aplicar `../_shared/evidence-policy.md`.

No convertir una convención de naming en hecho confirmado sin evidencia adicional.
