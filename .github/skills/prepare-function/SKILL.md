---
name: prepare-function
description: Prepara una Function concreta para su migración aplicando únicamente el refactor mínimo necesario para testabilidad y agregando tests que protejan su comportamiento actual antes de modificar runtime o Programming Model.
---

# Prepare Function

## Objetivo

Preparar una Function concreta antes de su migración.

Este skill puede:

- aplicar refactor mínimo;
- aislar dependencias;
- separar lógica de infraestructura;
- agregar characterization tests;
- agregar unit tests;
- dejar una baseline reproducible del comportamiento actual.

No debe migrar todavía el Programming Model ni cambiar comportamiento funcional.

## Precondiciones

Deben existir:

`.migration/functions/<FunctionName>/analysis.json`

y:

`.migration/functions/<FunctionName>/migration-plan.json`

La preparación global requerida por `prepare-function-app` debe haberse realizado cuando corresponda.

El plan de la Function debe indicar qué preparación es necesaria.

## Entrada principal

Recibir una Function objetivo.

Ejemplo:

`RequestReport`

Analizar y modificar únicamente el slice necesario para preparar esa Function.

No refactorizar otras Functions salvo que exista una dependencia compartida explícitamente contemplada en el plan.

## Principio

El objetivo es:

`comportamiento actual → protegible por tests`

No:

`código legacy → arquitectura ideal`

Aplicar únicamente cambios necesarios para:

- aislar comportamiento;
- sustituir dependencias durante tests;
- eliminar acoplamientos que impidan probar;
- permitir una migración posterior más segura.

## Evidencia previa

Consumir primero:

- `inventory.json`;
- `assessment.json`;
- `analysis.json` de la Function;
- `migration-plan.json` de la Function.

No volver a analizar toda la aplicación.

Si aparece evidencia que contradice el análisis previo:

- detener el cambio afectado;
- registrar la inconsistencia;
- actualizar el artefacto correspondiente mediante el skill adecuado cuando sea necesario.

## Comportamiento a preservar

Antes de modificar código, identificar desde `analysis.json`:

- entrada;
- validaciones;
- decisiones;
- efectos secundarios;
- salida;
- errores relevantes;
- interacciones externas.

Los tests agregados deben proteger este comportamiento.

No utilizar los tests para introducir comportamiento nuevo.

## Refactor mínimo

Aplicar el nivel previamente clasificado:

- `NONE`
- `MINIMAL`
- `SIGNIFICANT`

Si es `NONE`, no refactorizar por preferencia estilística.

Si es `MINIMAL`, aplicar únicamente las extracciones necesarias.

Ejemplos válidos:

- extraer lógica del handler;
- aislar lectura de `process.env`;
- extraer creación de clientes Azure SDK;
- introducir parámetros o factories sustituibles;
- separar mapping o validación;
- mover lógica de negocio fuera del adapter Azure.

Si el análisis indica `SIGNIFICANT`, limitarse al alcance aprobado por el plan.

No expandir automáticamente el trabajo.

## Entry points

Cuando la Function tenga lógica mezclada con el entrypoint Azure, reducir progresivamente esa responsabilidad.

El entrypoint debería tender a:

1. recibir input del runtime;
2. adaptar datos;
3. invocar comportamiento;
4. transformar respuesta.

No exigir este patrón cuando la Function ya sea suficientemente simple y testeable.

## process.env

No leer valores durante el análisis del skill.

Si el código productivo utiliza directamente `process.env` y esto impide tests deterministas, aislar el acceso cuando
esté aprobado.

Ejemplo conceptual:

`process.env.COSMOS_DATABASE`

puede convertirse en una dependencia de configuración controlable.

No mover claves de configuración sin necesidad.

No cambiar nombres de variables.

## Azure SDK

Cuando una Function construya directamente clientes como:

- `CosmosClient`;
- `ServiceBusClient`;
- `BlobServiceClient`;
- otros clientes externos;

y esto impida unit tests, aislar la creación o dependencia.

Preferir la solución más pequeña posible.

No introducir automáticamente:

- contenedores DI;
- frameworks IoC;
- service locator;
- factories genéricas.

Una interface o función sustituible puede ser suficiente.

## Arquitectura

Aplicar Clean Architecture o separación por capas únicamente cuando exista un problema observado de:

- testabilidad;
- acoplamiento;
- mantenibilidad;
- dependencia directa de infraestructura.

Para una Function sencilla puede ser suficiente:

`handler + service + tests`

No crear capas vacías.

No forzar sufijos como:

`*.port.ts`

cuando nombres de dominio más naturales sean suficientes.

## Tests

Agregar el conjunto mínimo definido por `analysis.json` y el plan.

Priorizar:

1. comportamiento principal;
2. validaciones importantes;
3. decisiones de negocio;
4. errores significativos;
5. interacciones externas relevantes.

Usar Jest cuando sea la configuración definida para la Function App.

No agregar integration tests en esta etapa.

## Characterization tests

Utilizarlos cuando sea necesario proteger comportamiento legacy antes de refactorizar.

Su objetivo es documentar:

`qué hace actualmente`

aunque el diseño existente no sea ideal.

Una vez protegido el comportamiento, puede aplicarse el refactor mínimo.

## Unit tests

Agregar unit tests cuando el código ya pueda aislar comportamiento.

Mockear únicamente límites externos relevantes.

Evitar tests excesivamente acoplados a detalles internos.

Preferir verificar:

- resultado;
- decisión;
- interacción significativa;
- error observable.

## Orden de preparación

Cuando haya refactor necesario para poder testear:

1. identificar comportamiento observable;
2. aplicar extracción mínima segura;
3. agregar tests;
4. ejecutar tests;
5. corregir únicamente diferencias producidas por el refactor;
6. obtener baseline verde.

Cuando el código ya sea testeable:

1. agregar tests;
2. ejecutar;
3. obtener baseline verde.

No realizar todavía migración de plataforma.

## Baseline

La preparación no se considera completa sin evidencia de tests ejecutados cuando estos son parte del plan.

Registrar:

- comando ejecutado;
- cantidad de tests;
- resultado;
- fallos;
- coverage cuando corresponda.

Baseline esperada:

`PASS`

Si los tests revelan comportamiento desconocido:

- no modificar el test para forzarlo a pasar sin análisis;
- registrar la discrepancia;
- revisar evidencia previa.

## Coverage

Usar coverage como señal de protección, no como objetivo aislado.

Cumplir thresholds globales existentes cuando correspondan.

No escribir tests sin valor únicamente para aumentar porcentajes.

No excluir lógica productiva de coverage para hacer pasar thresholds.

## Programming Model

Este skill no migra Programming Model.

Si la Function es legacy:

preservar temporalmente el entrypoint necesario para que continúe funcionando mientras se extrae lógica testeable.

Si ya es v4:

preservar su registro.

No modificar `app.*` salvo que sea estrictamente necesario para el refactor aprobado y no cambie comportamiento.

## Durable Functions

Si la Function pertenece a Durable:

respetar su rol dentro del workflow.

Para Activities:

- aislar comportamiento interno cuando sea necesario;
- agregar unit tests.

Para orchestrators:

- proteger decisiones y secuencia observable;
- no introducir llamadas no deterministas;
- no cambiar estructura del workflow sin que forme parte del plan.

La migración Durable pertenece al skill especializado correspondiente.

## Cambios estructurales

Mover archivos únicamente cuando el plan lo requiera.

Cuando corresponda:

- `src/functions/` para adapters Azure;
- `src/<Capability>/` para implementación funcional;
- tests junto a la capacidad.

No mover archivos solo para cumplir una estructura estética.

## Categorías permitidas

Este skill puede ejecutar cambios clasificados como:

- `REQUIRED_TESTABILITY`
- `STRUCTURAL`

Puede resolver `TECHNICAL_DEBT` únicamente cuando sea imprescindible para testabilidad.

No debe ejecutar:

- `REQUIRED_PLATFORM`
- `REQUIRED_NODE`

salvo ajustes mínimos inevitables previamente autorizados por el plan.

`OPTIMIZATION` está fuera de alcance.

## Verificación

Ejecutar las validaciones relevantes para la Function preparada.

Como mínimo cuando aplique:

- unit tests;
- characterization tests;
- typecheck selectivo o global si el estado de la App lo permite.

No exigir build final de toda la Function App si otras Functions aún están en un estado intermedio incompatible.

## Salidas

Crear:

`.migration/functions/<FunctionName>/preparation.json`

`.migration/functions/<FunctionName>/preparation.md`

Y:

`.migration/lessons/prepare-function/<FunctionName>.json`

`.migration/lessons/prepare-function/<FunctionName>.md`

## preparation.json

Debe registrar como mínimo:

- metadata;
- Function;
- comportamiento protegido;
- archivos modificados;
- refactors aplicados;
- tests agregados;
- validaciones ejecutadas;
- resultados;
- baseline;
- riesgos;
- unknowns;
- deuda técnica restante;
- evidencia de origen.

No incluir secretos.

## preparation.md

Debe explicar brevemente:

- qué se cambió;
- por qué;
- qué comportamiento quedó protegido;
- qué tests fueron agregados;
- qué validaciones pasaron;
- qué quedó pendiente;
- qué deuda técnica se dejó fuera;
- si la Function está lista para migración.

No debe ser un diff completo.

## Lecciones aprendidas

Registrar únicamente observaciones útiles para mejorar futuras ejecuciones:

- refactor mayor de lo esperado;
- dependencia difícil de sustituir;
- characterization test especialmente útil;
- mock innecesariamente complejo;
- patrón reusable;
- sobrearquitectura evitada;
- análisis previo insuficiente;
- comportamiento inesperado descubierto por tests;
- contexto leído innecesariamente;
- oportunidad de simplificar el skill.

No modificar automáticamente este skill.

Toda mejora requiere revisión humana.

## Criterio de cierre

El skill termina cuando:

- se consumieron analysis y migration plan;
- se aplicó únicamente el refactor autorizado;
- el comportamiento actual quedó protegido por tests cuando era requerido;
- la baseline de tests está verde;
- no se cambió comportamiento funcional intencionalmente;
- no se migró Programming Model;
- no se aplicaron optimizaciones;
- no se leyeron secretos;
- se registraron validaciones;
- se generaron preparation y lessons.

La Function debe quedar en uno de estos estados:

- `READY_FOR_MIGRATION`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Fuera de alcance

Este skill no debe:

- migrar Programming Model;
- migrar Azure Functions Runtime;
- migrar Node.js;
- migrar Durable Functions;
- actualizar dependencias globales no planificadas;
- modificar comportamiento de negocio;
- aplicar optimizaciones;
- resolver deuda técnica no bloqueante;
- desplegar.

El siguiente skill sugerido depende del caso:

- `migrate-programming-model-v4`
- `migrate-durable-functions-v4`
- `verify-function-app`
