# <FunctionName>

> Documento BEFORE de una Function. Debe ser un espejo fiel del código, no un resumen interpretado.

## Identificación

- Function:
- Capability:
- Trigger:
- Programming Model:
- Durable role:

## Narrativa

> Traducción a prosa de hechos ya citados literalmente en las secciones de abajo (Comportamiento, Efectos y errores, Fragmento de código). Nunca introducir aquí un hecho que no esté respaldado por un bloque de código citado en otra sección de este mismo documento.

### Narrativa funcional (para onboarding no-técnico)

> Qué problema de negocio resuelve esta Function, en 2-4 frases, sin jerga técnica. Si el propósito de negocio no es 100% claro desde el código, decirlo explícitamente en vez de asumirlo.

### Narrativa técnica (para onboarding técnico)

> Cómo lo hace, en 3-6 frases de prosa fluida (paginación, batching, reintentos, validaciones, etc.), siempre trazable a la sección "Comportamiento"/"Fragmento de código relevante" de abajo.

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
