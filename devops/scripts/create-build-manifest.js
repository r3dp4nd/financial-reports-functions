"use strict";

const fs = require("fs");
const path = require("path");

const outputDirectory = process.argv[2];

const artifactName = process.argv[3];

const checksumFile = process.argv[4];

if (!outputDirectory) {
  fail("Output directory is required.");
}

if (!artifactName) {
  fail("Artifact name is required.");
}

const manifest = {
  schemaVersion: 1,
  artifact: artifactName,
  checksumFile: checksumFile || null,
  nodeVersion: process.version,
  commit: process.env.BUILD_SOURCEVERSION || null,
  branch: process.env.BUILD_SOURCEBRANCH || null,
  repository: process.env.BUILD_REPOSITORY_NAME || null,
  buildId: process.env.BUILD_BUILDID || null,
  buildNumber: process.env.BUILD_BUILDNUMBER || null
};

const target = path.resolve(outputDirectory, "build-manifest.json");

fs.mkdirSync(outputDirectory, {
  recursive: true
});

fs.writeFileSync(target, JSON.stringify(manifest, null, 2), "utf8");

console.log(`Build manifest created: ${target}`);


function fail(message) {
  console.error(message);
  process.exit(1);
}
