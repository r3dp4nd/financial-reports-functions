# Security Policy

## Objetivo

Evitar que los skills, agentes o scripts carguen o produzcan información sensible durante discovery, análisis,
preparación, migración o verificación.

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

La clasificación de un archivo protegido debe realizarse mediante ruta, nombre, extensión o patrón conocido antes de
leer su contenido.

La necesidad de determinar si un archivo contiene secretos no autoriza su lectura.

## Archivos sensibles

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

Puede registrarse:

- existencia;
- ruta;
- categoría;
- nombre de una clave de configuración cuando pueda obtenerse desde código fuente permitido.

Nunca registrar valores sensibles.

## process.env

Puede analizarse código fuente permitido para detectar referencias como:

`process.env.KEY`

Registrar únicamente:

- nombre de la clave;
- ubicación de uso.

Nunca intentar resolver automáticamente el valor.

Detectar una referencia `process.env.KEY` no autoriza buscar su valor en archivos protegidos u otras fuentes.

## Configuración local

Cuando una validación necesite settings locales:

- indicar qué claves son necesarias;
- utilizar únicamente una copia sanitizada y aprobada específicamente para análisis;
- no abrir automáticamente un `local.settings.json` existente.

La aprobación de una copia sanitizada no convierte el archivo original protegido en legible.

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
- suscripciones;
- variables;
- secretos;
- topología interna.

Puede registrarse únicamente metadata permitida, como:

- existencia;
- ruta;
- categoría;
- `contentRead = false`.

No extraer información interna que requiera abrir el archivo.

Solo analizar una copia previamente sanitizada y aprobada cuando sea necesario.

## Scripts

Los scripts deterministas deben aplicar las exclusiones antes de cualquier operación que cargue contenido.

Cuando detecten un archivo excluido pueden registrar:

- ruta;
- clasificación;
- `contentRead = false`.

No deben leer primero el archivo para decidir después que era sensible.

Una ruta indirecta o enlace simbólico no debe utilizarse para eludir una exclusión.

Si una tool resuelve una ruta diferente de la observada inicialmente, debe volver a aplicar la política antes de leer.

## Logs y errores

No incluir contenido protegido en:

- stdout;
- stderr;
- excepciones;
- logs;
- artifacts;
- evidencia;
- mensajes de diagnóstico.

Los errores relacionados con archivos protegidos deben limitarse a información segura como:

- ruta;
- categoría;
- operación omitida.

## Artifacts generados

Ningún artifact generado por el flujo puede incluir valores sensibles obtenidos directa o indirectamente.

Cuando sea necesario registrar configuración o archivos protegidos, utilizar únicamente metadata permitida, nombres de
claves y estados como:

`contentRead = false`

## Principio

La exclusión ocurre antes de la lectura.

Detectar no significa inspeccionar.

La seguridad tiene prioridad sobre completar automáticamente un análisis.
