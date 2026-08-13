---
name: discover-function-app
description: Descubre de forma segura una Azure Function App legacy antes de migrarla. Úsalo para inventariar metadata del proyecto, Functions, triggers, bindings, uso de process.env, relaciones entre Functions, presencia de Durable Functions y señales de arquitectura, sin modificar código ni leer archivos sensibles.
---

# Discover Function App

## Objetivo

Construir el inventario inicial de una Azure Function App sin modificar el repositorio.

El resultado debe permitir al desarrollador entender qué existe antes de iniciar análisis, refactor o migración.

## Reglas

- No modificar código.
- No leer archivos sensibles.
- No leer valores de `local.settings.json`, `.env`, secretos, certificados o credenciales.
- Detectar `process.env` únicamente por nombre de clave.
- No presentar inferencias como hechos.
- Contrastar afirmaciones de plataforma con documentación oficial.
- Reutilizar `.migration/repository/inventory.json` si ya existe y sigue siendo suficiente.
- Leer solo el contexto necesario.

## Descubrimiento

Identificar, cuando exista evidencia:

- Function Apps del repositorio.
- Versión declarada de Node.js.
- Azure Functions Runtime.
- Programming Model.
- TypeScript.
- Dependencias principales.
- Functions existentes.
- Trigger y bindings de cada Function.
- Durable Functions y roles detectados.
- Variables `process.env` utilizadas.
- Relaciones entre Functions.
- Código o infraestructura compartida.
- Patrones arquitectónicos observables.

Clasificar cada conclusión como:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

## Seguridad de configuración

Si se detectan claves requeridas por `process.env` o bindings:

1. Registrar únicamente los nombres.
2. Generar la lista de configuración necesaria.
3. Solicitar al desarrollador un `local.settings.json` sanitizado o expresamente aprobado cuando sea necesario para
   futuras validaciones locales.
4. No abrir automáticamente un `local.settings.json` existente.

Microsoft documenta que `local.settings.json` puede contener secretos y connection strings y debe tratarse con
precaución.

## Salidas

Crear:

- `.migration/repository/inventory.json`
- `.migration/repository/inventory.md`
- `.migration/lessons/discover-function-app/lessons.json`
- `.migration/lessons/discover-function-app/lessons.md`

Crear las carpetas solo cuando sean necesarias.

## `inventory.json`

Debe contener información estructurada para otros skills:

- metadata de ejecución;
- Function Apps;
- runtime;
- Node.js;
- Programming Model;
- dependencias detectadas;
- Functions;
- triggers y bindings;
- Durable;
- claves de configuración;
- relaciones detectadas;
- evidencia;
- desconocidos.

No incluir secretos ni valores sensibles.

## `inventory.md`

Debe explicar al desarrollador:

- qué Function Apps fueron encontradas;
- qué Functions existen;
- configuración requerida;
- relaciones relevantes;
- patrones observados;
- hechos confirmados;
- inferencias;
- desconocidos;
- riesgos iniciales.

No debe ser un volcado textual del JSON.

## Lecciones aprendidas

Registrar únicamente observaciones que puedan mejorar futuras ejecuciones:

- caso no contemplado;
- patrón reusable;
- lectura innecesaria;
- fallo de detección;
- ambigüedad;
- oportunidad de simplificación.

No modificar este skill automáticamente.

Toda mejora debe ser revisada antes de incorporarse.

## Criterio de cierre

El skill termina cuando:

- el inventario fue generado;
- las Functions detectadas están identificadas;
- las claves de configuración requeridas están inventariadas;
- hechos, inferencias y desconocidos están diferenciados;
- no se leyeron archivos sensibles;
- se generaron los artefactos JSON, Markdown y lecciones aprendidas.

No iniciar assessment, refactor ni migración.
