---
name: refactor-function
description: Refactoriza una Azure Function ya comprendida para desacoplar lógica de negocio, runtime e infraestructura mediante una arquitectura limpia/hexagonal mínima y orientada por capability. Usar después de estabilizar la migración técnica cuando el código necesita mejorar testabilidad y reducir acoplamiento.
---

# Refactor Function

## Propósito

Convertir la Function Azure en un adapter/composition root delgado y mover responsabilidades a límites coherentes sin introducir arquitectura ceremonial.

Antes de ejecutar, aplica `../../principles/copilot-rules.md`.

## Entradas

- análisis vigente de la Function;
- comportamiento que debe preservarse;
- estado técnico migrado o suficientemente estable;
- componentes compartidos identificados.

## Trabajo

1. Revisa la separación conceptual propuesta durante el análisis.
2. Mantén la Function Azure enfocada en:
   - recibir;
   - mapear;
   - invocar aplicación;
   - responder.
3. Separa lógica de aplicación del runtime.
4. Extrae límites de infraestructura solo cuando existe una dependencia real.
5. Mantén el código organizado por capability/flujo de negocio.
6. Organiza `application`, `domain` e `infrastructure` según responsabilidades internas cuando la capa ya no sea trivial.
7. Aplica dependency injection explícita cuando reduzca acoplamiento real o facilite tests.
8. Crea únicamente carpetas, interfaces y módulos que tengan uso inmediato.
9. Divide servicios monolíticos por responsabilidad, no por cantidad de métodos.
10. Usa el mapa de slicing vigente cuando exista; si no existe y el riesgo es alto, registra el bloqueo antes de mover.
11. Si hay persistencia Cosmos/Mongo, corrige el smell de menor riesgo que permita probar query, paginación o mapping sin base real.
12. Si hay generación Excel/CSV, corrige el smell de menor riesgo que permita probar filtros, template o generator sin acoplarse al flujo completo.
13. Si una pieza tiene varios consumidores, no la refactorices como parte exclusiva de esta Function; trátala como componente compartido.
14. Documenta cambios deseables fuera de alcance como deuda técnica o mejora futura.
15. Comprueba de forma incremental que el comportamiento preservado sigue siendo consistente.

## No hacer

- No crear capas vacías.
- No crear interfaces para cada clase.
- No introducir patrones por preferencia estilística.
- No cambiar reglas de negocio.
- No absorber silenciosamente refactors transversales.
- No reescribir módulos completos si una evolución localizada es suficiente.

## Evidencia esperada

Registra:

- responsabilidades movidas;
- smells tratados y evidencia que justificó cada corte;
- límites creados y razón;
- estructura y naming aplicados;
- dependency injection aplicada o descartada con razón;
- dependencias desacopladas;
- componentes compartidos detectados;
- deuda técnica o mejoras futuras fuera de alcance;
- validaciones realizadas.

Cuando exista `.migration/`, registra esta evidencia según `../../references/evidence/migration-artifacts.md` y enlaza el análisis o la migración previa en vez de repetirlos.

## Finalización

Termina cuando la Function tiene límites suficientemente claros para probar negocio sin depender innecesariamente del runtime Azure y no quedan abstracciones sin justificación.

## Referencias

- `../../references/architecture/function-architecture.md`: arquitectura objetivo y criterios para evitar sobrearquitectura.
- `../../references/architecture/capability-slicing.md`: solo si se divide un servicio monolítico, god file o módulo con responsabilidades mezcladas.
- `../../references/infrastructure/exceljs-document-generation.md`: solo si se refactoriza generación Excel/CSV, streaming o templates.
- `../../references/infrastructure/cosmos-mongo-persistence.md`: solo si se refactoriza persistencia Cosmos/Mongo, queries o mappers de documentos.
- `../../references/planning/migration-scope-and-debt.md`: cambios fuera de alcance, deuda y mejoras futuras.
- `../../references/evidence/migration-artifacts.md`: contrato de evidencia reutilizable bajo `.migration/`.
