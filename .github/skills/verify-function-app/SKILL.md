---
name: verify-function-app
description: Verifica de forma determinista una Azure Function App después de su preparación y migración, consolidando build, tests, coverage, registro de Functions, artefactos legacy, packaging, compatibilidad objetivo y deuda técnica restante sin modificar comportamiento.
---

# Verify Function App

## Objetivo

Verificar que una Azure Function App migrada cumple las condiciones técnicas necesarias para cerrar la migración.

Este skill debe consolidar evidencia, no introducir cambios funcionales.

Debe responder:

- si la aplicación compila;
- si los tests pasan;
- si el comportamiento protegido permanece válido;
- si las Functions esperadas siguen registradas;
- si quedaron artefactos legacy;
- si Runtime, Node.js y Programming Model alcanzaron el target;
- si el paquete de despliegue es coherente;
- qué riesgos o unknowns permanecen;
- qué deuda técnica queda documentada fuera del alcance de la migración.

## Precondiciones

Deben existir, cuando correspondan:

`.migration/repository/inventory.json`

`.migration/repository/assessment.json`

`.migration/repository/preparation.json`

`.migration/plans/migration-plan.json`

y los artefactos producidos por:

- `prepare-function`;
- `migrate-programming-model-v4`;
- `migrate-durable-functions-v4`.

No asumir que todos los skills anteriores aplicaron.

Una Function que ya estaba en Programming Model v4 puede no tener un artefacto de migración del modelo.

## Principio

Verificar mediante evidencia reproducible.

Preferir:

1. comandos deterministas;
2. configuración efectiva;
3. tests;
4. build;
5. Azure Functions Host local cuando sea posible;
6. inspección estructural;
7. artefactos previos.

No declarar una migración correcta únicamente porque:

- TypeScript compila;
- los archivos parecen correctos;
- se actualizaron las versiones;
- no existen errores visibles.

## Estado objetivo

Usar el target definido por `assessment.json`.

Normalmente:

- Node.js 24;
- Azure Functions Runtime v4;
- Programming Model v4;
- dependencias compatibles;
- tests requeridos verdes;
- Functions esperadas registradas;
- ausencia de artefactos legacy activos;
- paquete de despliegue coherente.

No asumir valores target diferentes a los ya evaluados.

## Reutilización de evidencia

Consumir primero los artefactos de `.migration/`.

No volver a reconstruir manualmente todo el contexto de la Function App.

Usar el repositorio únicamente para las verificaciones necesarias.

Si un artefacto previo contradice el estado actual del repositorio:

- registrar la inconsistencia;
- considerar la evidencia actual como candidata a invalidar el artefacto;
- no ocultar la contradicción.

## Orden de verificación

Aplicar las verificaciones en un orden que facilite localizar fallos.

Secuencia recomendada:

1. revisar precondiciones;
2. validar dependencias;
3. typecheck;
4. build;
5. tests;
6. coverage;
7. verificar registro de Functions;
8. verificar Durable Functions;
9. buscar artefactos legacy;
10. inspeccionar paquete de despliegue;
11. consolidar riesgos y deuda técnica;
12. emitir estado final.

No continuar con verificaciones dependientes cuando una precondición necesaria haya fallado, salvo que ejecutarlas
aporte evidencia útil.

## Dependencias

Verificar que las dependencias instaladas corresponden al estado esperado.

Cuando exista lockfile:

preferir instalación reproducible compatible con el package manager existente.

Ejemplo con npm:

`npm ci`

Si no puede utilizarse por una razón válida, registrar qué alternativa se utilizó.

No actualizar dependencias durante este skill.

Un fallo de instalación debe registrarse como evidencia.

## Node.js

Verificar cuando sea posible:

- versión declarada;
- versión utilizada para las validaciones;
- correspondencia con el target.

No considerar suficiente:

`package.json -> engines.node = 24`

si las validaciones se ejecutaron con otro runtime sin dejarlo explícito.

Registrar ambas dimensiones:

- declarada;
- ejecutada.

## Typecheck

Ejecutar la validación TypeScript definida por el proyecto.

Preferir el script existente cuando sea válido.

Ejemplo conceptual:

`npm run typecheck`

Registrar:

- comando;
- resultado;
- errores relevantes.

No modificar código durante esta verificación.

## Build

Ejecutar el build final de la Function App.

Esta es la etapa donde el build global debe utilizarse como gate, ya que las Functions planificadas deberían haber
completado sus adaptaciones.

Registrar:

- comando;
- resultado;
- artefactos generados;
- errores.

Un build verde es necesario cuando el proyecto requiere compilación.

No significa por sí solo que la migración sea correcta.

## Tests

Ejecutar la suite de tests establecida para la aplicación.

Usar los mismos tests que protegieron el comportamiento antes y durante la migración.

Registrar como mínimo:

- comando;
- suites;
- tests ejecutados;
- pass;
- fail;
- skipped cuando corresponda.

Los tests requeridos para la migración deben estar verdes.

No modificar expectativas para hacer pasar una migración incorrecta.

## Coverage

Ejecutar coverage cuando forme parte de la preparación acordada.

Registrar:

- lines;
- statements;
- functions;
- branches;
- thresholds;
- resultado.

Coverage es evidencia complementaria.

No declarar incorrecta una migración únicamente por un porcentaje arbitrario que no forme parte del contrato del
proyecto.

Si existen thresholds configurados, deben respetarse.

## Azure Functions Host

Cuando exista una configuración local sanitizada y aprobada suficiente, iniciar Azure Functions Host para verificar el
registro efectivo de Functions.

El objetivo no es realizar integration testing.

El objetivo es comprobar:

- que el Host inicia;
- que los módulos se cargan;
- que las Functions esperadas se registran;
- que no existen errores de startup relevantes.

No leer automáticamente:

- `local.settings.json`;
- `.env`;
- secretos.

Usar únicamente configuración sanitizada o aprobada.

Si no existe configuración suficiente:

registrar la verificación del Host como:

`NOT_EXECUTED`

con razón explícita.

No inventar settings.

## Inventario esperado vs registrado

Comparar las Functions esperadas antes de la migración con las Functions resultantes.

Usar como referencia:

`inventory.json`

más las decisiones explícitas del migration plan.

Detectar:

- Function desaparecida;
- Function nueva no planificada;
- cambio de nombre;
- cambio de trigger inesperado;
- Durable Activity faltante;
- orchestrator faltante.

La comparación debe considerar cambios expresamente planificados.

No exigir identidad textual de archivos.

Comparar identidad funcional relevante.

## Programming Model

Verificar que las Functions que debían alcanzar Programming Model v4 realmente estén registradas mediante el modelo
objetivo.

Si una Function ya estaba en v4:

confirmar que sigue registrada correctamente.

No exigir que exista un artefacto de `migrate-programming-model-v4` para Functions donde esa migración fue
`NOT_APPLICABLE`.

## Durable Functions

Cuando exista Durable:

verificar como unidad de workflow:

- starter/client;
- orchestrator;
- activities;
- sub-orchestrators cuando existan;
- nombres;
- relaciones relevantes.

Confirmar que el workflow esperado no perdió componentes durante la migración.

No afirmar compatibilidad de replay o instancias activas únicamente mediante tests locales.

Los riesgos operativos previamente identificados deben permanecer visibles.

## Artefactos legacy

Buscar de forma determinista artefactos que no deberían permanecer activos después de la migración.

Ejemplos:

- `function.json` legacy;
- entrypoints legacy;
- configuraciones antiguas;
- imports obsoletos;
- código de adapters reemplazados;
- dependencias legacy que el plan exigía eliminar.

No eliminar nada durante este skill.

Clasificar cada hallazgo:

- `BLOCKING`
- `TECHNICAL_DEBT`
- `EXPECTED`
- `UNKNOWN`

La existencia física de un archivo no implica automáticamente que sea un bloqueo.

Evaluar si sigue activo o afecta runtime/build.

## Archivos sensibles

No leer durante la verificación:

- secretos;
- certificados;
- `.env`;
- `local.settings.json` no aprobado;
- pipelines CI/CD sensibles;
- configuraciones protegidas de infraestructura.

Puede registrarse su existencia cuando sea necesario.

Nunca registrar valores.

## Packaging

Verificar el contenido previsto para deployment.

Comprobar cuando corresponda:

- `dist`;
- `package.json`;
- lockfile;
- runtime dependencies;
- `host.json`;
- archivos requeridos por Azure Functions;
- exclusiones de `.funcignore`.

Detectar artefactos innecesarios como:

- tests;
- coverage;
- `.migration`;
- documentación;
- código fuente cuando deployment usa únicamente `dist`;
- archivos locales.

No modificar `.funcignore` durante este skill.

Si packaging es incorrecto:

registrar el bloqueo.

## Scripts multiplataforma

Revisar únicamente scripts relevantes para:

- build;
- test;
- package;
- start;
- verification.

Registrar problemas evidentes de portabilidad cuando afecten la capacidad de validar o desplegar.

No realizar refactor de scripts durante verificación.

## Compatibilidad Node.js 24

Consolidar las conclusiones de:

- assessment;
- análisis por Function;
- dependencias;
- ejecución real bajo Node.js 24 cuando esté disponible.

No afirmar compatibilidad total únicamente por inferencia.

Si todas las verificaciones relevantes se ejecutaron bajo Node.js 24 y pasaron, registrar esa evidencia.

Los unknowns previamente identificados deben permanecer visibles si no fueron resueltos.

## Evidencia oficial

No es necesario volver a consultar documentación oficial para hechos ya confirmados y registrados, salvo que:

- la evidencia esté ausente;
- exista contradicción;
- la afirmación pueda haber cambiado;
- se necesite cerrar un unknown.

No duplicar referencias innecesariamente.

## Deuda técnica final

Consolidar la deuda técnica identificada durante la migración que no bloquea el target.

Ejemplos:

- duplicación;
- estructura mejorable;
- dependencias antiguas compatibles;
- abstracciones inconsistentes;
- falta de optimización;
- observabilidad mejorable;
- refactors no necesarios para migración.

No resolverla.

Separar claramente:

`migration blockers`

de:

`technical debt`

y:

`optimization opportunities`.

## Optimizaciones

Registrar únicamente las oportunidades ya observadas que sean útiles para trabajo futuro.

No ejecutarlas.

No convertirlas en condición de cierre.

## Estado de cada verificación

Usar estados simples:

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

Cada `FAIL` debe indicar:

- qué falló;
- evidencia;
- impacto;
- si bloquea cierre.

## Estado final

La Function App debe quedar en uno de estos estados:

- `VERIFIED`
- `VERIFIED_WITH_DEBT`
- `BLOCKED`
- `REQUIRES_REVIEW`

### VERIFIED

Todas las verificaciones obligatorias pasaron y no existe deuda técnica relevante pendiente de registrar.

### VERIFIED_WITH_DEBT

Todas las condiciones de migración obligatorias pasaron, pero existe deuda técnica no bloqueante documentada.

Este puede ser un resultado completamente válido.

### BLOCKED

Una o más verificaciones obligatorias fallaron.

### REQUIRES_REVIEW

No existe evidencia suficiente para declarar éxito o bloqueo definitivo.

## Salidas

Crear:

`.migration/verification/verification.json`

`.migration/verification/verification.md`

Y:

`.migration/lessons/verify-function-app/lessons.json`

`.migration/lessons/verify-function-app/lessons.md`

## verification.json

Debe contener como mínimo:

- metadata;
- target;
- runtime utilizado;
- verificaciones ejecutadas;
- instalación de dependencias;
- typecheck;
- build;
- tests;
- coverage;
- Azure Functions Host;
- Functions esperadas;
- Functions detectadas;
- Durable verification;
- legacy scan;
- packaging;
- blockers;
- risks;
- unknowns;
- technical debt;
- optimization opportunities;
- final status;
- evidencia.

No incluir secretos.

## verification.md

Debe permitir al desarrollador responder rápidamente:

- ¿la migración terminó correctamente?;
- ¿qué verificaciones pasaron?;
- ¿qué no pudo ejecutarse?;
- ¿las Functions esperadas siguen presentes?;
- ¿quedó algo legacy activo?;
- ¿qué bloqueos existen?;
- ¿qué deuda técnica queda?;
- ¿qué optimizaciones quedan fuera de alcance?;
- ¿qué revisión manual sigue siendo necesaria?

Debe ser breve.

No debe ser un dump de comandos ni del JSON.

## Lecciones aprendidas

Registrar únicamente observaciones útiles para mejorar futuras verificaciones:

- verificación insuficiente;
- falso positivo;
- falso negativo;
- Function no detectada;
- artefacto legacy no contemplado;
- fallo de packaging;
- validación redundante;
- dependencia de configuración local;
- contexto innecesario;
- oportunidad de automatizar una comprobación;
- oportunidad de simplificar el skill.

No modificar automáticamente este skill.

Toda mejora requiere revisión humana.

## Criterio de cierre

El skill termina cuando:

- se consumieron los artefactos de migración relevantes;
- se validaron las precondiciones;
- se ejecutó instalación reproducible cuando correspondía;
- se ejecutó typecheck;
- se ejecutó build final;
- se ejecutaron los tests requeridos;
- se verificó coverage cuando aplicaba;
- se verificó el registro de Functions cuando fue posible;
- se verificaron workflows Durable cuando correspondía;
- se ejecutó el scan de artefactos legacy;
- se verificó packaging;
- se consolidaron blockers, risks y unknowns;
- se documentó deuda técnica restante;
- las optimizaciones permanecieron fuera de alcance;
- no se modificó comportamiento;
- no se leyeron secretos;
- se generaron verification y lessons;
- se emitió un estado final.

## Fuera de alcance

Este skill no debe:

- corregir código;
- modificar tests;
- actualizar dependencias;
- refactorizar;
- migrar Functions;
- eliminar artefactos legacy;
- cambiar `.funcignore`;
- modificar pipelines;
- aplicar optimizaciones;
- desplegar;
- declarar compatibilidad productiva de instancias Durable activas sin evidencia.

Si el resultado es `BLOCKED`, volver al skill responsable del fallo.

Si el resultado es `VERIFIED` o `VERIFIED_WITH_DEBT`, la migración técnica puede considerarse cerrada.
