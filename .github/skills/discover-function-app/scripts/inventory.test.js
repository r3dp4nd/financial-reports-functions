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
  fs.rmSync ? fs.rmSync(root, {
    recursive: true, force: true
  }) : removeDirectoryLegacy(root);
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

    writeFile(root, 'src/request-report.ts', ['const value = process.env.REPORT_CONTAINER;', 'module.exports = value;'].join('\n'));

    const result = executeInventory(root);

    assert.strictEqual(result.functionApps.length, 1);

    const app = result.functionApps[0];

    assert.strictEqual(app.platform.programmingModel.value, 'legacy');

    assert.strictEqual(app.platform.programmingModel.evidenceStatus, 'CONFIRMED');

    assert.strictEqual(app.functions.length, 1);

    assert.strictEqual(app.functions[0].name, 'RequestReport');

    assert.deepStrictEqual(app.configurationKeys.map(function (entry) {
      return entry.key;
    }), ['REPORT_CONTAINER']);
  } finally {
    cleanup(root);
  }
});

test('inventaría todas las dependencias aunque no estén mapeadas', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2',
        '@azure/cosmos': '^4.10.0',
        pg: '^8.13.0',
        redis: '^4.7.0',
        axios: '^1.7.0',
        'some-company-sdk': '2.4.1'
      }, devDependencies: {
        typescript: '^5.9.0'
      }
    });

    const result = executeInventory(root);

    const dependencies = result.functionApps[0].dependencies;

    const names = dependencies.map(function (entry) {
      return entry.name;
    });

    assert(names.indexOf('@azure/functions') >= 0);

    assert(names.indexOf('@azure/cosmos') >= 0);

    assert(names.indexOf('pg') >= 0);

    assert(names.indexOf('redis') >= 0);

    assert(names.indexOf('axios') >= 0);

    assert(names.indexOf('some-company-sdk') >= 0);

    assert(names.indexOf('typescript') >= 0);
  } finally {
    cleanup(root);
  }
});

test('no clasifica dependencias no Azure como infraestructura en discovery', function () {
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

    const app = result.functionApps[0];

    assert.deepStrictEqual(app.azurePackageUsage, {});

    assert.deepStrictEqual(app.sharedResourceCandidates, []);
  } finally {
    cleanup(root);
  }
});

test('genera candidato solo para SDK Azure conocido', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2', '@azure/cosmos': '^4.10.0', pg: '^8.13.0'
      }
    });

    writeFile(root, 'src/a.ts', ["import { CosmosClient } from '@azure/cosmos';", "import { Pool } from 'pg';"].join('\n'));

    writeFile(root, 'src/b.ts', ["import { CosmosClient } from '@azure/cosmos';", "import { Pool } from 'pg';"].join('\n'));

    const result = executeInventory(root);

    const app = result.functionApps[0];

    assert.strictEqual(app.sharedResourceCandidates.length, 1);

    assert.strictEqual(app.sharedResourceCandidates[0].package, '@azure/cosmos');

    assert.strictEqual(app.sharedResourceCandidates[0].type, 'COSMOS_DB');

    assert.strictEqual(app.sharedResourceCandidates[0].evidenceStatus, 'INFERRED');
  } finally {
    cleanup(root);
  }
});

test('no confirma shared resource solo por usar el mismo SDK Azure', function () {
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

    writeFile(root, 'src/customer.repository.ts', ["import { CosmosClient } from '@azure/cosmos';", 'module.exports = CosmosClient;'].join('\n'));

    writeFile(root, 'src/report.repository.ts', ["import { CosmosClient } from '@azure/cosmos';", 'module.exports = CosmosClient;'].join('\n'));

    const result = executeInventory(root);

    const candidates = result.functionApps[0].sharedResourceCandidates;

    assert.strictEqual(candidates.length, 1);

    assert.strictEqual(candidates[0].evidenceStatus, 'INFERRED');

    assert.strictEqual(candidates[0].ownership, null);

    assert.deepStrictEqual(candidates[0].consumers, []);
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

    writeFile(root, 'src/functions/request-report.ts', ["const { app } = require('@azure/functions');", '', "app.http('RequestReport', {", "  methods: ['POST'],", '  handler: async () => ({ status: 200 })', '});'].join('\n'));

    const result = executeInventory(root);

    const app = result.functionApps[0];

    assert.strictEqual(app.platform.programmingModel.value, 'v4');

    assert.strictEqual(app.functions[0].name, 'RequestReport');

    assert.strictEqual(app.functions[0].trigger.type, 'httpTrigger');
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

    writeFile(root, 'src/functions/new-function.ts', ["import { app } from '@azure/functions';", '', "app.timer('NewFunction', {", "  schedule: '0 */5 * * * *',", '  handler: async () => undefined', '});'].join('\n'));

    const result = executeInventory(root);

    assert.strictEqual(result.functionApps[0].platform.programmingModel.value, 'mixed');

    assert.strictEqual(result.functionApps[0].platform.programmingModel.evidenceStatus, 'CONFIRMED');
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

    const app = result.functionApps[0];

    assert.strictEqual(app.durable.detected, true);

    assert.strictEqual(app.functions[0].durableRole, 'ORCHESTRATOR');
  } finally {
    cleanup(root);
  }
});

test('detecta Durable v4', function () {
  const root = createRepository();

  try {
    writeJson(root, 'host.json', {
      version: '2.0'
    });

    writeJson(root, 'package.json', {
      dependencies: {
        '@azure/functions': '^4.16.2', 'durable-functions': '^3.5.0'
      }
    });

    writeFile(root, 'src/functions/durable.ts', ["const df = require('durable-functions');", '', "df.app.orchestration('GenerateReport', function* (context) {", '  return yield context.df.callActivity("CreateExcel");', '});', '', "df.app.activity('CreateExcel', {", '  handler: async () => "ok"', '});'].join('\n'));

    const result = executeInventory(root);

    const functions = result.functionApps[0].functions;

    const orchestrator = functions.find(function (fn) {
      return (fn.name === 'GenerateReport');
    });

    const activity = functions.find(function (fn) {
      return (fn.name === 'CreateExcel');
    });

    assert.strictEqual(orchestrator.durableRole, 'ORCHESTRATOR');

    assert.strictEqual(activity.durableRole, 'ACTIVITY');
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

    const paths = result.sensitiveFilesDetected.map(function (entry) {
      return entry.path;
    });

    assert(paths.indexOf('.env') >= 0);

    assert(paths.indexOf('local.settings.json') >= 0);

    assert(paths.indexOf('certificate.pfx') >= 0);

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

test('detecta Azure DevOps pipeline sin leer contenido', function () {
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

    writeFile(root, 'azure-pipelines.yml', 'subscription: secret-subscription');

    const result = executeInventory(root);

    const pipeline = result.sensitiveFilesDetected.find(function (entry) {
      return (entry.path === 'azure-pipelines.yml');
    });

    assert(pipeline);

    assert.strictEqual(pipeline.contentRead, false);

    assert.strictEqual(JSON.stringify(result).includes('secret-subscription'), false);
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
      name: 'app-a', dependencies: {
        '@azure/functions': '^1.2.3'
      }
    });

    writeJson(root, 'app-a/FnA/function.json', {
      bindings: [{
        type: 'timerTrigger', direction: 'in', name: 'timer'
      }]
    });

    writeJson(root, 'app-b/host.json', {
      version: '2.0'
    });

    writeJson(root, 'app-b/package.json', {
      name: 'app-b', dependencies: {
        '@azure/functions': '^4.16.2'
      }
    });

    writeFile(root, 'app-b/src/functions/fn-b.ts', ["import { app } from '@azure/functions';", "app.http('FnB', { handler: async () => ({}) });"].join('\n'));

    const result = executeInventory(root);

    assert.strictEqual(result.functionApps.length, 2);

    const roots = result.functionApps
      .map(function (app) {
        return app.root;
      })
      .sort();

    assert.deepStrictEqual(roots, ['app-a', 'app-b']);
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

    assert.strictEqual(output.trim().startsWith('{'), true);
  } finally {
    cleanup(root);
  }
});

process.stdout.write('\n' + passed + ' passed, ' + failed + ' failed\n');

if (failed > 0) {
  process.exitCode = 1;
}
