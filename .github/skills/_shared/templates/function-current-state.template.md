# <FunctionName>

> Documento BEFORE de una Function. Debe ser un espejo fiel del código, no un resumen interpretado. Cuenta la misma
> historia que `current-state.md` a nivel repo, pero enfocada en una sola Function: qué recibe, qué hace, qué
> produce, y con qué se conecta — cada afirmación trazable a una línea de código real.

## Identificación

- Function:
- Capability:
- Trigger:
- Programming Model:
- Durable role:

## Firma exacta del handler

La firma es el punto de partida: define exactamente qué entra y qué tipo de valor sale, antes de explicar el
comportamiento interno.

```ts
```

## Contrato observable

Con la firma ya conocida, esta sección detalla el contrato completo — qué shape exacta tiene la entrada, qué pasos
sigue el comportamiento, qué produce como salida, y qué efectos secundarios o errores puede generar en el camino.

### Entrada

### Comportamiento

### Salida

### Efectos y errores relevantes

## Fragmento de código relevante

El contrato de arriba se describe en prosa/estructura; este fragmento es la evidencia literal que lo respalda —
ancla verificable entre este documento y el archivo fuente real.

```ts
```

*(archivo: ruta/al/archivo.ts, líneas X-Y)*

## Dependencias

Toda Function depende de otros módulos internos y paquetes externos para cumplir su contrato — esta sección lista
exactamente cuáles, como base de las dos tablas siguientes (servicios externos y diagrama).

- internas: (nombres reales de clases/módulos importados, ej. `ReportCosmosDbService`, no descripciones)
- externas:
- shared resources/candidates:

## Servicios externos consumidos

Esta tabla traduce las dependencias externas de arriba en servicios de Azure concretos — derivada de los mismos
datos ya presentes en `inventory.json` (`azureResourcePackageUsage`, `sharedResourceCandidates`,
`configurationKeys`), nunca un servicio no respaldado por esos datos.

| Servicio | Tipo | Evidencia |
|---|---|---|

## Diagrama de dependencias de la Function

El diagrama siguiente visualiza de un vistazo las mismas dependencias y servicios ya listados arriba — específico
de esta Function, no el diagrama global de la app. Cada nodo debe corresponder a un dato ya presente en
`inventory.json`/en las secciones "Dependencias"/"Servicios externos consumidos"/"Configuración" de este documento
— nunca un nodo inventado.

```mermaid
flowchart LR
```

## Configuración

Solo nombres de claves.

## Relaciones

Más allá de los servicios de Azure, esta sección ubica a la Function dentro del flujo más amplio del repositorio:
quién la invoca, a quién invoca ella, y si forma parte de un workflow Durable coordinado.

- callers/producers:
- consumers/downstream:
- workflow participants:

## Arquitectura actual

Con el contrato, las dependencias y las relaciones ya claras, esta sección resume cómo está organizado el código
internamente — si el adapter Azure está separado de la lógica de negocio, o si todo vive mezclado.

- Azure adapter:
- lógica funcional:
- infraestructura:
- acoplamientos:

## Señales iniciales (evidencia determinista)

Si `inventory.json` reporta `initialSignals` para esta Function, transcribirlas aquí con su `type`,
`evidenceStatus` y `detail` literal — no reinterpretar ni suavizar el hallazgo. Son señales detectadas de forma
determinista (por ejemplo un `await` faltante), no una opinión sobre el código.

| Tipo | Evidence status | Detalle | Archivo |
|---|---|---|---|

## Riesgos e incertidumbres

Cierre del documento: qué de todo lo anterior merece atención antes de tocar esta Function, y qué preguntas siguen
sin respuesta confirmable desde el código.

- Riesgos:
- Unknowns:

## Referencias

- Analysis:
- Migration plan:
