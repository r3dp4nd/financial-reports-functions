'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const childProcess = require('child_process');

const SCRIPT = path.resolve(__dirname, '../scripts/inventory.js');

let passed = 0;
let failed = 0;

function test(name, callback) {
  try {
    callback();
    passed += 1;

    process.stdout.write('PASS ' + name + '\n');
  } catch (error) {
    failed += 1;

    process.stderr.write('FAIL ' + name + '\n' + error.stack + '\n');
  }
}

function createRepository() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'azure-function-inventory-'));
}

function writeFile(root, relativePath, content) {
  const filePath = path.join(root, relativePath);

  fs.mkdirSync(path.dirname(filePath), {
    recursive: true
  });

  fs.writeFileSync(filePath, content, 'utf8');

  return filePath;
}

function writeJson(root, relativePath, value) {
  writeFile(root, relativePath, JSON.stringify(value, null, 2));
}

function executeInventory(root) {
  const output = childProcess.execFileSync(process.execPath, [SCRIPT, root], {
    encoding: 'utf8'
  });

  return JSON.parse(output);
}

function cleanup(root) {
  if (fs.rmSync) {
    fs.rmSync(root, {
      recursive: true, force: true
    });

    return;
  }

  removeDirectoryLegacy(root);
}

function removeDirectoryLegacy(directory) {
  if (!fs.existsSync(directory)) {
    return;
  }

  fs.readdirSync(directory).forEach(function (name) {
    const target = path.join(directory, name);

    const stat = fs.statSync(target);

    if (stat.isDirectory()) {
      removeDirectoryLegacy(target);
    } else {
      fs.unlinkSync(target);
    }
  });

  fs.rmdirSync(directory);
}

test('inventaría una Function App legacy', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      name: 'legacy-functions', engines: {
        node: '14.x'
      }, dependencies: {
        '@azure/functions': '^1.2.3'
      }
    });

    writeJson(root, 'RequestReport/function.json', {
      scriptFile: '../dist/RequestReport/index.js', bindings: [{
        authLevel: 'function', type: 'httpTrigger', direction: 'in', name: 'req', methods: ['post']
      }, {
        type: 'http', direction: 'out', name: 'res'
      }]
    });

    const result = executeInventory(root);

    assert.strictEqual(result.functionApps.length, 1);

    assert.strictEqual(result.functionApps[0].platform.programmingModel.value, 'legacy');
  } finally {
    cleanup(root);
  }
});

test('inventaría dependencias Azure y third-party', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2',
        '@azure/keyvault-secrets': '^4.7.0',
        '@azure/cosmos': '^4.10.0',
        uuid: '^8.3.2',
        axios: '^1.7.0',
        'some-company-sdk': '2.4.1'
      }
    });

    const result = executeInventory(root);

    const dependencies = result.functionApps[0].dependencies;

    const byName = {};

    dependencies.forEach(function (dependency) {
      byName[dependency.name] = dependency;
    });

    assert.strictEqual(byName['@azure/functions'].azurePackage, true);

    assert.strictEqual(byName['@azure/keyvault-secrets'].azurePackage, true);

    assert.strictEqual(byName['@azure/cosmos'].azurePackage, true);

    assert.strictEqual(byName.uuid.azurePackage, false);

    assert.strictEqual(byName.axios.azurePackage, false);

    assert.strictEqual(byName['some-company-sdk'].azurePackage, false);
  } finally {
    cleanup(root);
  }
});

test('reconoce Azure SDK desconocido sin inventar recurso', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2', '@azure/keyvault-secrets': '^4.7.0'
      }
    });

    writeFile(root, 'src/a.ts', ["import { SecretClient } from '@azure/keyvault-secrets';", 'module.exports = SecretClient;'].join('\n'));

    writeFile(root, 'src/b.ts', ["import { SecretClient } from '@azure/keyvault-secrets';", 'module.exports = SecretClient;'].join('\n'));

    const result = executeInventory(root);

    const app = result.functionApps[0];

    assert.strictEqual(app.dependencies.find(function (dependency) {
      return (dependency.name === '@azure/keyvault-secrets');
    }).azurePackage, true);

    assert.deepStrictEqual(app.sharedResourceCandidates, []);
  } finally {
    cleanup(root);
  }
});

test('genera candidato solo para Azure resource SDK conocido', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2', '@azure/cosmos': '^4.10.0'
      }
    });

    writeFile(root, 'src/a.ts', "import { CosmosClient } from '@azure/cosmos';");

    writeFile(root, 'src/b.ts', "import { CosmosClient } from '@azure/cosmos';");

    const result = executeInventory(root);

    const candidates = result.functionApps[0].sharedResourceCandidates;

    assert.strictEqual(candidates.length, 1);

    assert.strictEqual(candidates[0].package, '@azure/cosmos');

    assert.strictEqual(candidates[0].evidenceStatus, 'INFERRED');
  } finally {
    cleanup(root);
  }
});

test('no interpreta third-party dependencies como infraestructura', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2', pg: '^8.13.0', redis: '^4.7.0', mongodb: '^6.0.0'
      }
    });

    writeFile(root, 'src/a.ts', ["import { Pool } from 'pg';", "import Redis from 'redis';", "import { MongoClient } from 'mongodb';"].join('\n'));

    writeFile(root, 'src/b.ts', ["import { Pool } from 'pg';", "import Redis from 'redis';", "import { MongoClient } from 'mongodb';"].join('\n'));

    const result = executeInventory(root);

    assert.deepStrictEqual(result.functionApps[0].sharedResourceCandidates, []);
  } finally {
    cleanup(root);
  }
});

test('detecta Programming Model v4', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2'
      }
    });

    writeFile(root, 'src/functions/request-report.ts', ["const { app } = require('@azure/functions');", '', "app.http('RequestReport', {", '  handler: async () => ({ status: 200 })', '});'].join('\n'));

    const result = executeInventory(root);

    assert.strictEqual(result.functionApps[0].platform.programmingModel.value, 'v4');
  } finally {
    cleanup(root);
  }
});

test('infiere Azure Functions Runtime v4 desde extensionBundle v4', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0',
      extensionBundle: {
        id: 'Microsoft.Azure.Functions.ExtensionBundle',
        version: '[4.*, 5.0.0)'
      }
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2'
      }
    });

    const result = executeInventory(root);

    const app = result.functionApps[0];

    assert.strictEqual(app.host.extensionBundle.version, '[4.*, 5.0.0)');

    assert.strictEqual(app.platform.functionsRuntime.value, 'v4');

    assert.strictEqual(app.platform.functionsRuntime.evidenceStatus, 'INFERRED');
  } finally {
    cleanup(root);
  }
});

test('detecta estado mixed', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2'
      }
    });

    writeJson(root, 'Legacy/function.json', {
      bindings: [{
        type: 'timerTrigger', direction: 'in', name: 'timer'
      }]
    });

    writeFile(root, 'src/functions/new-function.ts', ["import { app } from '@azure/functions';", "app.timer('NewFunction', {", "  schedule: '0 */5 * * * *',", '  handler: async () => undefined', '});'].join('\n'));

    const result = executeInventory(root);

    assert.strictEqual(result.functionApps[0].platform.programmingModel.value, 'mixed');
  } finally {
    cleanup(root);
  }
});

test('detecta Durable legacy', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^1.2.3', 'durable-functions': '^1.4.6'
      }
    });

    writeJson(root, 'GenerateReport/function.json', {
      bindings: [{
        name: 'context', type: 'orchestrationTrigger', direction: 'in'
      }]
    });

    const result = executeInventory(root);

    assert.strictEqual(result.functionApps[0].durable.detected, true);

    assert.strictEqual(result.functionApps[0].functions[0].durableRole, 'ORCHESTRATOR');
  } finally {
    cleanup(root);
  }
});

test('detecta archivos sensibles sin leerlos', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2'
      }
    });

    writeFile(root, '.env', 'PASSWORD=super-secret');

    writeFile(root, 'local.settings.json', '{"Values":{"SECRET":"value"}}');

    writeFile(root, 'certificate.pfx', 'DO-NOT-READ');

    const result = executeInventory(root);

    result.sensitiveFilesDetected
      .forEach(function (entry) {
        assert.strictEqual(entry.contentRead, false);
      });

    const serialized = JSON.stringify(result);

    assert.strictEqual(serialized.includes('super-secret'), false);

    assert.strictEqual(serialized.includes('DO-NOT-READ'), false);
  } finally {
    cleanup(root);
  }
});

test('detecta GitHub Actions sin leer contenido', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2'
      }
    });

    writeFile(root, '.github/workflows/deploy.yml', ['name: deploy', 'SECRET_ENDPOINT: hidden-server'].join('\n'));

    const result = executeInventory(root);

    const workflow = result.sensitiveFilesDetected.find(function (entry) {
      return (entry.path === '.github/workflows/deploy.yml');
    });

    assert(workflow);

    assert.strictEqual(workflow.category, 'CI_CD');

    assert.strictEqual(workflow.contentRead, false);

    assert.strictEqual(JSON.stringify(result).includes('hidden-server'), false);
  } finally {
    cleanup(root);
  }
});

test('detecta varias Function Apps separadamente', function () {
  const root = createRepository();

  try {
    writeJson(root, 'app-a/host.json', {
      version: '2.0'
    });

    writeJson(root, 'app-a/package.json', {
      dependencies: {
        '@azure/functions': '^1.2.3'
      }
    });

    writeJson(root, 'app-b/host.json', {
      version: '2.0'
    });

    writeJson(root, 'app-b/package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2'
      }
    });

    const result = executeInventory(root);

    assert.strictEqual(result.functionApps.length, 2);
  } finally {
    cleanup(root);
  }
});

test('detecta usageDetected true para dependencia usada', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2', 'moment-timezone': '^0.5.33'
      }
    });

    writeFile(root, 'src/a.ts', "import moment from 'moment-timezone';");

    const result = executeInventory(root);

    const dependency = result.functionApps[0].dependencies.find(function (entry) {
      return (entry.name === 'moment-timezone');
    });

    assert(dependency);

    assert.strictEqual(dependency.usageDetected, true);
  } finally {
    cleanup(root);
  }
});

test('detecta usageDetected false para dependencia declarada sin uso', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2', uuid: '^8.3.2'
      }
    });

    writeFile(root, 'src/a.ts', "import { app } from '@azure/functions';");

    const result = executeInventory(root);

    const dependency = result.functionApps[0].dependencies.find(function (entry) {
      return (entry.name === 'uuid');
    });

    assert(dependency);

    assert.strictEqual(dependency.usageDetected, false);
  } finally {
    cleanup(root);
  }
});

test('detecta configuration key solo declarada en binding v3/legacy (sin process.env en código)', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^1.2.3'
      }
    });

    writeJson(root, 'NotifierActivity/function.json', {
      bindings: [{
        type: 'serviceBusTrigger', direction: 'in', name: 'message', topicName: 'disbursement', subscriptionName: 'notifier', connection: 'SERVICEBUS_CONNECTION_ONLY_BINDING'
      }]
    });

    writeFile(root, 'NotifierActivity/index.ts', 'export default async function () { return; }');

    const result = executeInventory(root);

    const configKey = result.functionApps[0].configurationKeys.find(function (entry) {
      return (entry.key === 'SERVICEBUS_CONNECTION_ONLY_BINDING');
    });

    assert(configKey);

    assert.strictEqual(configKey.evidenceStatus, 'CONFIRMED');

    assert(configKey.sources.some(function (source) {
      return (source.origin === 'FUNCTION_JSON_BINDING');
    }));

    assert.strictEqual(configKey.sources.some(function (source) {
      return (source.origin === 'SOURCE_CODE');
    }), false);
  } finally {
    cleanup(root);
  }
});

test('detecta configuration key solo declarada en opciones de registro v4', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2'
      }
    });

    writeFile(root, 'src/functions/notifier.ts', ["const { app } = require('@azure/functions');", '', "app.serviceBusQueue('NotifierV4', {", "  connection: 'SERVICEBUS_CONNECTION_V4_OPTION',", "  queueName: 'notify',", '  handler: async () => undefined', '});'].join('\n'));

    const result = executeInventory(root);

    const configKey = result.functionApps[0].configurationKeys.find(function (entry) {
      return (entry.key === 'SERVICEBUS_CONNECTION_V4_OPTION');
    });

    assert(configKey);

    assert.strictEqual(configKey.evidenceStatus, 'CONFIRMED');

    assert(configKey.sources.some(function (source) {
      return (source.origin === 'V4_REGISTRATION_OPTION');
    }));
  } finally {
    cleanup(root);
  }
});

test('detecta señal MISSING_AWAIT_FS_UNLINK en activity legacy', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^1.2.3'
      }
    });

    writeJson(root, 'DeleteTempFileActivity/function.json', {
      bindings: [{
        name: 'name', type: 'activityTrigger', direction: 'in'
      }]
    });

    writeFile(root, 'DeleteTempFileActivity/index.ts', ["import * as fs from 'fs';", '', 'export default async function (context: any) {', "  fs.unlink(context.bindingData.data.path, (err) => { if (err) console.error(err); });", '  return "ok";', '}'].join('\n'));

    const result = executeInventory(root);

    const fn = result.functionApps[0].functions.find(function (entry) {
      return (entry.name === 'DeleteTempFileActivity');
    });

    assert(fn);

    assert(fn.initialSignals.some(function (signal) {
      return (signal.type === 'MISSING_AWAIT_FS_UNLINK' && signal.evidenceStatus === 'CONFIRMED');
    }));
  } finally {
    cleanup(root);
  }
});

test('no marca MISSING_AWAIT_FS_UNLINK cuando fs.unlink se usa con await', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^1.2.3'
      }
    });

    writeJson(root, 'DeleteTempFileActivity/function.json', {
      bindings: [{
        name: 'name', type: 'activityTrigger', direction: 'in'
      }]
    });

    writeFile(root, 'DeleteTempFileActivity/index.ts', ["import { promises as fs } from 'fs';", '', 'export default async function (context: any) {', '  await fs.unlink(context.bindingData.data.path);', '  return "ok";', '}'].join('\n'));

    const result = executeInventory(root);

    const fn = result.functionApps[0].functions.find(function (entry) {
      return (entry.name === 'DeleteTempFileActivity');
    });

    assert(fn);

    assert.strictEqual(fn.initialSignals.some(function (signal) {
      return (signal.type === 'MISSING_AWAIT_FS_UNLINK');
    }), false);
  } finally {
    cleanup(root);
  }
});

test('detecta señal INCONSISTENT_RETRY_USAGE en orchestrator legacy', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^1.2.3', 'durable-functions': '^1.4.6'
      }
    });

    writeJson(root, 'ExportOrchestrator/function.json', {
      bindings: [{
        name: 'context', type: 'orchestrationTrigger', direction: 'in'
      }]
    });

    writeFile(root, 'ExportOrchestrator/index.ts', ["import * as df from 'durable-functions';", '', 'const orchestrator = df.orchestrator(function* (context) {', "  yield context.df.callActivityWithRetry('QueryActivity', retryOptions, input);", "  yield context.df.callActivity('ExcelActivity', input);", '});', '', 'export default orchestrator;'].join('\n'));

    const result = executeInventory(root);

    const fn = result.functionApps[0].functions.find(function (entry) {
      return (entry.name === 'ExportOrchestrator');
    });

    assert(fn);

    assert(fn.initialSignals.some(function (signal) {
      return (signal.type === 'INCONSISTENT_RETRY_USAGE' && signal.evidenceStatus === 'CONFIRMED');
    }));
  } finally {
    cleanup(root);
  }
});

test('excluye @types/* y typescript del calculo de usageDetected', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2', '@types/node': '^20.0.0'
      },
      devDependencies: {
        typescript: '^5.0.0'
      }
    });

    writeFile(root, 'src/a.ts', "import { app } from '@azure/functions';");

    const result = executeInventory(root);

    const byName = {};

    result.functionApps[0].dependencies.forEach(function (dependency) {
      byName[dependency.name] = dependency;
    });

    assert.strictEqual(byName['@types/node'].usageDetected, null);

    assert.strictEqual(byName['@types/node'].usageScopeNote, 'TYPES_OR_TOOLING');

    assert.strictEqual(byName.typescript.usageDetected, null);

    assert.strictEqual(byName.typescript.usageScopeNote, 'TYPES_OR_TOOLING');
  } finally {
    cleanup(root);
  }
});

test('genera directoryTree determinista reflejando la estructura real de carpetas', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2'
      }
    });

    writeFile(root, 'src/functions/request-report.ts', "const { app } = require('@azure/functions');");

    writeFile(root, 'src/index.js', 'module.exports = {};');

    writeFile(root, 'README.md', '# repo');

    const result = executeInventory(root);

    const tree = result.functionApps[0].directoryTree;

    assert(Array.isArray(tree));

    assert(tree.some(function (line) {
      return line.includes('src/');
    }));

    assert(tree.some(function (line) {
      return line.includes('functions/');
    }));

    assert(tree.some(function (line) {
      return line.includes('request-report.ts');
    }));

    assert(tree.some(function (line) {
      return line.includes('README.md');
    }));
  } finally {
    cleanup(root);
  }
});

test('stdout contiene JSON puro', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2'
      }
    });

    const output = childProcess.execFileSync(process.execPath, [SCRIPT, root], {
      encoding: 'utf8'
    });

    assert.doesNotThrow(function () {
      JSON.parse(output);
    });
  } finally {
    cleanup(root);
  }
});

process.stdout.write('\n' + passed + ' passed, ' + failed + ' failed\n');

if (failed > 0) {
  process.exitCode = 1;
}
