---
name: discover-function-app
description: Descubre de forma segura una Azure Function App antes de migrarla o refactorizarla. Inventaría estructura, Functions, triggers, bindings, configuración requerida, Programming Model y Durable Functions sin modificar código ni leer información sensible.
---

# Discover Function App

## Objetivo

Construir una fotografía segura y reutilizable de una Azure Function App antes de analizar, planificar o modificar
código.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`

## Entradas

- repositorio objetivo;
- artefactos existentes en `.migration/`, cuando existan.

## Principio

Preferir descubrimiento determinista antes que razonamiento.

No utilizar IA para volver a descubrir hechos que puede obtener el script interno.

## Script de inventario

Ejecutar primero:

`scripts/inventory.js`

sobre el repositorio objetivo.

El script es la fuente primaria para:

- Function Apps;
- `package.json`;
- `host.json`;
- Functions legacy;
- Functions Programming Model v4;
- triggers y bindings detectables;
- Durable Functions detectadas;
- dependencias;
- versión Node.js declarada;
- claves `process.env`;
- archivos sensibles detectados sin lectura.

Los scripts de este skill deben permanecer compatibles con Node.js 14 o superior.

## Uso de la salida

Consumir la salida JSON del script.

No repetir manualmente esos descubrimientos salvo que exista una inconsistencia.

Cuando el script produzca:

- falso positivo;
- falso negativo;
- caso no soportado;

registrarlo como lección aprendida.

## Análisis selectivo

Usando el inventario y únicamente el código necesario, identificar cuando exista evidencia:

- relaciones entre Functions;
- workflows Durable;
- Functions independientes;
- capacidades funcionales observables;
- infraestructura compartida;
- patrones arquitectónicos existentes.

No realizar todavía evaluación de compatibilidad ni planificación de cambios.

## Configuración

Usar únicamente nombres de claves detectadas mediante referencias como:

`process.env.KEY`

Registrar:

- nombre;
- archivos donde se utiliza;
- Function relacionada cuando pueda confirmarse.

Nunca resolver valores.

Cuando futuras validaciones necesiten configuración local, indicar las claves requeridas para que el desarrollador
proporcione una configuración sanitizada o aprobada.

## Programming Model

Detectar cuando exista evidencia:

- modelo legacy;
- Programming Model v4;
- estado mixto;
- estado desconocido.

No asumir que toda Function App necesita migración de Programming Model.

Una aplicación que ya está completamente en v4 debe quedar identificada como tal.

## Durable Functions

Detectar cuando exista evidencia de:

- Durable client;
- starter;
- orchestrator;
- activity;
- sub-orchestrator.

El discovery no migra ni analiza todavía el workflow en profundidad.

## Salidas

Crear:

`.migration/repository/inventory.json`

`.migration/repository/inventory.md`

Y:

`.migration/lessons/discover-function-app/lessons.json`

`.migration/lessons/discover-function-app/lessons.md`

## inventory.json

Debe contener como mínimo:

- metadata;
- repositorio;
- Function Apps;
- Node.js declarado;
- Runtime cuando pueda determinarse;
- Programming Model;
- dependencias relevantes;
- Functions;
- triggers y bindings;
- Durable Functions;
- configuración requerida;
- relaciones;
- observaciones;
- unknowns;
- evidencia.

No incluir secretos.

## inventory.md

Debe explicar brevemente:

- qué Function Apps existen;
- qué Functions fueron encontradas;
- Node.js, Runtime y Programming Model observables;
- configuración requerida;
- workflows o relaciones relevantes;
- hechos;
- inferencias;
- unknowns.

No debe ser una copia textual del JSON.

## Lecciones aprendidas

Aplicar:

`../_shared/lessons-policy.md`

## Criterio de cierre

El skill termina cuando:

- `scripts/inventory.js` fue ejecutado;
- su salida fue revisada;
- las Function Apps fueron identificadas;
- las Functions fueron inventariadas;
- las claves de configuración fueron registradas sin valores;
- Programming Model fue identificado o marcado como desconocido;
- relaciones relevantes fueron documentadas cuando existe evidencia;
- no se leyeron archivos sensibles;
- se generaron inventory y lessons.

## Fuera de alcance

Este skill no debe:

- modificar código;
- actualizar dependencias;
- evaluar compatibilidad Node.js 24 en profundidad;
- agregar tests;
- refactorizar;
- migrar Runtime;
- migrar Programming Model;
- migrar Durable;
- optimizar;
- generar el plan de migración.

El siguiente skill sugerido es:

`assess-function-app`
