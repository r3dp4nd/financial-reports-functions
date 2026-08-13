---
name: discover-function-app
description: Descubre de forma segura una Azure Function App antes de migrarla o refactorizarla. Inventaría metadata, Functions, triggers, bindings, configuración requerida, Programming Model, Durable Functions y relaciones observables, sin modificar código ni leer archivos sensibles.
---

# Discover Function App

## Objetivo

Construir una fotografía segura y reutilizable de una Azure Function App antes de analizar, planificar o modificar
código.

## Entradas

- Repositorio objetivo.
- Política global de seguridad.
- Artefactos existentes en `.migration/`, si existen.

## Reglas

- No modificar código.
- No leer archivos sensibles.
- No leer valores de `local.settings.json`, `.env`, certificados, secretos o credenciales.
- No leer archivos CI/CD sensibles salvo copia sanitizada y aprobada.
- Detectar `process.env` únicamente por nombre de clave.
- Reutilizar evidencia existente cuando siga siendo válida.
- No repetir manualmente descubrimientos deterministas ya realizados por scripts.
- Leer únicamente el contexto necesario.
- No presentar inferencias como hechos.
- Contrastar afirmaciones de plataforma con documentación oficial vigente.
- Registrar como `UNKNOWN` aquello que no pueda confirmarse.

## Uso de scripts

Los scripts incluidos en este skill forman parte de su implementación.

Ejecutar primero:

`scripts/inventory.js`

sobre el repositorio objetivo.

El script es la fuente primaria para obtener hechos estructurales del repositorio.

El agente debe:

- preferir el script para descubrimiento determinista;
- interpretar su salida JSON;
- no reimplementar manualmente lo que el script ya detecta;
- leer código selectivamente solo cuando sea necesario para completar relaciones o significado;
- registrar una lección aprendida ante falsos positivos, falsos negativos o casos no soportados.

Los scripts deben mantenerse compatibles con Node.js 14 o superior.

## Ejecución

### 1. Inventario determinista

Consumir la salida de `scripts/inventory.js` para obtener, cuando exista evidencia:

- Function Apps;
- `package.json`;
- `host.json`;
- versión declarada de Node.js;
- dependencias;
- Functions legacy;
- Functions Programming Model v4;
- triggers y bindings detectados;
- Durable Functions detectadas;
- nombres de claves `process.env`;
- archivos sensibles detectados sin lectura.

No volver a descubrir manualmente estos datos salvo que exista una inconsistencia.

### 2. Análisis selectivo

Usando el inventario y únicamente el código necesario, identificar cuando exista evidencia:

- relaciones entre Functions;
- workflows Durable;
- Functions independientes;
- capacidades funcionales observables;
- infraestructura compartida;
- patrones arquitectónicos existentes.

Clasificar cada conclusión como:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

No realizar todavía evaluación de compatibilidad, refactor ni planificación de migración.

### 3. Configuración requerida

Usar las claves `process.env` detectadas por el script.

Registrar únicamente:

- nombre de la clave;
- archivos donde se utiliza;
- Functions o capacidades relacionadas cuando pueda determinarse.

Nunca registrar valores.

Si futuras validaciones locales requieren configuración, indicar al desarrollador qué claves deben proporcionarse
mediante un `local.settings.json` sanitizado o expresamente aprobado.

No abrir automáticamente un `local.settings.json` existente.

### 4. Evidencia externa

Toda afirmación sobre:

- Azure Functions Runtime;
- Programming Model;
- Node.js;
- Durable Functions;
- SDKs;
- soporte o compatibilidad;

debe apoyarse en documentación oficial vigente cuando sea necesaria para confirmar el hecho.

Guardar únicamente referencias mínimas necesarias.

No copiar documentación completa.

## Salidas

Crear:

- `.migration/repository/inventory.json`
- `.migration/repository/inventory.md`
- `.migration/lessons/discover-function-app/lessons.json`
- `.migration/lessons/discover-function-app/lessons.md`

Crear únicamente las carpetas necesarias.

## `inventory.json`

Debe contener información estructurada reutilizable por otros skills.

Como mínimo:

- metadata de ejecución;
- repositorio;
- Function Apps;
- Node.js declarado;
- Azure Functions Runtime cuando pueda confirmarse;
- Programming Model;
- dependencias relevantes;
- Functions;
- triggers y bindings;
- Durable Functions;
- configuración requerida;
- relaciones detectadas;
- evidencia;
- desconocidos.

No incluir valores sensibles.

Los siguientes estados son válidos:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

## `inventory.md`

Debe permitir al desarrollador comprender rápidamente:

- qué Function Apps existen;
- qué Functions fueron encontradas;
- Runtime, Node.js y Programming Model detectados;
- configuración requerida;
- workflows o relaciones relevantes;
- arquitectura observable;
- hechos confirmados;
- inferencias;
- desconocidos.

No debe ser una copia textual del JSON.

No debe incluir todavía:

- versiones recomendadas;
- plan de migración;
- refactors;
- optimizaciones;
- deuda técnica detallada.

## Lecciones aprendidas

Registrar únicamente observaciones que puedan mejorar futuras ejecuciones:

- casos no contemplados;
- falsos positivos;
- falsos negativos;
- fallos de detección;
- contexto innecesario;
- patrones reutilizables;
- oportunidades de simplificación;
- propuestas de mejora del skill o de sus scripts.

Si no existe una lección relevante, generar el artefacto con una colección vacía.

No modificar automáticamente este skill ni sus scripts.

Toda mejora requiere revisión humana antes de incorporarse.

## Criterio de cierre

El skill termina cuando:

- `scripts/inventory.js` fue ejecutado correctamente;
- su salida fue revisada;
- las Function Apps fueron identificadas;
- las Functions fueron inventariadas;
- las claves de configuración fueron registradas sin valores;
- el Programming Model fue identificado o marcado como `UNKNOWN`;
- las relaciones relevantes fueron documentadas cuando exista evidencia;
- hechos e inferencias están diferenciados;
- no se reanalizaron manualmente hechos ya obtenidos por el script;
- no se leyeron archivos sensibles;
- se generaron los artefactos de inventario;
- se generaron los artefactos de lecciones aprendidas.

## Fuera de alcance

Este skill no debe:

- modificar código;
- actualizar dependencias;
- migrar Node.js;
- migrar Azure Functions Runtime;
- migrar Programming Model;
- agregar tests;
- refactorizar arquitectura;
- optimizar código;
- generar el plan de migración.

El siguiente skill sugerido, después de revisión humana del inventario, es:

`assess-function-app`
