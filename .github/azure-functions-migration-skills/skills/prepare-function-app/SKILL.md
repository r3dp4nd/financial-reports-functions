---
name: prepare-function-app
description: Prepara una Azure Function App para una migración controlada configurando tooling y cambios globales seguros, como Jest, cobertura, scripts npm, TypeScript y metadatos de calidad. Usar después de comprender el estado actual y antes de transformaciones que dependan de estas capacidades.
---

# Prepare Function App

## Propósito

Preparar el terreno global de la Function App sin adelantar cambios técnicos que todavía dependan de adaptar Functions o componentes compartidos.

Actúa como responsable de tooling, configuración global y preparación segura.

Antes de ejecutar, aplica `../../principles/copilot-rules.md`.

## Entradas

- assessment vigente de la Function App, si existe;
- `package.json`;
- configuración TypeScript;
- configuración de testing y calidad existente;
- restricciones del repositorio y del entorno.

## Trabajo

1. Determina qué tooling global puede prepararse sin romper prematuramente el proyecto.
2. Configura TypeScript base, productivo y de specs cuando formen parte del objetivo.
3. Configura Jest y cobertura cuando formen parte del objetivo.
4. Normaliza scripts npm necesarios para build, typecheck, test y coverage sin duplicar comandos.
5. Ajusta configuración TypeScript únicamente cuando el cambio sea global y justificado.
6. Alinea exclusiones de coverage con la estructura/naming objetivo cuando el repositorio ya use o adopte esa convención.
7. Prepara plantillas o documentación local de settings solo con placeholders seguros cuando corresponda.
8. Prepara metadatos/configuración para Sonar cuando corresponda.
9. Registra dependencias o cambios globales que deben esperar a la convergencia del código.
10. Mantén separados:
   - tooling;
   - runtime;
   - Programming Model;
   - SDKs;
   - librerías utilitarias.

## No hacer

- No ejecutar actualizaciones indiscriminadas a `latest`.
- No mezclar automáticamente migración a Programming Model v4 con preparación de tooling.
- No cambiar reglas de negocio.
- No refactorizar Functions.
- No modificar componentes compartidos como efecto colateral.

## Evidencia esperada

Registra:

- cambios globales aplicados;
- cambios pospuestos y motivo;
- scripts disponibles;
- configuración TypeScript base/prod/spec;
- configuración de testing/coverage;
- settings requeridos para ejecución local, solo por nombre;
- convenciones de exclusión aplicadas;
- cualquier incompatibilidad detectada durante la preparación.

Cuando exista `.migration/`, registra esta evidencia según `../../references/evidence/migration-artifacts.md` y reutiliza el assessment vigente antes de volver a inventariar tooling global. Carga `../../references/evidence/artifact-contracts.md` solo si necesitas el contrato detallado de `preparation.md`.

## Finalización

Termina cuando el repositorio dispone del tooling global necesario para continuar de forma controlada y los cambios que deben esperar están explícitamente identificados.

## Referencias

- `../../references/azure-functions/platform-target.md`: restricciones globales de runtime/Node.js.
- `../../references/dependencies/dependency-strategy.md`: cambios seguros en `package.json` y lockfile.
- `../../references/dependencies/azure-sdk-js.md`: solo si la preparación incluye recomendar o actualizar SDKs Azure detectados.
- `../../references/dependencies/runtime-baseline.md`: solo si vas a sugerir versiones runtime concretas.
- `references/typescript-build-scripts.md`: TypeScript, scripts npm y validaciones globales propias de preparación.
- `../../references/configuration/environment-and-bindings.md`: settings, local settings y configuración compartida.
- `../../references/testing/jest.md`: solo cuando Jest/testing formen parte del objetivo.
- `../../references/quality/sonar.md`: solo cuando Sonar forme parte del alcance.
- `../../references/evidence/migration-artifacts.md`: reglas ligeras de evidencia reutilizable bajo `.migration/`.
- `../../references/evidence/artifact-contracts.md`: solo cuando necesites detalle completo del artefacto.
