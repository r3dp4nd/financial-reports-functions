---
name: prepare-function
description: Prepara una Function concreta para su migración aplicando el refactor mínimo necesario para testabilidad y agregando tests que protejan su comportamiento actual.
---

# Prepare Function

## Objetivo

Dejar una Function testeable y protegida antes de modificar su integración con la plataforma.

Este skill puede:

- aplicar refactor mínimo;
- agregar characterization tests;
- agregar unit tests.

No migra todavía Programming Model ni Durable.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`

## Precondiciones

Debe existir:

`.migration/functions/<FunctionName>/analysis.json`

El plan global debe incluir o permitir la preparación de esa Function.

La preparación global necesaria debe haber sido realizada.

## Entrada

Recibir una Function objetivo.

Consumir primero:

- inventory;
- assessment;
- analysis;
- plan global.

No volver a analizar toda la aplicación.

## Comportamiento a preservar

Usar `analysis.json` para identificar:

- entrada;
- validaciones;
- decisiones;
- efectos secundarios;
- salida;
- errores;
- interacciones externas.

Los tests deben proteger comportamiento existente.

## requiredActions

Ejecutar únicamente acciones aplicables de `analysis.json`.

Principalmente:

- `REQUIRED_TESTABILITY`
- `STRUCTURAL`

No inventar refactors adicionales.

## Refactor

Respetar la clasificación:

- `NONE`
- `MINIMAL`
- `SIGNIFICANT`

### NONE

No refactorizar.

### MINIMAL

Aplicar únicamente extracciones necesarias para testabilidad.

### SIGNIFICANT

No ampliar el alcance automáticamente.

Marcar `REQUIRES_REVIEW` si el cambio supera lo aprobado.

## Ejemplos válidos

- extraer lógica del entrypoint;
- encapsular `process.env`;
- extraer creación de cliente SDK;
- introducir una dependencia sustituible;
- separar mapping;
- aislar infraestructura.

No introducir automáticamente frameworks DI.

## Arquitectura

Usar Clean Architecture únicamente cuando resuelva un problema real.

Para una Function simple puede ser suficiente:

- handler;
- service;
- tests.

No crear capas vacías.

## Tests

Agregar únicamente los tests propuestos por el análisis y los estrictamente necesarios para cubrir comportamiento
confirmado.

Priorizar:

1. comportamiento principal;
2. validaciones;
3. decisiones;
4. errores;
5. interacciones externas relevantes.

No agregar integration tests.

## Characterization

Usar characterization tests cuando sea necesario capturar comportamiento legacy antes del refactor.

## Unit tests

Preferir unit tests cuando el comportamiento ya pueda aislarse.

Mockear límites externos, no detalles internos innecesarios.

## Baseline

La preparación debe obtener una baseline verde cuando los tests formen parte del plan.

Registrar:

- comando;
- tests ejecutados;
- pass/fail;
- coverage cuando corresponda.

No cambiar expectativas para ocultar diferencias de comportamiento.

## Programming Model

No migrar el modelo.

Si la Function es legacy, preservar temporalmente el adapter requerido.

Si ya está en v4, preservar su registro.

## Durable

Respetar el rol de la Function.

No rediseñar workflow Durable.

La migración especializada corresponde a:

`migrate-durable-functions-v4`

## Salidas

Crear:

`.migration/functions/<FunctionName>/preparation.json`

`.migration/functions/<FunctionName>/preparation.md`

Y:

`.migration/lessons/prepare-function/<FunctionName>.json`

`.migration/lessons/prepare-function/<FunctionName>.md`

## preparation.json

Registrar:

- Function;
- comportamiento protegido;
- archivos modificados;
- refactors;
- tests agregados;
- validaciones;
- baseline;
- riesgos;
- unknowns;
- deuda restante.

## preparation.md

Explicar:

- qué se modificó;
- por qué;
- qué comportamiento quedó protegido;
- qué tests se agregaron;
- resultado;
- qué quedó pendiente.

## Estados de salida

Usar:

- `READY_FOR_MIGRATION`
- `BLOCKED`
- `REQUIRES_REVIEW`
- `NOT_APPLICABLE`

## Lecciones aprendidas

Aplicar:

`../_shared/lessons-policy.md`

## Criterio de cierre

El skill termina cuando:

- se consumió el análisis;
- solo se aplicaron acciones autorizadas;
- el refactor fue el mínimo necesario;
- los tests requeridos fueron agregados;
- la baseline quedó verde cuando correspondía;
- no se cambió intencionalmente comportamiento;
- no se migró Programming Model;
- no se aplicaron optimizaciones;
- se generaron preparation y lessons.

## Fuera de alcance

Este skill no debe:

- migrar Programming Model;
- migrar Runtime;
- migrar Node.js;
- migrar Durable;
- actualizar dependencias globales no planificadas;
- modificar comportamiento de negocio;
- optimizar;
- resolver deuda no bloqueante;
- desplegar.

El siguiente skill depende del caso:

- `migrate-programming-model-v4`
- `migrate-durable-functions-v4`
