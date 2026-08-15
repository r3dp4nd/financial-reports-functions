---
name: prepare-function-app
description: Prepara una Azure Function App para una migración controlada configurando tooling y cambios globales seguros, como Jest, cobertura, scripts npm, TypeScript y metadatos de calidad. Usar después de comprender el estado actual y antes de transformaciones que dependan de estas capacidades.
---

# Prepare Function App

## Propósito

Preparar el terreno global de la Function App sin adelantar cambios técnicos que todavía dependan de adaptar Functions o componentes compartidos.

Antes de ejecutar, aplica `../../principles/copilot-rules.md`.

## Entradas

- assessment vigente de la Function App, si existe;
- `package.json`;
- configuración TypeScript;
- configuración de testing y calidad existente;
- restricciones del repositorio y del entorno.

## Trabajo

1. Determina qué tooling global puede prepararse sin romper prematuramente el proyecto.
2. Configura Jest y cobertura cuando formen parte del objetivo.
3. Normaliza scripts npm necesarios para build, test y coverage sin duplicar comandos.
4. Ajusta configuración TypeScript únicamente cuando el cambio sea global y justificado.
5. Prepara metadatos/configuración para Sonar cuando corresponda.
6. Registra dependencias o cambios globales que deben esperar a la convergencia del código.
7. Mantén separados:
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
- configuración de testing/coverage;
- cualquier incompatibilidad detectada durante la preparación.

## Finalización

Termina cuando el repositorio dispone del tooling global necesario para continuar de forma controlada y los cambios que deben esperar están explícitamente identificados.

## Referencias

- `../../references/azure-functions/platform-target.md`: restricciones globales de runtime/Node.js.
- `../../references/dependencies/dependency-strategy.md`: cambios seguros en `package.json` y lockfile.
- `../../references/testing/jest.md`: solo cuando Jest/testing formen parte del objetivo.
- `../../references/quality/sonar.md`: solo cuando Sonar forme parte del alcance.
