# Migration needs

Analysis identifica necesidades; planning decide acciones y `requiredForMigration`.

Clasificaciones recomendadas:

- `REQUIRED_PLATFORM`: runtime/host/platform;
- `REQUIRED_NODE`: compatibilidad Node.js 24;
- `REQUIRED_DEPENDENCY`: package o API de dependencia;
- `STRUCTURAL`: estructura necesaria para migrar el slice conforme a arquitectura objetivo;
- `REFACTOR_TESTABILITY`: mejora de estructura/testabilidad que puede vivir en carril separado;
- `TECHNICAL_DEBT`: mejora no obligatoria;
- `OPTIMIZATION`: optimización no obligatoria.

No existe una categoría de testing obligatorio: el toolkit no genera tests en el repo objetivo.

Cada necesidad debe incluir como mínimo:

- `id` local de analysis si el schema lo usa;
- classification;
- rationale;
- evidence;
- affected scope;
- recommended lane cuando aplique;
- uncertainty/review cuando aplique.

No usar Action IDs `GLOBAL-*`, `SR-ACTION-*` o `FN-*`; esos pertenecen a planning.
