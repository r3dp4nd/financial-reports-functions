# <FunctionName>

> Documento BEFORE de una Function. Debe ser un espejo fiel del código, no un resumen interpretado.

## Identificación

- Function:
- Capability:
- Trigger:
- Programming Model:
- Durable role:

## Firma exacta del handler

```ts
```

## Contrato observable

### Entrada

### Comportamiento

### Salida

### Efectos y errores relevantes

## Fragmento de código relevante

```ts
```

*(archivo: ruta/al/archivo.ts, líneas X-Y)*

## Dependencias

- internas: (nombres reales de clases/módulos importados, ej. `ReportCosmosDbService`, no descripciones)
- externas:
- shared resources/candidates:

## Servicios externos consumidos

> Tabla derivada de los mismos datos ya presentes en `inventory.json` (`azureResourcePackageUsage`, `sharedResourceCandidates`, `configurationKeys`) y en la sección "Dependencias" de arriba — nunca un servicio no respaldado por esos datos.

| Servicio | Tipo | Evidencia |
|---|---|---|

## Diagrama de dependencias de la Function

> Diagrama específico de esta Function (no el diagrama global de la app). Cada nodo debe corresponder a un dato ya presente en `inventory.json`/en las secciones "Dependencias"/"Servicios externos consumidos"/"Configuración" de este documento — nunca un nodo inventado.

```mermaid
flowchart LR
```

## Configuración

Solo nombres de claves.

## Relaciones

- callers/producers:
- consumers/downstream:
- workflow participants:

## Arquitectura actual

- Azure adapter:
- lógica funcional:
- infraestructura:
- acoplamientos:

## Señales iniciales (evidencia determinista)

Si `inventory.json` reporta `initialSignals` para esta Function, transcribirlas aquí con su `type`, `evidenceStatus` y `detail` literal — no reinterpretar ni suavizar el hallazgo.

| Tipo | Evidence status | Detalle | Archivo |
|---|---|---|---|

## Riesgos e incertidumbres

- Riesgos:
- Unknowns:

## Referencias

- Analysis:
- Migration plan:
