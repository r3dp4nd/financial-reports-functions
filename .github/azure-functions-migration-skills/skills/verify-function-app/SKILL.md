---
name: verify-function-app
description: Verifica integralmente una Azure Function App después de la migración mediante comparación antes/después, build, tests, cobertura, registro de Functions, triggers, bindings, configuración y artefactos legacy. Usar cuando se necesita demostrar que el conjunto migrado converge correctamente y está listo para la siguiente validación o despliegue.
---

# Verify Function App

## Propósito

Demostrar con evidencia que la Function App completa alcanzó un estado técnico coherente después de las transformaciones.

Antes de ejecutar, aplica `../../principles/copilot-rules.md`.

Antes de reconstruir inventarios, aplica `../../references/context/context-engineering.md` para consumir `.migration/` vigente y revisar solo discrepancias.

## Entradas

- assessment inicial;
- estado actual del repositorio;
- evidencia por Function;
- evidencia de componentes compartidos;
- configuración de build/test;
- restricciones del entorno de ejecución.

## Trabajo

1. Compara inventario inicial y final:
   - Functions;
   - triggers;
   - bindings;
   - recursos relevantes.
2. Comprueba versiones objetivo observables:
   - Node.js;
   - Azure Functions Runtime;
   - Programming Model;
   - Extension Bundle cuando aplique;
   - dependencias críticas.
3. Busca artefactos legacy que ya no deberían participar en la aplicación.
4. Ejecuta install/build/test/coverage según los scripts del proyecto y el entorno disponible.
5. Valida registro de Functions y arranque local seguro cuando sea viable.
6. Comprueba que la configuración global sea coherente con el código final.
7. Comprueba que settings, bindings y plantillas locales estén documentados sin secretos.
8. Verifica que componentes compartidos y consumidores hayan convergido.
9. Comprueba que deuda técnica y mejoras futuras fuera de alcance estén registradas.
10. Resume bloqueos, desviaciones y evidencia faltante.
11. No declares éxito si una comprobación requerida no pudo ejecutarse; marca explícitamente su estado.

## No hacer

- No ocultar fallos porque el resto de verificaciones pase.
- No corregir silenciosamente grandes problemas arquitectónicos durante la verificación.
- No convertir una inferencia en evidencia.
- No leer archivos sensibles para "completar" una validación.

## Evidencia esperada

Produce una comparación clara entre estado inicial y final, con:

- verificaciones ejecutadas;
- resultado de cada una;
- diferencias justificadas;
- estado de settings y configuración sin valores sensibles;
- bloqueos;
- deuda técnica y mejoras futuras documentadas;
- desconocidos;
- conclusión sustentada.

Cuando exista `.migration/`, registra esta evidencia según `../../references/evidence/migration-artifacts.md` y consume los artefactos previos aplicables antes de reconstruir comparaciones. Carga `../../references/evidence/artifact-contracts.md` solo si necesitas el contrato detallado de `verification.md`.

## Finalización

Termina cuando puede determinarse, con evidencia, si la Function App está técnicamente convergida o qué impide considerarla lista.

## Referencias

Carga según el alcance final:

- `../../references/context/context-engineering.md`: para priorizar evidencia previa, evitar reconstrucción completa y dirigir verificaciones.
- `../../references/azure-functions/platform-target.md`: Runtime v4, Node.js 24 y hosting.
- `../../references/azure-functions/programming-model-v4.md`: convergencia completa del modelo.
- `../../references/azure-functions/bindings-v4.md`: comparación de triggers y bindings.
- `../../references/configuration/environment-and-bindings.md`: settings, bindings y configuración local/hospedada.
- `../../references/azure-functions/durable-v4.md`: únicamente si existe Durable Functions.
- `../../references/testing/jest.md`: tests y coverage.
- `../../references/quality/sonar.md`: cuando Sonar forme parte del objetivo.
- `../../references/planning/migration-scope-and-debt.md`: alcance, deuda y mejoras futuras.
- `../../references/evidence/migration-artifacts.md`: reglas ligeras de evidencia reutilizable bajo `.migration/`.
- `../../references/evidence/artifact-contracts.md`: solo cuando necesites detalle completo del artefacto.
