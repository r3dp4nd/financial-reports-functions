# 3. Proveedores para librerias externas

Cuando se usa una libreria externa como ExcelJS, PDFKit, Sharp, CSV parsers o clientes de terceros, no conviene llamarla directamente desde el use case ni desde el dominio.

La recomendacion es crear un contrato interno y una implementacion en infraestructura. A este adaptador se le puede llamar `provider`, `generator`, `client`, `gateway` o `adapter`, segun el caso.

## Diagrama de proveedor por capas

Este `flowchart` comunica mejor la idea que un diagrama de clases porque muestra donde vive cada pieza y que dependencias cruzan capas.

```mermaid
flowchart LR
  subgraph Application["application"]
    UseCase["GenerateDocumentUseCase<br/>coordina generar + guardar"]
    GeneratorContract["DocumentGenerator<br/>interface interna"]
    StorageContract["DocumentStorage<br/>interface interna"]
  end

  subgraph Infrastructure["infrastructure"]
    ExcelProvider["ExcelJsDocumentGenerator<br/>provider/adaptador"]
    BlobStorage["BlobDocumentStorage<br/>storage adapter"]
  end

  subgraph External["externo"]
    ExcelJS["exceljs<br/>libreria externa"]
    AzureBlob["Azure Blob Storage<br/>SDK/servicio"]
  end

  subgraph Tests["tests"]
    FakeGenerator["FakeDocumentGenerator<br/>mock/stub"]
    FakeStorage["FakeDocumentStorage<br/>mock/stub"]
  end

  UseCase --> GeneratorContract
  UseCase --> StorageContract
  ExcelProvider -. implementa .-> GeneratorContract
  BlobStorage -. implementa .-> StorageContract
  FakeGenerator -. reemplaza en tests .-> GeneratorContract
  FakeStorage -. reemplaza en tests .-> StorageContract
  ExcelProvider --> ExcelJS
  BlobStorage --> AzureBlob

  classDef app fill:#DCFCE7,stroke:#15803D,color:#111827
  classDef contract fill:#DBEAFE,stroke:#1D4ED8,color:#111827
  classDef infra fill:#FCE7F3,stroke:#BE185D,color:#111827
  classDef external fill:#F3F4F6,stroke:#374151,color:#111827
  classDef test fill:#FEF3C7,stroke:#B45309,color:#111827

  class UseCase app
  class GeneratorContract,StorageContract contract
  class ExcelProvider,BlobStorage infra
  class ExcelJS,AzureBlob external
  class FakeGenerator,FakeStorage test
```

Lectura del diagrama:

- El caso de uso depende de interfaces internas, no de ExcelJS ni Blob.
- Infraestructura implementa esas interfaces con librerias reales.
- Los tests reemplazan los providers reales por mocks o stubs.
- Cambiar ExcelJS por otra libreria implica crear otro provider, no reescribir el caso de uso.

## Contrato interno

```ts
export interface DocumentGeneratorInput {
  entityId: string;
  title: string;
  rows: Array<{
    label: string;
    value: string | number;
  }>;
}

export interface DocumentGenerator {
  generate(input: DocumentGeneratorInput): Promise<Uint8Array>;
}
```

El contrato no menciona ExcelJS. El use case solo sabe que puede generar bytes.

## Use case desacoplado

```ts
import {DocumentGenerator} from "./document-generator";
import {DocumentStorage} from "./document-storage";

export interface GenerateDocumentUseCaseDependencies {
  generator: DocumentGenerator;
  storage: DocumentStorage;
}

export class GenerateDocumentUseCase {
  constructor(private readonly dependencies: GenerateDocumentUseCaseDependencies) {
  }

  async execute(command: {
    entityId: string;
    title: string;
    rows: Array<{ label: string; value: string | number }>;
  }): Promise<{ entityId: string; fileName: string }> {
    const content = await this.dependencies.generator.generate({
      entityId: command.entityId,
      title: command.title,
      rows: command.rows
    });

    const stored = await this.dependencies.storage.save({
      entityId: command.entityId,
      content,
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    return {
      entityId: command.entityId,
      fileName: stored.fileName
    };
  }
}
```

## Provider con ExcelJS

```ts
import ExcelJS from "exceljs";

import {DocumentGenerator, DocumentGeneratorInput} from "../../application/document-generator";

export class ExcelJsDocumentGenerator implements DocumentGenerator {
  async generate(input: DocumentGeneratorInput): Promise<Uint8Array> {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Azure Functions App";

    const worksheet = workbook.addWorksheet("Summary");

    worksheet.columns = [{
      header: "Label",
      key: "label",
      width: 30
    }, {
      header: "Value",
      key: "value",
      width: 40
    }];

    worksheet.addRow({
      label: "Entity ID",
      value: input.entityId
    });

    worksheet.addRow({
      label: "Title",
      value: input.title
    });

    for (const row of input.rows) {
      worksheet.addRow({
        label: row.label,
        value: row.value
      });
    }

    worksheet.getRow(1).font = {
      bold: true
    };

    const buffer = await workbook.xlsx.writeBuffer();

    return new Uint8Array(buffer);
  }
}
```

## Test del use case sin ExcelJS

```ts
it("should generate and store document", async () => {
  const generator = {
    generate: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]))
  };

  const storage = {
    save: jest.fn().mockResolvedValue({
      fileName: "ENT-100.xlsx"
    })
  };

  const useCase = new GenerateDocumentUseCase({
    generator,
    storage
  });

  const result = await useCase.execute({
    entityId: "ENT-100",
    title: "Example",
    rows: [{
      label: "Total",
      value: 100
    }]
  });

  expect(generator.generate).toHaveBeenCalledTimes(1);
  expect(storage.save).toHaveBeenCalledWith(expect.objectContaining({
    entityId: "ENT-100",
    content: new Uint8Array([1, 2, 3])
  }));

  expect(result).toEqual({
    entityId: "ENT-100",
    fileName: "ENT-100.xlsx"
  });
});
```

Regla:

> Toda libreria externa debe entrar al sistema mediante un proveedor/adaptador ubicado en infraestructura.
