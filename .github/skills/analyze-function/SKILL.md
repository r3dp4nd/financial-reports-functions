---
name: analyze-function
description: Analiza una Function concreta dentro de una Azure Function App para comprender su comportamiento actual, dependencias, testabilidad, compatibilidad potencial con Node.js 24 y acciones necesarias antes de su preparación o migración.
---

# Analyze Function

## Objetivo

Comprender una Function concreta y el slice de código necesario para ejecutar su comportamiento actual.

El análisis debe producir suficiente evidencia para:

- preservar comportamiento;
- identificar riesgos;
- evaluar testabilidad;
- proponer tests;
- determinar refactor mínimo;
- evaluar compatibilidad potencial con Node.js 24;
- identificar cambios de plataforma;
- generar acciones concretas para los siguientes skills.

Este skill no modifica código.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`

## Precondiciones

Deben existir:

`.migration/repository/inventory.json`

`.migration/repository/assessment.json`

La Function objetivo debe existir en el inventario.

Si no puede identificarse con suficiente evidencia:

- registrar `UNKNOWN`;
- no inventar relaciones;
- no generar acciones basadas en supuestos.

## Entrada principal

Recibir una Function objetivo.

Ejemplo:

`RequestReport`

Analizar una sola Function o unidad funcional coherente por ejecución.

Para Durable Functions, considerar el contexto mínimo del workflow cuando sea necesario para comprender su
comportamiento.

## Reutilización de evidencia

Consumir primero:

- `inventory.json`;
- `assessment.json`.

No volver a descubrir información global ya disponible salvo contradicción.

Si aparece evidencia inconsistente, aplicar `evidence-policy.md`.

## Slice de análisis

Leer únicamente lo necesario para comprender la Function.

El slice puede incluir:

- entrypoint;
- handler;
- servicios;
- dominio relacionado;
- repositorios;
- clientes externos;
- DTOs;
- mappers;
- configuración;
- contratos;
- utilidades directamente utilizadas;
- tests existentes;
- Functions relacionadas cuando sean necesarias.

No cargar toda la Function App por defecto.

## Comportamiento actual

Identificar cuando corresponda:

- trigger;
- entrada;
- validaciones;
- decisiones;
- servicios utilizados;
- persistencia;
- llamadas externas;
- mensajes;
- efectos secundarios;
- salida;
- manejo de errores.

No inferir comportamiento de negocio únicamente por nombres.

## Dependencias

Identificar únicamente las dependencias relevantes para el slice.

Clasificar cuando corresponda:

- código interno;
- Azure SDK;
- base de datos;
- mensajería;
- almacenamiento;
- HTTP;
- configuración;
- librerías de terceros;
- runtime Node.js.

No repetir todo `package.json`.

## Configuración

Usar el inventario existente.

Registrar únicamente:

- nombre de la clave;
- lugar de uso;
- propósito observable cuando pueda confirmarse.

Nunca leer ni registrar valores.

## Relaciones

Identificar relaciones relevantes como:

- inicia un orchestrator;
- publica mensajes;
- consume mensajes;
- comparte persistencia;
- invoca Activities;
- participa en un workflow Durable.

No construir relaciones por similitud de nombres.

## Testabilidad

Evaluar señales como:

- lógica mezclada con Azure;
- uso directo de `context`;
- uso directo de `process.env`;
- creación directa de clientes SDK;
- efectos secundarios dentro del handler;
- dependencias globales;
- lógica pura ya aislada;
- dependencias sustituibles.

Clasificar:

- `HIGH`
- `MEDIUM`
- `LOW`

La clasificación debe incluir razones.

La ausencia de tests no implica automáticamente baja testabilidad.

## Tests existentes

Identificar los tests relacionados con el slice.

Registrar:

- framework;
- archivos relevantes;
- comportamiento cubierto observable;
- gaps evidentes.

No asumir cobertura porque exista un archivo de test.

## Tests propuestos

Proponer el conjunto mínimo necesario para proteger comportamiento existente.

Priorizar:

1. comportamiento principal;
2. validaciones relevantes;
3. decisiones de negocio;
4. errores importantes;
5. interacciones externas significativas.

Distinguir cuando corresponda:

- characterization;
- unit;
- contract.

No proponer integration tests en esta etapa.

No diseñar comportamiento nuevo.

## Refactor mínimo

Clasificar:

- `NONE`
- `MINIMAL`
- `SIGNIFICANT`

Ejemplos:

- extraer lógica del entrypoint;
- aislar `process.env`;
- extraer creación de cliente SDK;
- introducir dependencia sustituible;
- separar mapping;
- mover lógica funcional fuera del adapter Azure.

No proponer Clean Architecture completa por defecto.

Aplicar separación arquitectónica únicamente cuando resuelva un problema observado.

## Compatibilidad con Node.js 24

Analizar únicamente el código y dependencias directamente relevantes para la Function.

Buscar riesgos relacionados con:

- APIs Node.js;
- módulos;
- comportamiento del runtime;
- sintaxis;
- dependencias utilizadas directamente;
- APIs eliminadas o deprecadas.

Clasificar:

- `CONFIRMED_COMPATIBLE`
- `CHANGE_REQUIRED`
- `REQUIRES_VALIDATION`
- `NOT_APPLICABLE`

Las conclusiones externas deben seguir `evidence-policy.md`.

No asumir compatibilidad porque compile.

## Programming Model

Usar el estado identificado previamente.

Si ya utiliza Programming Model v4:

- registrar la dimensión como satisfecha;
- no generar acción de migración del modelo.

Si utiliza modelo legacy:

- identificar los puntos que deberán transformarse posteriormente.

No realizar la transformación.

## Durable Functions

Si no pertenece a Durable:

`NOT_APPLICABLE`

Si pertenece a Durable, identificar cuando exista evidencia:

- starter;
- client;
- orchestrator;
- activity;
- sub-orchestrator;
- entity.

No analizar una Activity completamente desconectada del workflow cuando su comportamiento dependa de él.

## Deuda técnica

Registrar deuda observada y relevante.

Ejemplos:

- acoplamiento;
- duplicación;
- clientes globales;
- configuración dispersa;
- handler demasiado grande;
- contratos débiles;
- código muerto evidente.

No convertir automáticamente deuda técnica en trabajo obligatorio.

## Categorías de cambio

Usar:

- `REQUIRED_PLATFORM`
- `REQUIRED_NODE`
- `REQUIRED_TESTABILITY`
- `STRUCTURAL`
- `TECHNICAL_DEBT`
- `OPTIMIZATION`

`OPTIMIZATION` queda fuera del alcance de la migración.

## requiredActions

El análisis debe terminar con las acciones concretas requeridas para esta Function.

Cada acción debe contener como mínimo:

- categoría;
- descripción;
- razón;
- evidencia;
- estado.

Ejemplo conceptual:

    {
      "type": "REQUIRED_TESTABILITY",
      "action": "Aislar la creación de CosmosClient.",
      "reason": "El cliente se construye dentro del handler y bloquea unit tests deterministas.",
      "status": "CONFIRMED"
    }

Otro ejemplo:

    {
      "type": "REQUIRED_PLATFORM",
      "action": "Migrar el adapter HTTP al Programming Model v4.",
      "reason": "La Function utiliza function.json y handler legacy.",
      "status": "CONFIRMED"
    }

No generar acciones para:

- preferencias estéticas;
- optimizaciones;
- deuda no bloqueante;

salvo que deban quedar explícitamente documentadas como tales.

## Salidas

Crear:

`.migration/functions/<FunctionName>/analysis.json`

`.migration/functions/<FunctionName>/analysis.md`

Y:

`.migration/lessons/analyze-function/<FunctionName>.json`

`.migration/lessons/analyze-function/<FunctionName>.md`

## analysis.json

Debe contener como mínimo:

- metadata;
- Function;
- comportamiento actual;
- trigger;
- dependencias;
- configuración;
- relaciones;
- testabilidad;
- tests existentes;
- tests propuestos;
- compatibilidad Node.js 24;
- Programming Model;
- Durable role cuando aplique;
- refactor requerido;
- `requiredActions`;
- deuda técnica;
- optimizaciones observadas;
- riesgos;
- unknowns;
- evidencia.

No incluir secretos.

## analysis.md

Debe permitir responder rápidamente:

- qué hace la Function;
- de qué depende;
- qué comportamiento debe preservarse;
- qué tan testeable es;
- qué tests necesita;
- qué refactor mínimo requiere;
- qué riesgos existen con Node.js 24;
- si necesita migración de Programming Model;
- qué acciones concretas deben ejecutarse;
- qué deuda queda fuera del alcance.

No debe ser una copia del JSON.

## Lecciones aprendidas

Aplicar:

`../_shared/lessons-policy.md`

Registrar únicamente aprendizaje útil de esta ejecución.

## Criterio de cierre

El skill termina cuando:

- la Function fue identificada;
- se analizó únicamente el slice necesario;
- el comportamiento actual fue documentado;
- las dependencias relevantes fueron identificadas;
- la configuración fue registrada sin valores;
- las relaciones relevantes fueron documentadas;
- la testabilidad fue evaluada;
- los tests mínimos fueron propuestos;
- el refactor mínimo fue identificado;
- la compatibilidad potencial con Node.js 24 fue evaluada;
- Programming Model fue considerado;
- Durable fue considerado cuando correspondía;
- `requiredActions` fue generado;
- deuda y optimización quedaron separadas del trabajo obligatorio;
- se generaron analysis y lessons.

## Fuera de alcance

Este skill no debe:

- modificar código;
- agregar tests;
- actualizar dependencias;
- cambiar Node.js;
- migrar Runtime;
- migrar Programming Model;
- migrar Durable;
- aplicar refactor;
- implementar arquitectura nueva;
- resolver deuda técnica no bloqueante;
- optimizar código.

El siguiente skill sugerido es:

`plan-function-migration`
