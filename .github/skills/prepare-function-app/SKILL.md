---
name: prepare-function-app
description: Prepara de forma mínima una Azure Function App para su migración a Node.js 24, Azure Functions Runtime v4 y Programming Model v4, aplicando únicamente cambios globales previamente planificados y preservando configuraciones válidas existentes.
---

# Prepare Function App

## Objetivo

Preparar la base técnica global de una Azure Function App para ejecutar posteriormente la preparación y migración de sus
Functions.

Este skill puede modificar archivos globales del proyecto.

Debe aplicar únicamente cambios respaldados por:

`.migration/repository/assessment.json`

y:

`.migration/plans/migration-plan.json`

No debe migrar todavía el comportamiento de Functions individuales.

## Precondiciones

Deben existir:

- `.migration/repository/inventory.json`
- `.migration/repository/assessment.json`
- `.migration/plans/migration-plan.json`

El plan debe estar en estado:

- `READY`

o permitir explícitamente preparación parcial segura.

Si una decisión necesaria está marcada como `REQUIRES_VALIDATION`, no inventar una solución.

## Principio

Preparar únicamente lo necesario.

No reemplazar configuraciones válidas por configuraciones estándar solo por uniformidad.

Antes de modificar un archivo:

1. identificar su estado actual;
2. comprobar si ya satisface el objetivo;
3. aplicar únicamente el delta necesario.

Preferir cambios pequeños y reversibles.

## Alcance global

Evaluar y modificar únicamente cuando el plan lo requiera:

- `package.json`;
- `package-lock.json`;
- Node.js target;
- dependencias globales;
- TypeScript;
- configuración de build;
- configuración de tests;
- coverage;
- estructura `src/`;
- `host.json`;
- `.funcignore`;
- configuración de análisis estático preparada;
- scripts npm;
- otros archivos globales expresamente incluidos en el plan.

No modificar todavía lógica funcional.

## Node.js

Si el assessment indica:

`action = REQUIRED`

actualizar la declaración del runtime objetivo según el plan.

Ejemplo conceptual:

`Node.js 24`

No asumir que esta modificación demuestra compatibilidad del código.

La compatibilidad funcional seguirá siendo validada por los tests y skills posteriores.

Si Node.js ya cumple el target:

`NOT_REQUIRED`

y no modificarlo.

## Azure Functions Runtime

Modificar configuración relacionada con Azure Functions Runtime únicamente cuando esté bajo control del repositorio y el
plan lo requiera.

No asumir valores de infraestructura externa que no estén disponibles como evidencia segura.

No leer pipelines, secretos ni infraestructura sensible para deducir runtime desplegado.

Cuando el runtime real dependa de infraestructura externa no accesible:

registrar la validación pendiente.

## Programming Model

Este skill no migra Functions al Programming Model v4.

Puede preparar dependencias y estructura necesarias únicamente cuando el plan lo requiera.

La transformación de registros y handlers pertenece a:

`migrate-programming-model-v4`

Si la aplicación ya usa Programming Model v4, preservar esa configuración.

## Dependencias

Actualizar únicamente dependencias cuya modificación esté aprobada en el plan.

Distinguir:

- runtime dependencies;
- development dependencies;
- Azure SDK;
- Azure Functions;
- Durable Functions;
- TypeScript;
- Jest y tooling.

No actualizar dependencias solo porque exista una versión más reciente.

No introducir paquetes sin una necesidad concreta.

## Package manager

Preservar el package manager existente cuando sea válido.

Si existe `package-lock.json`, mantener npm salvo decisión explícita contraria.

Después de cambios de dependencias, mantener lockfile consistente.

No cambiar npm por yarn, pnpm u otro package manager sin necesidad demostrada.

## Scripts npm

Mantener scripts:

- breves;
- legibles;
- multiplataforma.

Evitar cuando sea práctico:

- `rm -rf`;
- `cp`;
- `mv`;
- `mkdir -p`;
- sintaxis de variables de entorno dependiente del shell.

Preferir herramientas Node.js multiplataforma cuando sean necesarias.

No convertir scripts npm en un framework de automatización.

## TypeScript

Si el proyecto utiliza TypeScript, preparar únicamente las configuraciones necesarias.

Cuando aplique, separar:

- configuración de desarrollo;
- configuración de producción;
- configuración de tests.

Ejemplo conceptual:

- `tsconfig.json`
- `tsconfig.prod.json`
- `tsconfig.spec.json`

No introducir esta separación si el proyecto ya dispone de una estructura equivalente válida.

## Build

La configuración debe permitir distinguir:

- validación de tipos;
- build de desarrollo;
- build de producción.

El build de producción no debe incluir tests cuando estos vivan dentro de `src/`.

No asumir que cada Function debe poder compilarse de forma independiente durante la migración parcial.

La compilación final se ejecutará cuando las adaptaciones necesarias de la Function App estén completas.

## Tests

Si el plan requiere preparar Jest:

configurar únicamente la infraestructura global necesaria.

Ejemplos:

- Jest;
- ts-jest;
- tipos;
- coverage;
- reporters requeridos.

No crear todavía tests de Functions.

Eso pertenece a:

`prepare-function`

Preservar configuraciones Jest existentes que ya sean válidas.

## Coverage

Configurar coverage sobre código con comportamiento ejecutable.

Excluir únicamente archivos cuya exclusión tenga justificación.

No utilizar patrones de archivo para ocultar lógica real de coverage.

Las exclusiones temporales legacy deben quedar identificables para su eliminación posterior.

## Estructura

Si el plan requiere reorganización hacia `src/`, preparar la estructura mínima necesaria.

Preferir:

`src/functions/`

para adapters o composition roots de Azure Functions.

Y:

`src/<Capability>/`

para implementación funcional cuando sea apropiado.

No crear automáticamente:

- domain;
- application;
- infrastructure;
- ports;
- adapters;

para cada Function.

La arquitectura interna se decide según la complejidad observada.

## host.json

Preservar configuración existente válida.

Modificar únicamente propiedades requeridas por el target o por dependencias confirmadas.

No eliminar configuración desconocida solo porque no sea utilizada por este skill.

## .funcignore

Asegurar que el paquete de despliegue no incluya artefactos innecesarios cuando corresponda.

Considerar exclusión de:

- código fuente si el deployment usa `dist`;
- tests;
- coverage;
- resultados de tests;
- `.migration`;
- archivos locales;
- documentación;
- artefactos de desarrollo.

Nunca excluir archivos runtime requeridos sin evidencia.

## Configuración sensible

No leer ni modificar automáticamente:

- `local.settings.json`;
- `.env`;
- secretos;
- certificados;
- archivos CI/CD sensibles;
- configuración de infraestructura protegida.

Si una validación posterior necesita settings, usar únicamente una copia sanitizada o expresamente aprobada.

## Sonar y CI/CD

La preparación de archivos de ejemplo puede realizarse únicamente si está incluida en el plan.

No activar integraciones externas.

No modificar pipelines reales.

No asumir service connections, tokens, proyectos o infraestructura.

CI/CD y Sonar preparados como ejemplo no deben convertirse en requisitos para cerrar la migración salvo decisión
explícita del proyecto.

## Cambios permitidos

Los cambios aplicados deben corresponder únicamente a:

- `REQUIRED_PLATFORM`
- `REQUIRED_NODE`
- `REQUIRED_TESTABILITY`
- `STRUCTURAL`

`TECHNICAL_DEBT` solo se modifica si bloquea alguno de los anteriores.

`OPTIMIZATION` está fuera de alcance.

## Verificación durante preparación

Después de cambios globales, ejecutar únicamente validaciones que sean razonables en el estado actual.

Ejemplos:

- JSON válido;
- configuración TypeScript válida;
- instalación de dependencias cuando sea posible;
- typecheck global únicamente cuando el estado parcial lo permita;
- validaciones estáticas.

No interpretar fallos esperables de Functions aún no migradas como fracaso definitivo de la preparación.

Registrar las validaciones realizadas y sus resultados.

## Salidas

Crear:

`.migration/repository/preparation.json`

`.migration/repository/preparation.md`

Y:

`.migration/lessons/prepare-function-app/lessons.json`

`.migration/lessons/prepare-function-app/lessons.md`

## preparation.json

Debe registrar como mínimo:

- metadata;
- archivos modificados;
- cambios aplicados;
- cambios omitidos por ya estar satisfechos;
- decisiones pendientes;
- validaciones ejecutadas;
- resultados;
- riesgos;
- unknowns;
- evidencia del plan utilizada.

No almacenar secretos ni contenidos sensibles.

## preparation.md

Debe explicar brevemente:

- qué se modificó;
- por qué;
- qué se preservó;
- qué ya estaba correcto;
- qué quedó pendiente;
- qué validaciones pasaron o fallaron;
- qué debe revisar el desarrollador antes de continuar.

No debe ser un diff completo.

## Lecciones aprendidas

Registrar únicamente observaciones útiles sobre:

- configuración ya válida que el skill evitó reemplazar;
- caso no contemplado;
- dependencia inesperada;
- script no multiplataforma;
- configuración difícil de preservar;
- cambio innecesario detectado;
- validación que produjo falso fallo;
- oportunidad de simplificar;
- posible mejora del skill.

No modificar automáticamente el skill.

Toda mejora requiere revisión humana.

## Criterio de cierre

El skill termina cuando:

- se consumió el plan aprobado;
- únicamente se aplicaron cambios globales autorizados;
- configuraciones válidas existentes fueron preservadas;
- las dependencias globales requeridas quedaron preparadas;
- el entorno TypeScript/build/test quedó preparado cuando correspondía;
- no se modificó comportamiento funcional;
- no se leyeron archivos sensibles;
- las validaciones posibles fueron ejecutadas;
- los resultados fueron registrados;
- se generaron preparation y lessons.

## Fuera de alcance

Este skill no debe:

- cambiar comportamiento de negocio;
- migrar handlers individuales;
- crear tests de una Function;
- migrar registros `app.*`;
- migrar workflows Durable;
- aplicar Clean Architecture a Functions;
- resolver deuda técnica no bloqueante;
- optimizar código;
- modificar pipelines reales;
- desplegar la Function App.

El siguiente skill sugerido es:

`prepare-function`
