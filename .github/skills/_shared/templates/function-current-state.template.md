# <FunctionName>

> Documento BEFORE de una Function. Debe ser un espejo fiel del código, no un resumen interpretado: cada afirmación de comportamiento debe poder verificarse línea por línea contra el archivo fuente citado. Un dev que use este documento para migrar no debería necesitar reabrir el código para confirmar lo que aquí se afirma.

## Identificación

- Function:
- Capability:
- Trigger:
- Programming Model:
- Durable role:

## Firma exacta del handler

Transcribir literalmente la firma de la función exportada (nombre de parámetros, tipos declarados tal como aparecen), no describirla. Ejemplo de formato:

```ts
```

## Contrato observable

### Entrada

### Comportamiento

> Regla de fidelidad: cualquier condición de negocio relevante (validaciones, branching, mensajes de error) debe citarse como bloque de código con el fragmento real, no reformulada en prosa. No escribir "lanza un error si no es válido"; transcribir la línea real, ej. `throw new Error("...");`.

### Salida

### Efectos y errores relevantes

> Misma regla de fidelidad que "Comportamiento": literales exactos, no paráfrasis.

## Fragmento de código relevante

Pegar el fragmento de source más importante de la Function (la lógica de negocio central, no el archivo completo), delimitado por bloque de código con lenguaje, y referencia a archivo/líneas. Este es el ancla textual entre este documento y el código real.

```ts
```

*(archivo: ruta/al/archivo.ts, líneas X-Y)*

## Dependencias

- internas: (nombres reales de clases/módulos importados, ej. `ReportCosmosDbService`, no descripciones)
- externas:
- shared resources/candidates:

## Configuración

Solo nombres de claves.

## Relaciones

- callers/producers: (nombres literales exactos usados en `callActivity`/`startNew`/`app.X`, no paráfrasis)
- consumers/downstream: (idem)
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
