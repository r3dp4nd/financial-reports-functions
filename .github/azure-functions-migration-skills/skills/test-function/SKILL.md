---
name: test-function
description: Diseña, implementa y ejecuta tests con Jest para una Azure Function o su capability, priorizando comportamiento, lógica de aplicación y dominio sobre cobertura artificial. Usar para proteger comportamiento durante la migración o para consolidar la arquitectura desacoplada después del refactor.
---

# Test Function

## Propósito

Convertir comportamiento observado en evidencia ejecutable y mejorar la seguridad de cambios posteriores sin acoplar los tests innecesariamente al runtime Azure.

Antes de ejecutar, aplica `../../principles/copilot-rules.md`.

## Entradas

- escenarios de comportamiento identificados;
- código actual de la Function/capability;
- configuración Jest disponible;
- límites de aplicación e infraestructura existentes.

## Modos de uso

### Caracterización

Protege comportamiento relevante antes de refactors adicionales cuando el estado técnico permite pruebas fiables.

### Arquitectura objetivo

Prueba use cases, dominio y servicios desacoplados después del refactor.

## Trabajo

1. Prioriza escenarios funcionales y ramas de riesgo.
2. Prueba primero lógica de aplicación y dominio.
3. Sustituye límites de infraestructura relevantes mediante doubles cuando aporte aislamiento.
4. Prueba adapters solo cuando exista lógica propia o riesgo de mapping/configuración.
5. Evita mockear detalles internos sin valor contractual.
6. Ejecuta tests y corrige causas reales de fallo sin degradar comportamiento.
7. Produce cobertura como evidencia secundaria, no como objetivo aislado.
8. Comprueba que Jest mida comportamiento y no contratos sin lógica.
9. Identifica huecos que no puedan probarse razonablemente sin integración real.

## No hacer

- No generar tests únicamente para alcanzar un porcentaje.
- No cambiar negocio para que un test pase.
- No recrear el runtime Azure completo si el caso puede probarse en aplicación/dominio.
- No introducir abstracciones sin uso productivo solo para facilitar mocks.

## Evidencia esperada

Registra:

- escenarios cubiertos;
- tests ejecutados;
- resultados;
- cobertura disponible;
- exclusiones de coverage aplicadas por convención;
- casos pendientes y razón.

Cuando exista `.migration/`, registra esta evidencia según `../../references/evidence/migration-artifacts.md` y deriva escenarios desde el análisis vigente de la Function cuando exista.

## Finalización

Termina cuando los comportamientos de mayor valor/riesgo disponen de evidencia ejecutable suficiente para el alcance acordado.

## Referencias

- `../../references/testing/jest.md`: estrategia, TypeScript, coverage y dobles de prueba.
- `../../references/azure-functions/programming-model-v4.md`: solo si se prueba directamente un adapter/handler v4.
- `../../references/infrastructure/exceljs-document-generation.md`: solo si se prueban generators ExcelJS, templates o streaming de documentos.
- `../../references/infrastructure/cosmos-mongo-persistence.md`: solo si se prueban repositorios, query builders, paginación/cursors o mappers Cosmos/Mongo.
- `../../references/evidence/migration-artifacts.md`: contrato de evidencia reutilizable bajo `.migration/`.
