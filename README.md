# Financial Reports Functions

Azure Functions App en Node.js/TypeScript para solicitar, generar, almacenar y completar reportes financieros.

El proyecto usa Azure Functions Runtime v4, Programming Model v4 y Node.js 24. La estructura separa composition roots de Azure, casos de uso, dominio e infraestructura para facilitar pruebas y mantener el comportamiento observable.

## Requisitos

- Node.js 24.
- Azure Functions Core Tools compatible con Runtime v4.
- npm.
- Recursos locales o remotos para Cosmos DB, Service Bus y Blob Storage cuando se ejecute la Function App.

## Instalacion

```bash
npm install
```

## Scripts

```bash
npm run typecheck
npm run build
npm run build:dev
npm run build:prod
npm test
npm run test:coverage
npm run test:ci
npm start
```

`npm start` compila en modo desarrollo y ejecuta `func start`.

## Functions

- `RequestReport`: HTTP POST `reports`; registra una solicitud de reporte.
- `StartGenerateReport`: Service Bus Queue; inicia la orquestacion Durable.
- `ReportOrchestrator`: orquestador Durable para el flujo de generacion.
- `GetCustomers`, `GetOrders`, `GetPayments`: actividades Durable para obtener datos del reporte.
- `MarkReportProcessing`: actividad Durable para marcar el reporte en proceso.
- `GenerateExcel`: actividad Durable para generar y almacenar el archivo Excel.
- `CompleteGeneration`: actividad Durable para completar la generacion.
- `MarkReportFailed`: actividad Durable para registrar fallos de generacion.
- `CompleteReport`: Service Bus Queue; completa un reporte generado a partir del evento publicado.
- `OutboxDispatcher`: Cosmos DB trigger; publica eventos pendientes desde outbox.
- `OutboxRetry`: Timer trigger; reintenta eventos pendientes.

## Estructura

```text
src/
├── functions/                 # Registros Programming Model v4
├── RequestReport/             # Capability de solicitud
├── GenerateReport/            # Capability de generacion
├── CompleteReport/            # Capability de completado
├── OutboxDispatcher/          # Capability de publicacion/reintento de eventos
├── ReportOrchestrator/        # Workflow Durable
├── Report/                    # Tipos y reglas compartidas de reporte
└── shared/infrastructure/     # Clientes y configuracion Azure compartida
```

Las carpetas de capability siguen, cuando aplica, esta organizacion:

```text
application/
domain/
infrastructure/
handler.ts
```

## Configuracion

La ejecucion local requiere `local.settings.json` o variables de entorno equivalentes. No registres secretos en documentacion ni commits.

Settings usados por la aplicacion:

```text
COSMOS_ENDPOINT
COSMOS_KEY
COSMOS_DATABASE
COSMOS_REPORTS_CONTAINER
COSMOS_ORDERS_CONTAINER
COSMOS_PAYMENTS_CONTAINER
COSMOS_CUSTOMERS_CONTAINER

SERVICE_BUS_CONNECTION
SERVICE_BUS_REPORT_REQUESTS_QUEUE
SERVICE_BUS_REPORT_GENERATED_QUEUE

STORAGE_CONNECTION
STORAGE_REPORTS_CONTAINER
```

## Calidad

La configuracion de Jest y Sonar excluye composition roots, contratos e interfaces sin comportamiento runtime. La cobertura se enfoca en dominio, casos de uso, handlers con comportamiento e infraestructura con logica propia.

Antes de entregar cambios, ejecuta al menos:

```bash
npm run typecheck
npm run test:ci
npm run build:prod
```
