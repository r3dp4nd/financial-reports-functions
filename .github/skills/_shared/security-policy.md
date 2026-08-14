# Security Policy

## Objetivo

Evitar que cualquier skill, agente, script, tool o proceso del toolkit lea, cargue, inspeccione, propague o produzca
información sensible.

Esta policy aplica durante todo el flujo, incluyendo:

- discovery;
- assessment;
- analysis;
- planning;
- preparation;
- testing;
- migration;
- verification;
- review;
- scripts y tools auxiliares.

La seguridad se aplica antes de cargar contenido en contexto.

## Regla principal

No leer, cargar, inspeccionar ni incluir en contexto contenido que pueda contener:

- API keys;
- contraseñas;
- tokens;
- connection strings;
- secretos;
- certificados;
- credenciales;
- claves privadas.

La clasificación de un archivo protegido debe realizarse mediante:

- ruta;
- nombre;
- extensión;
- patrón conocido;
- metadata segura;

antes de leer su contenido.

La necesidad de determinar si un archivo contiene secretos no autoriza su lectura.

```text
detect protected path
→ exclude content
→ record safe metadata only
```

No:

```text
read content
→ discover secret
→ exclude afterwards
```

## Archivos protegidos

Excluir antes de analizar contenido, entre otros:

- `local.settings.json`;
- `.env*`;
- `*.pem`;
- `*.pfx`;
- `*.p12`;
- `*.key`;
- `*.crt`;
- `*.cer`;
- `*.jks`;
- archivos de secretos;
- configuraciones equivalentes.

Puede registrarse únicamente metadata segura como:

- existencia;
- ruta;
- categoría;
- `contentRead = false`.

Cuando el nombre de una configuration key pueda obtenerse desde código fuente permitido, puede registrarse.

Nunca registrar valores sensibles.

## Protected vs skipped

Distinguir:

### Protected

Contenido potencialmente sensible cuya lectura está prohibida.

Ejemplos:

- `.env`;
- `local.settings.json`;
- certificados;
- pipelines protegidos.

Puede registrarse metadata segura.

### Skipped

Contenido que no debe analizarse porque no pertenece al scope de source relevante o es generado/tooling.

Ejemplos según el skill:

- `node_modules`;
- `dist`;
- `coverage`;
- `.migration`;
- `.skill-improvement`;
- `.github/skills`.

```text
PROTECTED
≠
SKIPPED
```

Ambos pueden excluirse de lectura, pero por razones diferentes.

Cada skill debe respetar además sus propias reglas de scope.

## process.env

Puede analizarse código fuente permitido para detectar referencias como:

```javascript
process.env.KEY
```

o:

```javascript
process.env["KEY"]
```

Registrar únicamente:

- nombre de la key;
- ubicación de uso cuando sea necesaria.

Nunca intentar resolver automáticamente su valor.

Detectar:

`process.env.KEY`

no autoriza buscar su valor en:

- `.env`;
- `local.settings.json`;
- pipelines;
- secrets stores;
- otros archivos protegidos.

## Configuración local

Cuando una validación necesite configuración local:

1. identificar las keys necesarias;
2. utilizar únicamente una representación sanitizada;
3. requerir que esa representación haya sido aprobada explícitamente para el uso correspondiente.

No abrir automáticamente:

`local.settings.json`

existente.

La aprobación de una copia sanitizada no convierte el archivo original protegido en legible.

La aprobación aplica a la representación sanitizada concreta.

Si la copia cambia o se regenera, debe volver a considerarse su validez antes de utilizarla.

## Valores ficticios

Tests y fixtures pueden utilizar valores ficticios seguros cuando no representen información real.

Ejemplos:

```text
REPORT_DATABASE=test-database
QUEUE_NAME=test-queue
```

Un valor ficticio:

```text
≠
secret resuelto
```

No copiar valores reales desde configuración protegida para construir fixtures o tests.

## CI/CD

Excluir por defecto contenido de:

- GitHub Actions;
- Azure DevOps;
- GitLab CI;
- Jenkins;
- Bitbucket Pipelines;
- automatización equivalente.

Estos archivos pueden contener:

- endpoints;
- resource groups;
- service connections;
- subscriptions;
- variables;
- secrets;
- topología interna.

Puede registrarse únicamente metadata segura como:

- existencia;
- ruta;
- categoría;
- `contentRead = false`.

No abrir el archivo para extraer información interna.

Solo analizar una copia:

- previamente sanitizada;
- explícitamente aprobada;
- limitada al propósito requerido.

La necesidad de verificar Runtime, deployment o infraestructura no autoriza leer CI/CD protegido.

## Scripts y tools

Los scripts deterministas deben aplicar las exclusiones antes de cualquier operación que cargue contenido.

Cuando detecten un archivo protegido pueden registrar:

- ruta;
- clasificación;
- `contentRead = false`.

No deben leer primero el archivo para decidir después si era sensible.

## Rutas indirectas y symlinks

Una ruta indirecta, alias o enlace simbólico no debe utilizarse para eludir:

- security exclusions;
- scope restrictions.

Si una tool resuelve una ruta diferente de la observada inicialmente debe volver a validar:

```text
resolved path
→ security classification
→ allowed scope
→ read only if both permit it
```

Si la ruta resuelta:

- apunta a contenido protegido;
- sale del scope permitido;
- no puede validarse con seguridad;

no leer su contenido.

## Source permitido

Que un archivo no sea protegido no significa automáticamente que deba cargarse.

Cada skill debe aplicar además:

- requested/effective scope;
- progressive disclosure;
- exclusiones de source;
- ownership de artifacts.

```text
security allows reading
≠
skill needs reading
```

Esto reduce tanto exposición como consumo innecesario de contexto.

## Logs y errores

No incluir contenido protegido en:

- stdout;
- stderr;
- exceptions;
- stack context cuando contenga datos sensibles;
- logs;
- artifacts;
- evidence;
- mensajes de diagnóstico.

Los errores relacionados con archivos protegidos deben limitarse a información segura como:

- ruta;
- categoría;
- operación omitida;
- reason code seguro.

Ejemplo:

```text
PROTECTED_FILE_SKIPPED
path=.env
contentRead=false
```

No incluir una muestra del contenido para justificar la exclusión.

## Artifacts generados

Ningún artifact generado por el flujo puede incluir valores sensibles obtenidos directa o indirectamente.

Esto aplica a:

- inventory;
- assessment;
- analysis;
- plans;
- preparation;
- testing;
- migrations;
- verification;
- lessons;
- skill improvement artifacts.

Cuando sea necesario registrar configuración o archivos protegidos, utilizar únicamente:

- metadata permitida;
- nombres de keys;
- categorías;
- estados como `contentRead = false`.

## Evidence

La necesidad de obtener evidencia nunca autoriza saltarse esta policy.

Cuando una dimensión no pueda demostrarse sin acceder a contenido protegido:

registrar según el dominio correspondiente:

- `UNKNOWN`;
- `NOT_EXECUTED`;
- `BLOCKED`;
- `REQUIRES_REVIEW`.

No:

```text
missing evidence
→ bypass security
```

La evidencia parcial debe indicar la limitación.

## Revisión humana

Una decisión humana puede autorizar el uso de una copia sanitizada específica.

No autoriza automáticamente:

- leer el original;
- ampliar el scope;
- leer otros archivos similares;
- recuperar secrets;
- inspeccionar infraestructura productiva.

Las autorizaciones deben mantenerse limitadas al artifact y propósito aprobado.

## Principios

La exclusión ocurre antes de la lectura.

Detectar no significa inspeccionar.

Metadata permitida no incluye valores secretos.

Una ruta resuelta debe volver a validarse.

Seguridad permitiendo lectura no implica necesidad de leer.

Una necesidad de evidencia no autoriza saltarse la policy.

La seguridad tiene prioridad sobre completar automáticamente un análisis.

Cuando la seguridad impida demostrar una dimensión:

preservar la incertidumbre.
