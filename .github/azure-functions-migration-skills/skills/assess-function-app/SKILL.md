---
name: assess-function-app
description: Analiza una Azure Function App legacy para comprender qué hace, inventariar Functions, triggers, bindings, runtimes, dependencias, componentes compartidos y brechas hacia el objetivo de migración. Usar antes de realizar cambios globales o cuando se necesite actualizar la fotografía técnica de la aplicación.
---

# Assess Function App

## Propósito

Construir una fotografía técnica y funcional del estado actual de la Function App sin modificar el repositorio.

Antes de ejecutar, aplica `../../principles/copilot-rules.md`.

## Entradas

Usa únicamente evidencia necesaria del repositorio:

- `package.json`;
- `host.json`;
- configuración de TypeScript y testing no sensible;
- código fuente de Functions;
- definición de triggers y bindings;
- dependencias importadas;
- componentes compartidos;
- documentación técnica existente cuando sea relevante.

Respeta las exclusiones de archivos sensibles definidas por el entorno o proyecto.

## Trabajo

1. Identifica el propósito observable de la Function App.
2. Detecta Functions y sus relaciones.
3. Registra triggers, bindings y recursos externos.
4. Determina versiones observables de Node.js, Azure Functions Runtime, Programming Model, TypeScript y paquetes relevantes.
5. Clasifica dependencias según impacto esperado: mantener, actualizar, reemplazar, eliminar o investigar.
6. Inventaría variables de entorno y settings usados por código, bindings y configuración, solo por nombre.
7. Identifica servicios, clientes, repositorios y configuración compartidos.
8. Evalúa madurez observable de estructura, separación de responsabilidades, dependency injection, testing y calidad.
9. Define qué entra en el alcance de migración y qué debe quedar fuera.
10. Describe la arquitectura observable sin imponer todavía la arquitectura objetivo.
11. Identifica brechas, riesgos, deuda relevante y desconocidos.
12. Propone un mapa de migración de alto nivel sin convertirlo en un workflow obligatorio.

## No hacer

- No modificar código ni configuración.
- No refactorizar.
- No actualizar dependencias.
- No inventar comportamiento que no pueda sustentarse.
- No leer secretos ni archivos excluidos por la política del proyecto.

## Evidencia esperada

Produce una visión que permita responder:

- qué hace la aplicación;
- qué contiene;
- qué comparte;
- qué debe cambiar;
- qué entra y qué queda fuera del alcance de migración;
- qué variables/settings requiere;
- qué requiere investigación;
- qué riesgos condicionan la migración.

Cuando exista una convención de evidencia, conserva el resultado bajo `.migration/` sin convertir esa carpeta en un motor de estado. Usa `../../references/evidence/migration-artifacts.md` para nombrar y estructurar el artefacto.

## Finalización

Termina cuando existe información suficiente para que el desarrollador pueda decidir qué preparar, qué Function analizar en profundidad y qué componentes compartidos requieren atención.

## Referencias

Carga solo las necesarias para el caso:

- `../../references/azure-functions/platform-target.md`: compatibilidad Runtime v4, Node.js 24 y hosting.
- `../../references/azure-functions/programming-model-v4.md`: identificación y brechas del modelo.
- `../../references/dependencies/dependency-strategy.md`: clasificación de dependencias.
- `../../references/configuration/environment-and-bindings.md`: inventario de settings, bindings y configuración.
- `../../references/planning/migration-scope-and-debt.md`: alcance, fuera de alcance y deuda futura.
- `../../references/evidence/migration-artifacts.md`: contrato de evidencia reutilizable bajo `.migration/`.
