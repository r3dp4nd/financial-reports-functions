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
