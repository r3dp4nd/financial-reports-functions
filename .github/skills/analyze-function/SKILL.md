---
name: analyze-function
description: Analiza una Function concreta dentro de una Azure Function App para comprender su comportamiento actual, dependencias, relaciones, testabilidad, compatibilidad potencial con Node.js 24 y cambios mínimos necesarios antes de migrarla o refactorizarla.
---

# Analyze Function

## Objetivo

Comprender una Function concreta y el slice de código que necesita para ejecutar su comportamiento actual.

El análisis debe producir suficiente evidencia para:

- preservar comportamiento;
- identificar riesgos de migración;
- determinar testabilidad;
- proponer tests;
- identificar refactor mínimo;
- evaluar compatibilidad potencial con Node.js 24;
- preparar posteriormente su plan de migración.

Este skill no modifica código.

## Precondiciones

Deben existir:

`.migration/repository/inventory.json`

y:

`.migration/repository/assessment.json`

generados y revisados previamente.

La Function objetivo debe existir en el inventario.

Si la Function no puede identificarse con suficiente evidencia:

- registrar `UNKNOWN`;
- no inventar relaciones;
- no continuar con conclusiones específicas de esa Function.

## Entrada principal

Recibir una Function objetivo.

Ejemplo conceptual:

`RequestReport`

Analizar una sola Function o unidad funcional coherente por ejecución.

Para Durable Functions, no tratar un orchestrator complejo como si fuera una Function completamente aislada cuando su
comportamiento dependa del workflow.

## Principio de análisis

Analizar únicamente el slice necesario para comprender la Function.

El slice puede incluir:

- entrypoint;
- handler;
- servicios llamados;
- dominio relacionado;
- repositorios;
- clientes externos;
- DTOs;
- mappers;
- configuración;
- contratos;
- utilidades directamente utilizadas;
- tests existentes;
- Functions relacionadas cuando sean necesarias para comprender el comportamiento.

No cargar toda la Function App por defecto.

## Reutilización de evidencia

Consumir primero:

- `inventory.json`;
- `assessment.json`.

No volver a descubrir:

- versión de Node.js;
- Programming Model;
- dependencias globales;
- Functions existentes;
- claves `process.env`;
- presencia global de Durable Functions;

salvo que aparezca evidencia contradictoria.

Si se detecta una inconsistencia, registrarla.

## Comportamiento actual

Describir qué hace actualmente la Function utilizando evidencia del repositorio.

Identificar cuando corresponda:

- trigger;
- entrada;
- validaciones;
- decisiones principales;
- servicios o componentes utilizados;
- persistencia;
- llamadas externas;
- mensajes publicados;
- efectos secundarios;
- salida;
- manejo de errores.

No inferir comportamiento de negocio únicamente por nombres de archivos o clases.

Clasificar conclusiones como:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

## Dependencias de la Function

Identificar las dependencias directamente relevantes.

Clasificarlas cuando corresponda en:

- código interno;
- Azure SDK;
- base de datos;
- mensajería;
- almacenamiento;
- HTTP;
- configuración;
- librerías de terceros;
- runtime Node.js.

Registrar únicamente dependencias utilizadas por el slice analizado.

No repetir todo `package.json`.

## Configuración

Usar el inventario de configuración existente.

Para la Function objetivo, determinar qué claves de configuración utiliza.

Registrar solamente:

- nombre de clave;
- lugar de uso;
- propósito observable cuando pueda confirmarse.

Nunca leer ni registrar valores.

## Relaciones

Identificar relaciones relevantes con otras Functions o componentes.

Ejemplos:

- inicia un orchestrator;
- publica un mensaje;
- consume mensajes producidos por otra Function;
- comparte persistencia;
- invoca una Activity;
- participa en un workflow Durable.

Una relación debe ser `CONFIRMED` cuando exista evidencia directa.

Si solo existe evidencia parcial:

`INFERRED`

No construir relaciones solo por similitud de nombres.

## Testabilidad

Evaluar la capacidad actual de probar el comportamiento mediante unit tests o characterization tests.

Buscar señales como:

- lógica mezclada con el entrypoint de Azure;
- uso directo de `context`;
- uso directo de `process.env`;
- construcción directa de clientes Azure SDK;
- llamadas estáticas difíciles de sustituir;
- lógica de negocio mezclada con infraestructura;
- efectos secundarios dentro del handler;
- dependencias globales;
- ausencia de límites claros;
- funciones puras reutilizables;
- dependencias ya inyectables.

Clasificar la testabilidad:

- `HIGH`
- `MEDIUM`
- `LOW`

La clasificación debe estar acompañada de razones.

## Tests existentes

Identificar únicamente los tests relacionados con el slice.

Registrar:

- framework;
- archivos relevantes;
- comportamiento cubierto observable;
- gaps evidentes.

No asumir cobertura solamente porque exista un archivo de test.

No ejecutar todavía refactor.

## Tests propuestos

Proponer el conjunto mínimo de tests necesario para proteger el comportamiento actual antes de migrarlo.

Priorizar:

1. comportamiento principal;
2. validaciones relevantes;
3. decisiones de negocio;
4. errores importantes;
5. interacciones externas significativas.

Distinguir cuando corresponda:

- characterization test;
- unit test;
- contract test.

No proponer integration tests en esta etapa.

No diseñar tests para comportamiento nuevo.

## Refactor mínimo requerido

Determinar si la Function necesita cambios antes de poder proteger adecuadamente su comportamiento con tests.

Clasificar:

- `NONE`
- `MINIMAL`
- `SIGNIFICANT`

Ejemplos de refactor mínimo:

- extraer lógica del entrypoint;
- encapsular acceso a `process.env`;
- extraer creación de cliente SDK;
- introducir una dependencia sustituible;
- separar transformación de datos;
- mover lógica de negocio fuera del adapter Azure.

No proponer Clean Architecture completa por defecto.

Aplicar capas o puertos únicamente cuando resuelvan un problema observado de:

- acoplamiento;
- testabilidad;
- mantenimiento;
- aislamiento de infraestructura.

## Compatibilidad con Node.js 24

Analizar únicamente el código del slice relevante.

Buscar posibles riesgos relacionados con:

- APIs Node.js utilizadas;
- módulos;
- comportamiento del runtime;
- sintaxis;
- paquetes utilizados directamente;
- APIs eliminadas o deprecadas;
- diferencias relevantes entre la versión actual y Node.js 24.

Las conclusiones de compatibilidad deben apoyarse en documentación oficial vigente cuando exista una afirmación técnica
externa.

Clasificar cada hallazgo como:

- `CONFIRMED_COMPATIBLE`
- `CHANGE_REQUIRED`
- `REQUIRES_VALIDATION`
- `NOT_APPLICABLE`

No asumir compatibilidad porque TypeScript compile.

No asumir incompatibilidad solamente por antigüedad del código.

## Programming Model

Usar el estado identificado previamente.

Si la Function ya utiliza Programming Model v4:

- registrar que esa dimensión ya está satisfecha;
- no proponer migrarla nuevamente.

Si utiliza un modelo legacy:

- identificar únicamente los puntos de acoplamiento que posteriormente deberá transformar
  `migrate-programming-model-v4`.

No realizar esa transformación todavía.

## Durable Functions

Si la Function no pertenece a Durable Functions:

`NOT_APPLICABLE`

Si pertenece a un workflow Durable:

identificar su rol:

- starter;
- orchestrator;
- activity;
- client;
- otro rol confirmado.

Para un orchestrator, revisar además restricciones relevantes de determinismo cuando corresponda.

No migrar todavía el workflow.

No analizar Activities desconectadas del workflow cuando su significado dependa del orchestrator.

## Deuda técnica

Registrar únicamente deuda técnica observada durante el análisis y relevante para la migración.

Ejemplos:

- acoplamiento excesivo;
- duplicación;
- cliente SDK global;
- configuración dispersa;
- handler demasiado grande;
- contratos débiles;
- nombres confusos;
- código muerto evidente.

Clasificarla como:

`TECHNICAL_DEBT`

No resolverla automáticamente salvo que posteriormente sea necesaria para:

- testabilidad;
- compatibilidad;
- migración.

No registrar optimizaciones como requisito de migración.

## Categoría de cambios

Clasificar los posibles cambios identificados como:

- `REQUIRED_PLATFORM`
- `REQUIRED_NODE`
- `REQUIRED_TESTABILITY`
- `STRUCTURAL`
- `TECHNICAL_DEBT`
- `OPTIMIZATION`

`OPTIMIZATION` debe quedar fuera de alcance de la migración.

## Evidencia

Cada conclusión importante debe apuntar a evidencia mínima del repositorio.

Ejemplo conceptual:

    {
      "finding": "El handler crea directamente CosmosClient.",
      "status": "CONFIRMED",
      "evidence": [
        {
          "path": "src/RequestReport/index.ts",
          "finding": "new CosmosClient(...) dentro del handler"
        }
      ]
    }

No almacenar código completo cuando una referencia breve sea suficiente.

## Salidas

Crear:

`.migration/functions/<FunctionName>/analysis.json`

`.migration/functions/<FunctionName>/analysis.md`

`.migration/lessons/analyze-function/<FunctionName>.json`

`.migration/lessons/analyze-function/<FunctionName>.md`

Crear únicamente las carpetas necesarias.

## analysis.json

Debe contener como mínimo:

- metadata;
- Function analizada;
- comportamiento actual;
- trigger;
- dependencias relevantes;
- configuración utilizada;
- relaciones;
- testabilidad;
- tests existentes;
- tests propuestos;
- compatibilidad Node.js 24;
- estado de Programming Model;
- Durable role cuando aplique;
- refactor mínimo requerido;
- cambios requeridos;
- deuda técnica;
- riesgos;
- unknowns;
- evidencia.

No incluir secretos.

## analysis.md

Debe permitir al desarrollador responder rápidamente:

- qué hace esta Function;
- de qué depende;
- qué comportamiento debemos preservar;
- qué tan testeable es;
- qué tests necesitamos;
- qué refactor mínimo sería necesario;
- qué riesgos existen con Node.js 24;
- si necesita migración de Programming Model;
- qué deuda técnica queda fuera de la migración.

No debe ser una copia textual del JSON.

## Lecciones aprendidas

Registrar observaciones útiles para mejorar futuras ejecuciones del skill.

Por ejemplo:

- slice demasiado amplio;
- dependencia no contemplada;
- patrón recurrente;
- falso supuesto;
- dificultad para identificar comportamiento;
- señal de testabilidad útil;
- caso Durable no contemplado;
- análisis que podría automatizarse;
- contexto leído innecesariamente;
- oportunidad de simplificar el skill.

No modificar automáticamente este skill.

Toda mejora requiere revisión humana.

## Criterio de cierre

El skill termina cuando:

- la Function objetivo fue identificada;
- se analizó únicamente el slice necesario;
- el comportamiento actual fue documentado;
- las dependencias relevantes fueron identificadas;
- la configuración utilizada fue registrada sin valores;
- las relaciones relevantes fueron documentadas;
- la testabilidad fue evaluada;
- los tests mínimos necesarios fueron propuestos;
- el refactor mínimo necesario fue identificado;
- la compatibilidad potencial con Node.js 24 fue evaluada;
- el estado del Programming Model fue considerado;
- Durable Functions fue considerado cuando corresponda;
- la deuda técnica relevante fue registrada sin convertirla automáticamente en trabajo de migración;
- hechos, inferencias y unknowns están diferenciados;
- se generaron analysis y lessons.

## Fuera de alcance

Este skill no debe:

- modificar código;
- agregar tests;
- actualizar dependencias;
- cambiar Node.js;
- migrar Azure Functions Runtime;
- migrar Programming Model;
- migrar Durable Functions;
- aplicar refactor;
- implementar arquitectura nueva;
- resolver deuda técnica no bloqueante;
- optimizar código.

El siguiente skill sugerido es:

`plan-function-migration`
