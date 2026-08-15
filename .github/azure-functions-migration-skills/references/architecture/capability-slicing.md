# Slicing de servicios monolíticos por capability

## Propósito

Ayudar a comprender servicios grandes, god files o módulos mezclados y proponer cortes por capability sin cambiar comportamiento durante la migración.

Esta referencia sustenta `assess-function-app`, `analyze-function`, `refactor-function` y `migrate-shared-component` cuando un archivo o servicio concentra responsabilidades de varias Functions, flujos o integraciones.

## Señales para cargar esta referencia

Carga esta referencia si detectas:

- archivos con muchas responsabilidades de negocio e infraestructura;
- servicios `Manager`, `Service`, `Helper`, `Processor` o similares usados por varias Functions;
- métodos no relacionados que cambian por razones distintas;
- mezcla de lectura, reglas, generación de documentos, storage, mensajería y mapping;
- código compartido que parece pertenecer a varias capabilities;
- tests difíciles de escribir porque todo depende de todo.

No la cargues solo por tamaño de archivo. Un archivo grande puede estar cohesionando una responsabilidad real.

## Principio

Primero se entiende el módulo; luego se corta.

```text
inventario observable
      ↓
responsabilidades y consumidores
      ↓
capabilities candidatas
      ↓
orden incremental de extracción
      ↓
validación de comportamiento
```

No uses el slicing para rediseñar el negocio ni para imponer una arquitectura nueva. El objetivo es que cada migración deje el sistema más entendible y testeable, preservando comportamiento.

## Inventario mínimo del módulo

Antes de proponer cortes, registra:

```text
módulo/archivo
consumidores conocidos
métodos o funciones públicas
dependencias internas
dependencias externas
settings/env usados
side effects
datos de entrada y salida
errores manejados
comportamiento que debe preservarse
```

Para cada método relevante, clasifica su rol:

- entrada/adaptación;
- caso de uso/orquestación;
- regla de dominio;
- persistencia;
- mensajería;
- storage;
- generación de documento;
- mapping/serialización;
- utilidad pura;
- configuración/composición.

## Criterios de corte por capability

Una capability candidata debe tener al menos una razón observable:

- responde a un flujo de negocio distinto;
- tiene consumidores propios;
- usa datos o contratos propios;
- produce side effects propios;
- cambia por reglas o requerimientos distintos;
- puede probarse como unidad de comportamiento útil.

No cortes por:

- tipo técnico solamente (`repositories`, `services`, `utils`);
- cantidad de líneas;
- deseo de que todas las carpetas tengan el mismo número de archivos;
- nombres genéricos sin lenguaje del dominio.

## Mapa de slicing

Produce un mapa antes de mover código:

```text
Módulo actual: <path>

Responsabilidad A
  capability candidata: <CapabilityName>
  consumidores: <Functions o componentes>
  evidencia: <métodos, imports, tests, bindings>
  destino sugerido: src/<CapabilityName>/...
  riesgo: <bajo | medio | alto>
  validación: <build | tests | caracterización | manual>

Responsabilidad B
  ...

Permanece compartido
  razón:
  consumidores:
  dueño sugerido: migrate-shared-component
```

Si una responsabilidad no tiene dueño claro, no la muevas todavía. Regístrala como incógnita o deuda.

## Orden incremental

Prefiere extraer en este orden cuando aplique:

1. tipos/contratos puros con naming claro;
2. funciones puras o reglas fáciles de caracterizar;
3. generación/mapping con entradas y salidas claras;
4. casos de uso con dobles de infraestructura;
5. infraestructura detrás de puertos existentes o necesarios;
6. composición/DI al final, cuando los límites ya son visibles.

No extraigas infraestructura compartida dentro de una sola capability si tiene varios consumidores. Deriva a `migrate-shared-component`.

## Evidencia y tests

Antes de mover una responsabilidad de riesgo medio/alto, debe existir al menos una forma de comprobación:

- test existente;
- test de caracterización agregado por alcance explícito;
- build/typecheck suficiente para el cambio;
- caso manual documentado cuando no sea viable automatizar.

No crees tests triviales para justificar un corte. El test debe proteger comportamiento observable.

## Destinos sugeridos

Usa la estructura objetivo solo cuando aporte claridad:

```text
src/<Capability>/
  handler.ts
  application/use-cases/
  application/ports/
  domain/models/
  domain/types/
  domain/ports/
  infrastructure/persistence/
  infrastructure/messaging/
  infrastructure/storage/
  infrastructure/document/
```

No crees carpetas vacías. Si una capability tiene una sola pieza coherente, puede permanecer plana temporalmente.

## No hacer

- No reescribir un god file completo en una sola pasada.
- No mover métodos privados sin entender qué comportamiento público sostienen.
- No duplicar lógica entre capabilities para avanzar rápido.
- No convertir componentes compartidos en propiedad accidental de la primera Function migrada.
- No crear interfaces para cada extracción.
- No cambiar nombres de negocio si eso dificulta comprobar equivalencia.
