# Language Policy

## Objetivo

Asegurar que toda narrativa generada por los skills sea legible de forma fluida para una audiencia hispanohablante de
desarrollo y QA, sin anglicismos evitables que obliguen a traducir mentalmente mientras se lee.

## Regla principal

Todo el texto narrativo (prosa, encabezados, celdas de tabla que describen algo, rationale, hallazgos, riesgos,
narrativa funcional/técnica) debe escribirse en español natural.

Se exceptúan únicamente:

- nombres propios de producto o tecnología (`Node.js`, `Azure Functions`, `Cosmos DB`, `Service Bus`, `TypeScript`,
  `Durable Functions`, `Graphify`);
- identificadores de código (nombres de Functions, archivos, rutas, clases, métodos, variables, por ejemplo
  `RetryOptions`, `callActivity`, `fs.unlink`, `report.dto.ts`);
- IDs de acciones y artifacts del propio toolkit (`SLICE-01`, `GLOBAL-01`, `FN-02`, `SR-ACTION-COSMOS-01`);
- literales de configuración/binding que son parte del contrato técnico (`serviceBusTrigger`, `activityTrigger`,
  `orchestrationClient`).

No traducir estas excepciones ni forzar un equivalente en español que no exista en la documentación oficial.

## Glosario de traducción obligatoria

Usar siempre el término en español indicado cuando aparezca en narrativa, salvo que el propio término sea el nombre
oficial de una API/método que deba citarse literal:

| Inglés                | Español a usar                              |
|-----------------------|----------------------------------------------|
| root (monorepo)       | raíz (repositorio único)                      |
| Programming Model     | Modelo de Programación                        |
| legacy                | heredado / legado                              |
| entry point           | punto de entrada                               |
| adapters              | adaptadores                                    |
| application (capa)    | aplicación                                     |
| domain (capa)         | dominio                                        |
| infrastructure (capa) | infraestructura                                |
| god file / god-object | archivo monolítico / objeto monolítico         |
| boundary              | límite / frontera de aislamiento               |
| ownership             | responsable asignado / propiedad               |
| tooling               | herramientas                                   |
| coverage              | cobertura (de pruebas)                         |
| placeholder           | marcador de posición                           |
| fire-and-forget       | ejecución sin esperar confirmación             |
| starter (function)    | función de arranque / disparador inicial       |
| handler               | manejador                                      |
| workflow              | flujo de trabajo                               |
| pipeline (genérico)   | flujo / proceso                                |
| batch / batching      | lote / loteo                                   |
| bulk                  | masivo                                         |
| baseline              | línea base                                     |
| lane (columna)        | carril / categoría                             |
| executor (columna)    | responsable de ejecución                       |
| scope                 | alcance                                        |
| unknowns              | incógnitas                                     |
| risks                 | riesgos                                        |
| review                | revisión                                       |
| gap                   | brecha                                         |
| gate                  | punto de control                               |
| triage                | clasificación inicial / cribado                |
| rationale             | justificación                                  |
| evidence              | evidencia                                      |
| shared resource       | recurso compartido                             |
| consumer / consumers  | consumidor / consumidores                      |
| trigger (genérico)    | disparador                                     |

Si aparece un término técnico sin equivalente natural en el uso común de desarrolladores hispanohablantes, dejarlo en
inglés en vez de forzar una traducción forzada o poco usada.

## Verificación antes de guardar

Antes de escribir cualquier artifact `.md` con narrativa, revisar el texto generado contra este glosario y las
excepciones permitidas, y corregir cualquier anglicismo evitable encontrado en prosa antes de entregar el archivo.

Los artifacts `.json` no están sujetos a esta política: son datos estructurados para agentes, no narrativa para
lectura humana.

## No hacer

- traducir nombres de producto/tecnología, identificadores de código o IDs de acciones;
- inventar traducciones no incluidas en el glosario cuando el término no tiene equivalente natural;
- dejar prosa mixta (mitad español, mitad inglés) en la misma oración salvo las excepciones explícitas.
