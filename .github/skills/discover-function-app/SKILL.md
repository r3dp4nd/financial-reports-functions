---
name: discover-function-app
description: Descubre de forma segura Azure Function Apps Node.js dentro de un repositorio antes de migrarlas. Inventaría estructura, Functions, triggers, bindings, configuración, dependencias, Programming Model, Durable Functions, arquitectura observable y candidatos a recursos compartidos sin modificar código ni leer contenido protegido.
---

# Discover Function App

## Objetivo

Construir una fotografía segura, reproducible y reutilizable del estado actual del repositorio antes de modificar
código.

Debe producir:

- inventario estructurado;
- catálogo humano BEFORE;
- candidatos a recursos compartidos cuando exista evidencia suficiente.

Discovery registra hechos observables.

No evalúa todavía qué cambios requiere el target.

## Políticas

Aplicar siempre:

- `../_shared/security-policy.md`
- `../_shared/evidence-policy.md`
- `../_shared/status-policy.md`

Aplicar cuando corresponda:

- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`

`architecture-policy.md` puede utilizarse únicamente como vocabulario para describir límites observables.

No utilizarla para evaluar convergencia hacia una arquitectura target.

Este skill no refactoriza.

## Entradas

Requerida:

- raíz del repositorio objetivo.

Opcionales:

- artefactos existentes en `.migration/` únicamente para detectar ejecución previa, preservar trazabilidad o determinar
  si corresponde rediscovery.

Los artefactos previos no sustituyen la observación actual cuando discovery deba volver a ejecutarse.

## Principio

Preferir descubrimiento determinista antes que razonamiento.

No usar IA para repetir hechos obtenibles mediante el script interno.

Usar progressive disclosure:

```text
security exclusions
→ deterministic inventory
→ selective source inspection
```

No realizar un análisis amplio del repositorio cuando el inventario ya sea suficiente.

## Seguridad previa

Aplicar `security-policy.md` antes de cualquier lectura.

La detección de archivos protegidos debe realizarse por ruta, nombre, extensión o patrón antes de cargar contenido.

Los archivos protegidos pueden registrarse mediante metadata segura como:

- ruta;
- categoría;
- `contentRead = false`.

Nunca leerlos para decidir posteriormente si debían excluirse.

## Exclusiones operativas

No inspeccionar como source de aplicación:

- `.git/**`;
- `.idea/**`;
- `.vscode/**`;
- `.migration/**`;
- `.skill-improvement/**`;
- `node_modules/**`;
- `dist/**`;
- `coverage/**`;
- `test-results/**`.

`.github/skills/**` pertenece al toolkit y no debe analizarse como source de la Function App.

El contenido CI/CD protegido debe detectarse y excluirse conforme a `security-policy.md`.

## Script de inventario

Ejecutar después de aplicar las exclusiones de seguridad:

`scripts/inventory.js`

Invocarlo directamente con Node.js cuando sea posible para mantener estable el contrato de salida.

Ejemplo conceptual:

```text
node .github/skills/discover-function-app/scripts/inventory.js <repository-root>
```

Contrato:

```text
stdout
→ JSON puro del inventario

stderr
→ diagnósticos seguros

exit code != 0
→ fallo de ejecución
```

No mezclar salida de package managers u otros wrappers con el JSON.

Los scripts internos deben ser compatibles con Node.js 14 o superior.

## Fuente primaria

Usar la salida de `inventory.js` como fuente primaria para:

- Function Apps;
- `package.json`;
- `host.json`;
- Functions v3;
- Functions v4;
- triggers;
- bindings;
- Durable Functions;
- `dependencies`;
- `devDependencies`;
- Node.js declarado;
- claves `process.env`;
- archivos protegidos detectados sin lectura.

No volver a calcular mediante IA hechos ya obtenidos de forma determinista.

## Múltiples Function Apps

El repositorio puede contener una o varias Function Apps.

Inventariar cada Function App como unidad independiente cuando corresponda.

Cada una puede tener:

- versión Node distinta;
- dependencias propias;
- Programming Model distinto;
- Functions propias;
- configuración y build propios.

No asumir que el primer `host.json` encontrado representa todo el repositorio.

El catálogo humano debe distinguir las Function Apps cuando exista más de una.

## Análisis selectivo

A partir del inventario determinista, leer únicamente source permitido cuando sea necesario para complementar hechos
como:

- relaciones relevantes entre Functions;
- capabilities observables;
- workflows Durable;
- límites estructurales actuales;
- patrones observables;
- infraestructura potencialmente compartida;
- candidatos a recursos compartidos.

No construir un call graph completo.

No recorrer transitivamente toda la lógica funcional durante discovery.

El análisis profundo por slice pertenece a:

`analyze-function`

No evaluar todavía el cambio requerido hacia el target.

## Arquitectura actual

Registrar únicamente lo observable:

- organización del source;
- ubicación de entrypoints;
- mezcla o separación entre runtime, lógica e infraestructura;
- contracts existentes;
- repositories;
- services;
- dependencias compartidas observables.

No diseñar arquitectura futura.

No clasificar un módulo como monolito únicamente por tamaño, nombre o ubicación.

## Patrones

Registrar patrones únicamente cuando exista evidencia.

Ejemplos:

- Durable Workflow;
- Repository;
- Outbox;
- Adapter;
- Service;
- Factory;
- direct SDK usage.

No inferir un patrón únicamente por naming.

Cuando la evidencia sea parcial utilizar:

`evidenceStatus: INFERRED`

## Dependencias

Inventariar todas las dependencias declaradas en:

- `dependencies`;
- `devDependencies`.

Identificar como Azure ecosystem cuando corresponda:

- `@azure/*`;
- packages Azure adicionales reconocidos por el toolkit, como `durable-functions`.

Discovery no determina si una dependencia debe actualizarse.

No seleccionar versiones target.

No eliminar ni ignorar dependencias desconocidas.

## Recursos compartidos candidatos

Detectar candidatos utilizados por múltiples Functions, capabilities o workflows cuando exista evidencia suficiente.

Ejemplos:

- Cosmos DB;
- MongoDB;
- SQL;
- Service Bus;
- Blob Storage;
- HTTP clients;
- repositories;
- configuración;
- servicios comunes.

Registrar cuando sea posible:

- id candidato;
- type;
- paths;
- consumers observados;
- configuration keys;
- ownership observable;
- `evidenceStatus`;
- evidence.

Scopes iniciales:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

En esta etapa siguen siendo candidatos.

Un identificador asignado durante discovery no implica consolidación definitiva del recurso.

No consolidar ownership ni consumidores cuando la evidencia requiera análisis por Function.

No fusionar recursos únicamente porque utilicen:

- el mismo SDK;
- la misma tecnología;
- el mismo tipo de servicio.

## Evidence status

Para candidatos y hallazgos que necesiten expresar certeza usar:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

mediante:

`evidenceStatus`

Ejemplo:

    {
      "id": "SR-COSMOS-REPORTS",
      "type": "COSMOS_DB",
      "evidenceStatus": "INFERRED"
    }

No utilizar:

`status: CONFIRMED`

para representar evidencia.

No convertir una inferencia en un hecho durante discovery.

## Configuración

Puede analizarse source permitido para detectar referencias como:

`process.env.COSMOS_DATABASE`

Registrar únicamente:

- nombre de la clave;
- ubicación de uso.

Nunca registrar valores.

Detectar una clave no autoriza resolver su valor desde archivos protegidos.

## Programming Model

Clasificar cuando exista evidencia como:

- `V3`;
- `V4`;
- `MIXED`;
- `UNKNOWN`.

Usar evidencia de registro o bindings cuando esté disponible.

La versión declarada de `@azure/functions` puede apoyar una inferencia, pero no debe utilizarse por sí sola como prueba
definitiva del Programming Model efectivo.

No asumir que toda Function App requiere migración de Programming Model.

## Azure Functions Runtime

Registrar únicamente evidencia observable permitida.

No inferir automáticamente el Runtime desplegado a partir de configuración local insuficiente.

Cuando no exista evidencia suficiente:

`UNKNOWN`

La evaluación contra Runtime v4 pertenece a:

`assess-function-app`

## Durable

Identificar cuando exista evidencia:

- client;
- starter;
- orchestrator;
- activity;
- sub-orchestrator;
- entity.

Registrar relaciones observables necesarias para identificar el workflow.

No analizar todavía el workflow en profundidad.

La unidad coherente de migración Durable se determina posteriormente.

## Salida estructurada

Crear:

`.migration/repository/inventory.json`

`inventory.json` es el owner de los hechos estructurados producidos durante discovery.

Debe contener cuando corresponda:

- repository;
- Function Apps;
- platform observable;
- dependencies;
- Functions;
- triggers;
- bindings;
- configuration keys;
- relationships observables;
- architecture observations;
- patterns;
- shared resource candidates;
- protected files detected;
- warnings;
- unknowns;
- evidence.

No incluir:

- recomendaciones;
- acciones de migración;
- architecture target;
- refactors;
- migration plan;
- dependency targets seleccionados durante discovery.

## Catálogo BEFORE

Crear:

`.migration/catalog/current-state.md`

Usar:

`../_shared/templates/current-state.template.md`

Este es el único documento Markdown humano obligatorio generado por discovery.

No generar:

`.migration/repository/inventory.md`

El catálogo debe representar exclusivamente el estado anterior a la migración.

Si contiene varias Function Apps, representarlas de forma diferenciada.

No convertirlo posteriormente en documentación del target.

Si ya existe un BEFORE histórico y el repositorio fue modificado posteriormente por el flujo, no sobrescribirlo
silenciosamente para representar el nuevo estado.

Registrar la inconsistencia o necesidad de rediscovery conforme a `evidence-policy.md`.

## Lecciones

Aplicar:

`../_shared/lessons-policy.md`

Registrar lessons únicamente cuando exista aprendizaje relevante.

Cuando corresponda pueden utilizarse:

```text
.migration/lessons/discover-function-app/lessons.json
.migration/lessons/discover-function-app/lessons.md
```

No crear artifacts de lessons vacíos únicamente para satisfacer el cierre del skill.

## Criterio de cierre

El skill termina cuando:

- las exclusiones de seguridad fueron aplicadas antes de leer contenido;
- `inventory.js` fue ejecutado correctamente;
- las Function Apps fueron identificadas;
- las Functions fueron inventariadas;
- `dependencies` y `devDependencies` fueron registradas;
- configuración observable fue registrada sin valores;
- Programming Model quedó identificado o `UNKNOWN`;
- Durable quedó identificado cuando corresponda;
- arquitectura y patrones observables necesarios quedaron registrados;
- candidatos a recursos compartidos quedaron registrados cuando exista evidencia;
- archivos protegidos detectados conservan `contentRead = false`;
- se creó `inventory.json`;
- se creó `current-state.md`;
- no se generó `inventory.md`;
- no se realizaron assessment, planning o modificaciones de código.

La ausencia de lessons no impide cerrar discovery.

## Fuera de alcance

No debe:

- modificar código;
- refactorizar;
- actualizar dependencias;
- agregar pruebas;
- evaluar detalladamente compatibilidad con Node.js 24;
- decidir dependency targets;
- consolidar definitivamente shared resources;
- migrar Runtime;
- migrar Programming Model;
- migrar Durable;
- realizar análisis funcional profundo;
- modernizar;
- optimizar;
- generar acciones;
- generar planes.

Siguiente skill sugerido:

`assess-function-app`
