# Architecture Examples

Ejemplos mínimos para aterrizar la arquitectura objetivo.

Usar estos snippets como patrón de intención, no como plantilla obligatoria. Elegir la variante más pequeña que preserve comportamiento y mejore testabilidad real del slice.

## Folder variants

### Simple handler

```text
src/
├── functions/
│   └── request-report.function.ts
└── RequestReport/
    ├── handler.ts
    └── handler.spec.ts
```

Usar cuando la Function solo necesita separar runtime Azure de traducción/validación básica.

### Handler + application

```text
src/
├── functions/
│   └── request-report.function.ts
└── RequestReport/
    ├── handler.ts
    ├── handler.spec.ts
    └── application/
        ├── request-report.command.ts
        ├── request-report.result.ts
        ├── request-report.use-case.ts
        └── request-report.use-case.spec.ts
```

Usar cuando hay una intención funcional testeable, coordinación de dependencias o reglas de aplicación.

### Handler + application + domain + infrastructure

```text
src/
├── functions/
│   └── request-report.function.ts
└── RequestReport/
    ├── handler.ts
    ├── application/
    ├── domain/
    └── infrastructure/
        └── persistence/
```

Usar cuando hay invariantes/domain behavior y boundaries reales hacia SDKs, storage, messaging, persistence o HTTP externo.

## Thin composition root

```ts
import {app} from "@azure/functions";
import {createRequestReportHandler} from "../RequestReport/handler";
import {RequestReportUseCase} from "../RequestReport/application/request-report.use-case";
import {CosmosReportRepository} from "../RequestReport/infrastructure/persistence/cosmos-report.repository";
import {reportsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";

const repository = new CosmosReportRepository(reportsContainer);
const useCase = new RequestReportUseCase(repository);
const handler = createRequestReportHandler({
  useCase,
  now: () => new Date().toISOString()
});

app.http("RequestReport", {
  methods: ["POST"],
  route: "reports",
  authLevel: "function",
  handler
});
```

El composition root registra trigger, construye dependencias concretas y delega.

## Testable handler

```ts
export interface RequestReportHandlerDependencies {
  useCase: RequestReportUseCase;
  now: () => string;
}

export function createRequestReportHandler(dependencies: RequestReportHandlerDependencies) {
  return async function requestReport(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
      const body = await readBody(request);
      const result = await dependencies.useCase.execute({
        customerId: body.customerId,
        from: body.from,
        to: body.to,
        requestedAt: dependencies.now()
      });

      return {
        status: 202,
        jsonBody: {
          reportId: result.reportId,
          status: result.status
        }
      };
    } catch (error: unknown) {
      context.error("Unexpected error requesting report", error);
      return {
        status: 500,
        jsonBody: {
          code: "INTERNAL_ERROR"
        }
      };
    }
  };
}
```

El handler traduce runtime/contrato y conserva respuestas observables. No accede a SDKs si existe un boundary mejor.

## Application use case

```ts
export class RequestReportUseCase {
  constructor(private readonly reportRepository: ReportRepository) {
  }

  async execute(command: RequestReportCommand): Promise<RequestReportResult> {
    const report = createRequestedReport(command);

    return this.reportRepository.saveRequested({
      report,
      idempotencyKey: command.idempotencyKey
    });
  }
}
```

El use case expresa intención funcional y coordina contratos internos. No debe depender del runtime Azure.

## Boundary only when real

```ts
export interface ReportRepository {
  saveRequested(input: SaveRequestedReportInput): Promise<RequestReportResult>;
}
```

Crear contratos para boundaries reales: persistence, messaging, storage, HTTP externo o SDKs que deben aislarse.

No crear interfaces solo para replicar una estructura.

## Infrastructure adapter

```ts
export class CosmosReportRepository implements ReportRepository {
  constructor(private readonly container: Container) {
  }

  async saveRequested(input: SaveRequestedReportInput): Promise<RequestReportResult> {
    await this.container.items.create({
      ...input.report,
      docType: "REPORT"
    });

    return {
      reportId: input.report.reportId,
      status: input.report.status,
      created: true
    };
  }
}
```

Infrastructure encapsula SDKs y formatos técnicos. Application/domain no deben conocer detalles del SDK.

## Handler test shape

```ts
it("returns accepted response", async () => {
  const useCase = {
    execute: jest.fn().mockResolvedValue({
      reportId: "REP-100",
      status: "REQUESTED"
    })
  };

  const handler = createRequestReportHandler({
    useCase,
    now: () => "2026-08-11T15:00:00.000Z"
  });

  const response = await handler(request, context);

  expect(response).toEqual({
    status: 202,
    jsonBody: {
      reportId: "REP-100",
      status: "REQUESTED"
    }
  });
});
```

Probar traducción, errores conocidos y preservación de contrato. No requerir Azure real para lógica local.

Usar este snippet solo cuando el plan/etapa permita crear o ajustar tests. En migración técnica, no convertir ejemplos de test en requisito automático.

## Anti-patterns

### Business logic in composition root

```ts
app.http("RequestReport", {
  route: "reports",
  handler: async request => {
    const body = await request.json();
    const container = new CosmosClient(process.env.COSMOS_CONNECTION!).database("db").container("reports");
    await container.items.create(calculateBusinessState(body));
    return {
      status: 202
    };
  }
});
```

Problemas: mezcla runtime, SDK, configuración y reglas. Difícil de probar sin Azure.

### Decorative layers

```text
src/RequestReport/
├── application/
├── domain/
├── infrastructure/
└── interfaces/
```

Problema: carpetas vacías o interfaces sin boundary real agregan ruido y reducen claridad.

### Functional optimization during refactor

```text
BEFORE: retry 3 veces y publica mensaje de fallo.
AFTER: retry eliminado porque el handler nuevo captura el error.
```

Problema: cambia semántica observable. Requiere Action ID explícito y decisión aprobada.
