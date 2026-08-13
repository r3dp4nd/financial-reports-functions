---
name: prepare-function-app
description: Prepara la base técnica global de una Azure Function App para su migración aplicando únicamente cambios previamente planificados y preservando configuraciones válidas existentes.
---

# Prepare Function App

## Objetivo

Preparar la infraestructura técnica global necesaria para la migración.

Este skill puede modificar configuración global del proyecto.

No modifica comportamiento funcional de Functions.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`

## Precondiciones

Deben existir:

- `.migration/repository/inventory.json`
- `.migration/repository/assessment.json`
- `.migration/plans/migration-plan.json`

El plan debe permitir iniciar preparación.

## Principio

Aplicar solamente el delta necesario.

Antes de modificar un archivo:

1. comprobar su estado actual;
2. determinar si ya cumple el target;
3. preservar lo válido;
4. modificar solo lo necesario.

No reemplazar configuraciones válidas por plantillas estándar.

## Alcance

Modificar únicamente cuando el plan lo requiera:

- `package.json`;
- lockfile;
- Node.js declarado;
- dependencias;
- TypeScript;
- Jest;
- coverage;
- build;
- estructura `src/`;
- `host.json`;
- `.funcignore`;
- scripts npm;
- configuración técnica global necesaria.

## Node.js

Actualizar la declaración del target únicamente cuando el assessment indique `REQUIRED`.

Si ya cumple:

no modificar.

Este cambio no demuestra compatibilidad funcional.

## Runtime

Modificar configuración de Runtime únicamente cuando:

- esté bajo control del repositorio;
- exista evidencia;
- el plan lo requiera.

No deducir infraestructura leyendo archivos protegidos.

## Programming Model

No migrar Functions.

Puede preparar:

- dependencia `@azure/functions`;
- entrypoint global;
- estructura necesaria;

cuando el plan lo requiera.

La conversión de Functions legacy pertenece a otro skill.

## Dependencias

Actualizar únicamente dependencias autorizadas por el assessment y plan.

No actualizar por antigüedad.

No introducir paquetes sin necesidad concreta.

Mantener lockfile consistente.

## Package manager

Preservar el package manager existente cuando sea válido.

No migrar entre npm, yarn o pnpm sin decisión explícita.

## Scripts npm

Mantener scripts:

- breves;
- legibles;
- multiplataforma.

Evitar cuando sea práctico comandos shell específicos como:

- `rm -rf`;
- `cp`;
- `mv`;
- `mkdir -p`.

Preferir herramientas Node multiplataforma cuando se necesiten.

## TypeScript

Cuando corresponda, preparar configuración para:

- desarrollo;
- producción;
- tests.

No introducir archivos adicionales si la configuración existente ya resuelve estas necesidades.

## Build

Preparar scripts y configuración necesaria para:

- typecheck;
- build;
- tests.

El build global final no es requerido después de cada Function durante estados intermedios.

## Tests

Preparar Jest y tooling global cuando el plan lo requiera.

No crear tests de Functions.

Eso pertenece a `prepare-function`.

## Coverage

Configurar únicamente exclusiones justificadas.

No excluir lógica productiva para satisfacer thresholds.

## Estructura

Cuando el plan requiera reorganización, favorecer:

- `src/functions/` para adapters Azure;
- `src/<Capability>/` para implementación funcional.

No crear capas artificiales.

## host.json

Preservar configuración válida existente.

Modificar únicamente lo requerido por el target.

## .funcignore

Asegurar cuando corresponda que deployment excluya artefactos no runtime, como:

- `.migration`;
- coverage;
- test-results;
- tests;
- archivos locales;
- documentación de desarrollo.

No excluir contenido necesario para runtime.

## CI/CD y Sonar

No modificar pipelines reales.

Archivos de ejemplo pueden prepararse únicamente si el plan los contempla.

No convertir Sonar o CI/CD en gate obligatorio de migración salvo decisión explícita.

## Validación

Ejecutar las validaciones posibles en el estado actual, por ejemplo:

- JSON válido;
- instalación de dependencias;
- TypeScript config;
- validaciones estáticas.

No interpretar automáticamente fallos causados por Functions aún no adaptadas como fracaso final.

## Salidas

Crear:

`.migration/repository/preparation.json`

`.migration/repository/preparation.md`

Y:

`.migration/lessons/prepare-function-app/lessons.json`

`.migration/lessons/prepare-function-app/lessons.md`

## preparation.json

Registrar:

- archivos modificados;
- cambios aplicados;
- cambios omitidos por ya estar satisfechos;
- validaciones;
- resultados;
- riesgos;
- unknowns.

## preparation.md

Explicar:

- qué cambió;
- por qué;
- qué se preservó;
- qué estaba ya correcto;
- qué quedó pendiente;
- qué validaciones se ejecutaron.

## Lecciones aprendidas

Aplicar:

`../_shared/lessons-policy.md`

## Criterio de cierre

El skill termina cuando:

- se consumió el plan;
- solo se aplicaron cambios globales autorizados;
- se preservó configuración válida;
- las bases técnicas necesarias quedaron preparadas;
- no se modificó comportamiento funcional;
- se ejecutaron las validaciones razonables;
- se generaron preparation y lessons.

## Fuera de alcance

Este skill no debe:

- modificar lógica funcional;
- crear tests de una Function;
- migrar registros legacy;
- migrar Durable;
- resolver deuda no bloqueante;
- optimizar;
- modificar pipelines reales;
- desplegar.

El siguiente skill sugerido es:

`prepare-function`
