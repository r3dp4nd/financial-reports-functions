# Evidence Policy

## Objetivo

Definir cómo los skills distinguen hechos, inferencias e incertidumbre y cómo mantienen evidencia trazable y
reproducible.

## Estados

Usar:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

Estos estados describen el estado de la evidencia.

No sustituir con ellos estados de acción, validación o revisión humana.

### CONFIRMED

Existe evidencia directa suficiente.

La evidencia debe poder localizarse o reproducirse.

### INFERRED

Existe evidencia parcial que permite una conclusión razonable, pero no definitiva.

La evidencia utilizada debe quedar identificada.

Distinguir la evidencia observada de la inferencia derivada de ella.

### UNKNOWN

No existe evidencia suficiente o existe evidencia contradictoria que impide determinar el hecho de forma segura.

No reemplazar `UNKNOWN` por una suposición.

### NOT_APPLICABLE

La dimensión evaluada no aplica al caso analizado.

## Evidencia del repositorio

Preferir referencias mínimas como:

- archivo;
- configuración;
- dependencia;
- registro;
- llamada;
- resultado de una tool determinista;
- artifact previo del flujo.

Cuando sea posible, registrar la ruta y localización mínima relevante.

No almacenar código completo cuando una referencia breve sea suficiente.

Para resultados deterministas, conservar únicamente la información necesaria para identificar:

- herramienta o comando;
- scope;
- artifact producido cuando exista;
- resultado relevante.

## Reproducibilidad

Cuando una conclusión dependa de una validación ejecutada, registrar lo mínimo necesario para reproducirla:

- herramienta o comando;
- scope;
- resultado;
- artifact de evidencia cuando exista.

No registrar `PASS` si la validación no fue ejecutada.

La compilación exitosa no demuestra por sí sola compatibilidad funcional.

## Proveniencia

Toda conclusión relevante debe permitir identificar de dónde provino la evidencia.

Fuentes posibles incluyen:

- repositorio;
- tool determinista;
- baseline aprobado;
- documentación oficial;
- artifact previo del flujo.

No convertir la salida de una inferencia previa en evidencia directa sin preservar su estado original.

## Evidencia externa

Para afirmaciones sobre:

- Node.js;
- Azure Functions;
- Programming Model;
- Durable Functions;
- SDKs;
- compatibilidad;
- soporte;
- versiones;

usar documentación oficial vigente.

Orden preferido:

1. Microsoft Learn o documentación oficial de Azure.
2. documentación oficial de Node.js.
3. documentación oficial del SDK o paquete.
4. npm oficial cuando sea necesario.

No copiar documentación completa.

Guardar solo la referencia necesaria para justificar la conclusión.

La documentación vigente se utiliza para validar soporte, compatibilidad y comportamiento técnico.

No reemplaza automáticamente versiones target ya aprobadas por `dependency-baseline.json` o por el plan de migración.

## Seguridad de la evidencia

Toda evidencia debe cumplir:

`.github/skills/_shared/security-policy.md`

Una necesidad de evidencia no autoriza leer, almacenar o incluir contenido protegido.

Cuando corresponda, registrar únicamente metadata permitida, nombres de claves o existencia del archivo.

## Contradicciones

Si una evidencia nueva contradice un artefacto anterior:

- no sobrescribir silenciosamente la conclusión previa;
- registrar la inconsistencia y las evidencias en conflicto;
- marcar `evidenceStatus` como `UNKNOWN` cuando la contradicción impida determinar el hecho;
- utilizar `REQUIRES_REVIEW` en el estado correspondiente cuando sea necesaria intervención humana;
- corregir o regenerar únicamente el artefacto cuya conclusión sea incorrecta y cuya semántica permita actualización.

Los artefactos históricos BEFORE no deben reescribirse para representar estados posteriores.

## Principio

No inventar.

No convertir una inferencia en hecho.

No afirmar evidencia que no pueda localizarse o reproducirse.

No considerar compilación exitosa como prueba suficiente de compatibilidad funcional.
