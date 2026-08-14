# Evidence Policy

## Objetivo

Definir cómo los skills distinguen hechos, inferencias e incertidumbre y cómo mantienen evidencia trazable y
reproducible.

La evidencia debe permitir comprender:

```text
qué se observó
→ de dónde provino
→ qué conclusión soporta
```

No confundir evidencia con:

- necesidad de acción;
- estado de ejecución;
- resultado de un check;
- decisión humana.

## Estados

Campo:

`evidenceStatus`

Valores:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

Estos valores describen exclusivamente el estado de la evidencia.

No sustituir con ellos:

- `actionStatus`;
- `executionStatus`;
- verification check `status`;
- artifact `status`;
- review requirements.

### CONFIRMED

Existe evidencia directa suficiente.

La evidencia debe poder:

- localizarse;
- reproducirse;
- o referenciarse de forma trazable.

`CONFIRMED` no significa que un check haya pasado.

### INFERRED

Existe evidencia parcial que permite una conclusión razonable, pero no definitiva.

La evidencia utilizada debe quedar identificada.

Distinguir:

```text
observación
→ evidencia

conclusión derivada
→ inferencia
```

No convertir una inferencia en evidencia directa durante etapas posteriores.

### UNKNOWN

No existe evidencia suficiente o existe evidencia contradictoria que impide determinar el hecho de forma segura.

No reemplazar `UNKNOWN` por:

- una suposición;
- una preferencia;
- una conclusión basada únicamente en antigüedad;
- una conclusión basada únicamente en ausencia de error.

### NOT_APPLICABLE

La dimensión evaluada no aplica al caso analizado.

Debe existir justificación cuando la no aplicabilidad no sea evidente por el contexto.

## Evidencia del repositorio

Preferir referencias mínimas como:

- archivo;
- localización;
- configuración observable;
- dependencia;
- import;
- registration;
- llamada;
- artifact previo;
- resultado de una tool determinista.

Cuando sea posible registrar:

- path;
- ubicación mínima relevante;
- identificador técnico cuando exista.

No almacenar código completo cuando una referencia breve sea suficiente.

Ejemplo conceptual:

```json
{
  "source": "repository",
  "path": "src/report.ts",
  "location": "ReportRepository import"
}
```

El formato exacto puede variar según el artifact owner.

No imponer un schema global de evidencia cuando una referencia mínima sea suficiente.

## Evidencia de ejecución

Cuando una conclusión dependa de una ejecución, registrar lo mínimo necesario para reproducirla.

Puede incluir cuando corresponda:

- herramienta o comando;
- scope;
- runtime real utilizado;
- resultado;
- artifact producido;
- referencia a logs sanitizados cuando sean necesarios.

Ejemplo conceptual:

```text
command
+ scope
+ runtime
+ result
```

Registrar runtime cuando su versión pueda afectar el significado del resultado.

Ejemplos:

- installation;
- typecheck;
- build;
- tests;
- Azure Functions Host.

No asumir el runtime ejecutado a partir del target declarado.

```text
declared Node.js 24
≠ execution under Node.js 24
```

## Evidence vs check result

La evidencia responde:

```text
¿qué observamos y cómo lo sabemos?
```

Un check responde:

```text
¿esa evidencia satisface el criterio?
```

Ejemplo:

```json
{
  "status": "PASS",
  "evidence": [
    {
      "command": "npm test",
      "runtime": "Node.js 24.x"
    }
  ]
}
```

No utilizar:

```text
evidenceStatus = PASS
```

ni:

```text
executionStatus = PASS
```

## Reproducibilidad

Cuando una conclusión dependa de una validación ejecutada, conservar evidencia suficiente para reconstruir:

```text
qué se ejecutó
→ sobre qué scope
→ con qué runtime cuando sea relevante
→ qué resultado produjo
```

No registrar:

`PASS`

cuando el criterio exigía ejecución y esta no ocurrió.

En ese caso utilizar el estado correspondiente, por ejemplo:

`NOT_EXECUTED`

La existencia de:

- script;
- configuración;
- test;
- command definition;

no demuestra que haya sido ejecutado.

## Límites de la evidencia

Una evidencia demuestra únicamente aquello que su alcance permite demostrar.

Ejemplos:

```text
npm install PASS
≠ source compatible
```

```text
typecheck PASS
≠ behavior preserved
```

```text
build PASS
≠ functional compatibility
```

```text
tests PASS
≠ all behavior protected
```

```text
coverage high
≠ behavioral proof
```

```text
host.json present
≠ deployed Azure Functions Runtime confirmed
```

```text
local Durable tests PASS
≠ production replay safety confirmed
```

No ampliar el significado de una evidencia más allá de lo que realmente demuestra.

## Provenance

Toda conclusión relevante debe permitir identificar de dónde provino la evidencia.

Fuentes posibles:

- repositorio;
- tool determinista;
- command execution;
- dependency baseline aprobado;
- documentación oficial;
- artifact previo del flujo;
- evidence producida por una etapa anterior.

Cuando una conclusión reutilice evidencia previa:

preservar su provenance y `evidenceStatus`.

No convertir:

```text
INFERRED upstream
```

en:

```text
CONFIRMED downstream
```

únicamente porque fue reutilizada por otro artifact.

Un estado puede fortalecerse únicamente cuando exista nueva evidencia que lo justifique.

## Artifacts previos

Consumir preferentemente artifacts propietarios ya existentes antes de reconstruir evidencia desde source.

Ejemplo:

```text
inventory
→ assessment
→ analysis
→ plan
→ execution
→ verification
```

Una etapa posterior puede comprobar o complementar evidencia previa cuando sea necesario.

No debe reconstruir sistemáticamente todo el conocimiento anterior.

Esto favorece:

- trazabilidad;
- progressive disclosure;
- menor consumo de contexto;
- menor riesgo de contradicciones artificiales.

## Evidencia externa

Para afirmaciones sobre soporte o comportamiento técnico de:

- Node.js;
- Azure Functions;
- Programming Model;
- Durable Functions;
- Azure SDKs;
- packages;

utilizar documentación oficial cuando sea necesaria.

Orden preferido:

1. Microsoft Learn o documentación oficial de Azure.
2. documentación oficial de Node.js.
3. documentación oficial del SDK o package.
4. registry oficial como npm cuando aporte la información necesaria.

No copiar documentación completa.

Guardar únicamente la referencia suficiente para justificar la conclusión.

## Documentación oficial y target aprobado

La documentación oficial puede utilizarse para determinar:

- soporte;
- compatibilidad;
- comportamiento de APIs;
- instrucciones de migración;
- restricciones técnicas.

No redefine automáticamente:

- dependency baseline;
- migration plan;
- package target aprobado.

```text
official evidence
→ validate support / compatibility / HOW

baseline + approved plan
→ define executable target
```

Si nueva evidencia oficial contradice un target aprobado:

- preservar la contradicción;
- no cambiar el target silenciosamente;
- registrar review cuando corresponda;
- utilizar el proceso controlado de baseline change.

## Candidate targets

Una investigación puede producir:

`candidateTarget`

La existencia de evidencia externa suficiente sobre ese candidato no lo convierte automáticamente en:

`approved target`

```text
evidence supports candidate
≠ candidate approved for execution
```

La aprobación pertenece al proceso de gobierno correspondiente.

## Seguridad de la evidencia

Toda evidencia debe cumplir:

`security-policy.md`

La necesidad de evidencia nunca autoriza:

- leer un archivo protegido;
- abrir CI/CD protegido;
- recuperar secrets;
- registrar connection strings;
- almacenar certificados;
- incluir contenido sensible en contexto.

Cuando corresponda, registrar únicamente metadata permitida como:

- existencia;
- path;
- category;
- configuration key name;
- `contentRead = false`.

La seguridad tiene precedencia sobre la completitud de la evidencia.

```text
missing evidence due to security boundary
→ UNKNOWN / NOT_EXECUTED / REVIEW

no:
→ bypass security boundary
```

según el dominio correspondiente.

## Contradicciones

Si nueva evidencia contradice un artifact anterior:

1. preservar ambas evidencias;
2. registrar la inconsistencia;
3. no seleccionar silenciosamente una de ellas;
4. utilizar `evidenceStatus = UNKNOWN` cuando la contradicción impida determinar el hecho;
5. registrar `REQUIRES_REVIEW` cuando sea necesaria decisión humana.

No reescribir artifacts históricos únicamente para eliminar la contradicción.

## Mutabilidad de artifacts

La corrección de un artifact depende de su contrato de ownership y mutabilidad.

### Artifact mutable

Puede corregirse o regenerarse únicamente cuando:

- su contrato permite actualización;
- pertenece al owner actual;
- existe evidencia suficiente;
- la corrección no destruye evidencia histórica requerida.

### Artifact histórico

Preservar.

Registrar nueva evidencia en el artifact owner correspondiente.

En particular:

`.migration/catalog/**`

representa BEFORE histórico y no debe reescribirse para reflejar estados posteriores.

Los artifacts de execution o verification previos tampoco deben modificarse retrospectivamente únicamente para ocultar
una contradicción.

## Contradicción con baseline

Si evidencia actual contradice:

`dependency-baseline.json`

no modificar el baseline desde una etapa operativa.

Registrar:

- baselineRef;
- evidencia contradictoria;
- impacto;
- review requirement cuando corresponda.

La evolución del baseline sigue su proceso controlado.

## Evidencia negativa

Los fallos también son evidencia.

Ejemplos:

- build failure;
- test failure;
- registration missing;
- incompatible API;
- dependency installation failure.

No eliminar ni minimizar evidencia negativa únicamente porque otra ejecución haya sido exitosa.

La evidencia contradictoria debe conservarse para review.

## Evidencia mínima

Preferir:

```text
suficiente para localizar/reproducir
```

sobre:

```text
copiar todo el contexto disponible
```

No incluir:

- archivos completos;
- logs completos;
- documentación completa;
- todo el repository slice;

cuando referencias más pequeñas sean suficientes.

## Executor neutrality

La evidencia debe ser entendible por:

- otro skill;
- otro agente;
- un developer;
- un reviewer humano.

No debe depender del razonamiento privado del ejecutor que produjo la conclusión.

Debe quedar suficientemente claro:

```text
claim
→ evidence
→ provenance
```

## Principios

No inventar.

No convertir inferencia en hecho.

No utilizar `PASS` como evidence status.

No afirmar ejecución que no ocurrió.

No ampliar el alcance de una evidencia más allá de lo demostrado.

No considerar compilación exitosa como prueba suficiente de compatibilidad funcional.

No utilizar documentación oficial para redefinir silenciosamente un target aprobado.

No sacrificar seguridad para obtener evidencia adicional.

No reescribir historia para resolver contradicciones.

Preservar provenance.
