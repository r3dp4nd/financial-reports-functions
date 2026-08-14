# Clasificación de dependencias

Usar el baseline aprobado como fuente de targets.

## BASELINED

Package presente en el baseline con target aprobado.

Assessment determina si la app necesita adaptación, no cambia el target.

## AZURE_UNMAPPED

Package Azure relevante para migración que no tiene entrada aprobada en el baseline.

Registrar:

- package;
- versión actual;
- motivo de relevancia;
- evidencia;
- `REQUIRES_VALIDATION` o review cuando corresponda.

No resolver con `latest`.

## UNMAPPED

Dependencia no Azure sin target aprobado pero potencialmente afectada por Node.js 24 o cambios de tooling.

Registrar el riesgo y delegar una decisión de target cuando sea necesaria.

## Clasificación práctica

Una dependencia puede ser:

- ya compatible;
- requiere upgrade aprobado;
- requiere adaptación de API;
- requiere validación;
- no relevante para la migración.

No confundir upgrade de versión con adaptación de código: pueden ser acciones distintas.
