---
name: plan-function-migration
description: Construye el plan de migración de una Azure Function App a partir del inventario, assessment y análisis individuales de sus Functions. Define qué debe cambiar, qué debe preservarse, el orden recomendado y las verificaciones necesarias, sin modificar código.
---

# Plan Function Migration

## Objetivo

Construir un plan de migración ejecutable y trazable para una Azure Function App.

El plan debe consolidar evidencia ya producida y determinar:

- qué cambios son obligatorios;
- qué dimensiones ya cumplen el objetivo;
- qué Functions necesitan preparación;
- qué Functions necesitan migración de Programming Model;
- qué workflows Durable requieren tratamiento especializado;
- qué orden reduce riesgos;
- qué comportamiento debe preservarse;
- qué verificaciones deben ejecutarse posteriormente.

Este skill no modifica código.

## Precondiciones

Deben existir:

`.migration/repository/inventory.json`

`.migration/repository/assessment.json`

y los análisis requeridos:

`.migration/functions/<FunctionName>/analysis.json`

El plan no debe construirse como definitivo si faltan análisis necesarios.

Si falta información crítica:

- registrar el gap;
- marcar el plan como incompleto;
- no inventar decisiones.

## Entradas

Consumir primero:

- `inventory.json`;
- `assessment.json`;
- todos los `analysis.json` disponibles.

No volver a analizar el repositorio por defecto.

Consultar código únicamente si existe una contradicción que no pueda resolverse mediante los artefactos existentes.

## Principio

Este skill planifica a partir de evidencia.

No debe convertir:

- deuda técnica;
- preferencias arquitectónicas;
- optimizaciones;
- modernizaciones opcionales;

en requisitos obligatorios de migración.

Mantener separadas las categorías:

- `REQUIRED_PLATFORM`
- `REQUIRED_NODE`
- `REQUIRED_TESTABILITY`
- `STRUCTURAL`
- `TECHNICAL_DEBT`
- `OPTIMIZATION`

## Estado objetivo

Usar el target confirmado por `assessment.json`.

Normalmente:

- Node.js 24;
- Azure Functions Runtime v4;
- Programming Model v4;
- dependencias compatibles;
- tests requeridos para proteger comportamiento;
- estructura suficiente para mantener testabilidad y migración segura.

No asumir que todas las dimensiones necesitan cambios.

## Cobertura del plan

El plan debe contener dos niveles:

1. plan global de la Function App;
2. plan específico por Function o unidad funcional.

## Plan global

Determinar únicamente los cambios transversales necesarios.

Ejemplos:

- versión Node.js;
- Azure Functions Runtime;
- dependencias compartidas;
- TypeScript;
- configuración de tests;
- estructura base;
- build;
- configuración necesaria para validación;
- preparación de Programming Model v4;
- Durable Functions cuando aplique.

No incluir cambios globales que no estén respaldados por assessment o análisis.

## Plan por Function

Para cada Function analizada, definir:

- comportamiento a preservar;
- tests necesarios;
- refactor mínimo requerido;
- cambios de Node.js relevantes;
- cambio de Programming Model cuando aplique;
- dependencias afectadas;
- relaciones relevantes;
- riesgos;
- criterios de validación.

No volver a describir todo el análisis.

El plan debe convertir hallazgos en acciones concretas.

## Functions ya en Programming Model v4

Si una Function ya utiliza Programming Model v4:

- marcar migración del modelo como `NOT_REQUIRED`;
- preservar su registro actual salvo necesidad demostrada;
- incluir únicamente refactor, tests, compatibilidad Node.js u otros cambios realmente necesarios.

No ejecutar ni planificar una migración innecesaria del modelo.

## Functions legacy

Si una Function utiliza Programming Model legacy y el assessment requiere v4:

incluir una acción `REQUIRED_PLATFORM`.

El plan debe identificar los puntos relevantes que posteriormente deberán transformarse, por ejemplo:

- `function.json`;
- `context`;
- `context.bindings`;
- `context.res`;
- bindings declarativos;
- entrypoint legacy.

No generar todavía el código v4.

## Durable Functions

Los workflows Durable deben planificarse como unidades coherentes.

Cuando exista:

- starter;
- orchestrator;
- activities;

identificar el workflow y sus dependencias.

No planificar la migración de cada Activity de forma desconectada si pertenece al mismo flujo.

El plan puede contener acciones por Function, pero debe preservar el orden y coherencia del workflow Durable.

## Tests y preparación

Los tests identificados por `analyze-function` deben planificarse antes de cambios que puedan alterar comportamiento
cuando sea posible.

Secuencia preferida:

1. refactor mínimo para testabilidad, cuando sea necesario;
2. agregar tests de caracterización o unitarios;
3. obtener baseline verde;
4. aplicar cambios de migración;
5. ejecutar los mismos tests;
6. verificar comportamiento preservado.

No inventar tests adicionales sin evidencia.

## Dependencias

Usar las conclusiones del assessment.

Para una dependencia:

- `REQUIRED` → incluir actualización;
- `NOT_REQUIRED` → preservar;
- `REQUIRES_VALIDATION` → incluir validación antes del cambio.

No elegir versiones nuevas sin evidencia oficial previamente confirmada.

Si la versión target todavía es desconocida, el plan debe registrar:

`REQUIRES_VALIDATION`

en lugar de inventarla.

## Orden de ejecución

Construir un orden que minimice estados inconsistentes.

Considerar:

- dependencias compartidas;
- configuración global;
- Functions independientes;
- workflows Durable;
- tests;
- Programming Model;
- build global.

No asumir que cada Function puede compilar de forma aislada durante una migración parcial.

La compilación final de la Function App se realiza cuando las adaptaciones necesarias de la aplicación están
completadas.

Validaciones estáticas o selectivas intermedias pueden ejecutarse cuando aporten evidencia útil.

## Riesgos

Consolidar únicamente riesgos ya identificados.

Ejemplos:

- dependencia sin compatibilidad confirmada;
- workflow Durable;
- fuerte acoplamiento;
- comportamiento sin tests;
- configuración local faltante;
- Programming Model mixto;
- runtime desconocido.

Cada riesgo debe tener una acción de mitigación o validación.

## Unknowns

Los unknowns no desaparecen al planificar.

Cada unknown debe:

- permanecer explícito;
- indicar qué evidencia falta;
- bloquear únicamente la acción que dependa de él.

No bloquear toda la migración si el unknown afecta solo una parte independiente.

## Salidas

Crear:

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

Crear además, para cada Function analizada:

`.migration/functions/<FunctionName>/migration-plan.json`

`.migration/functions/<FunctionName>/migration-plan.md`

Y las lecciones:

`.migration/lessons/plan-function-migration/lessons.json`

`.migration/lessons/plan-function-migration/lessons.md`

Crear únicamente las carpetas necesarias.

## migration-plan.json global

Debe contener como mínimo:

- metadata;
- target;
- estado del plan;
- precondiciones;
- cambios globales;
- orden recomendado;
- Functions incluidas;
- workflows Durable;
- riesgos;
- unknowns;
- criterios de verificación;
- evidencia de origen.

Estados sugeridos del plan:

- `READY`
- `PARTIAL`
- `BLOCKED`

`READY` no significa que la migración haya sido ejecutada.

Significa que existe evidencia suficiente para iniciar las acciones planificadas.

## migration-plan.md global

Debe explicar al desarrollador:

- punto de partida;
- objetivo;
- qué ya está cumplido;
- qué cambios globales son necesarios;
- orden recomendado;
- Functions que requieren trabajo;
- workflows especiales;
- riesgos;
- unknowns;
- condiciones antes de comenzar implementación.

Debe ser breve y accionable.

No copiar los análisis completos.

## Plan por Function

Cada `migration-plan.json` por Function debe incluir como mínimo:

- Function;
- comportamiento a preservar;
- preparación requerida;
- tests requeridos;
- cambios obligatorios;
- cambios estructurales;
- deuda técnica fuera de alcance;
- pasos recomendados;
- criterios de verificación;
- riesgos;
- unknowns.

El Markdown correspondiente debe ser la explicación humana de esas acciones.

## Lecciones aprendidas

Registrar únicamente observaciones útiles para mejorar la planificación:

- dependencias entre Functions no contempladas;
- orden incorrecto;
- acciones duplicadas;
- información faltante en análisis previos;
- categorías insuficientes;
- planificación demasiado detallada;
- oportunidad de simplificación;
- decisiones que deberían resolverse en otro skill.

No modificar automáticamente el skill.

Toda mejora requiere revisión humana.

## Criterio de cierre

El skill termina cuando:

- inventory y assessment fueron consumidos;
- los análisis disponibles fueron consolidados;
- se identificaron análisis faltantes;
- los cambios globales fueron definidos;
- cada Function incluida tiene un plan;
- los workflows Durable fueron tratados como unidades coherentes;
- las dimensiones ya satisfechas no tienen acciones innecesarias;
- deuda técnica y optimización permanecen separadas;
- riesgos y unknowns están visibles;
- existe un orden recomendado;
- se generaron los artefactos globales;
- se generaron los artefactos por Function;
- se generaron las lecciones aprendidas.

## Fuera de alcance

Este skill no debe:

- modificar código;
- agregar tests;
- actualizar dependencias;
- cambiar configuración;
- ejecutar migraciones;
- resolver unknowns mediante suposiciones;
- aplicar Clean Architecture;
- resolver deuda técnica no bloqueante;
- optimizar código.

El siguiente skill sugerido es:

`prepare-function-app`
