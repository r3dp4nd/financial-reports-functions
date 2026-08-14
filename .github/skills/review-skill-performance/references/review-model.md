# Modelo de review

## Finding types

Usar un conjunto pequeño:

- `BUG`;
- `RESPONSIBILITY_LEAKAGE`;
- `AMBIGUOUS_RULE`;
- `OVERBROAD_RULE`;
- `MISSING_COVERAGE`;
- `REDUNDANCY`;
- `SIMPLIFICATION`;
- `BASELINE_CANDIDATE`.

## Recurrencia

Distinguir:

- aislado;
- repetido dentro del mismo skill;
- repetido entre skills;
- sistemático.

La recurrencia aumenta confianza, pero no sustituye evidencia causal.

## Impacto

Evaluar impacto sobre:

- seguridad;
- corrección;
- completion de migración;
- consumo de contexto/tokens;
- mantenibilidad;
- portabilidad.

## Costo del cambio

Preferir cambios que reduzcan reglas y duplicación sin romper contratos existentes.

## Recommendation

- `RECOMMEND`;
- `MONITOR`;
- `REJECT`;
- `NEEDS_MORE_EVIDENCE`.

## Menos es más

Antes de agregar una regla preguntar si puede:

- eliminarse una regla existente;
- mover detalle a reference;
- sustituirse razonamiento por script determinista;
- reducirse el scope del skill;
- reforzarse un eval en vez de añadir prosa.
