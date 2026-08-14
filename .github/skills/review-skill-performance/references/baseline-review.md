# Review del dependency baseline

Cargar únicamente cuando exista evidencia de que un target aprobado está incompleto, obsoleto o incorrecto.

## Fuentes

Usar documentación oficial del package/plataforma.

## Candidato

Registrar:

- package;
- baseline actual;
- evidencia de ejecuciones afectadas;
- target candidato;
- compatibilidad conocida;
- riesgos;
- migración requerida;
- propuesta de `baselineRevision`.

No editar `_shared/dependency-baseline.json` desde este skill.

Un package no gestionado puede generar una propuesta, pero no se adopta automáticamente por ser la versión más reciente.
