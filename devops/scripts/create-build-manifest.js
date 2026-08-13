"use strict";

const fs = require("fs");
const path = require("path");

const outputDirectory = process.argv[2];
const artifactName = process.argv[3];
const checksumFileName = process.argv[4];

if (!outputDirectory) {
  fail("Output directory is required.");
}

if (!artifactName) {
  fail("Artifact name is required.");
}

if (!checksumFileName) {
  fail("Checksum file name is required.");
}

const checksumPath = path.resolve(outputDirectory, checksumFileName);

if (!fs.existsSync(checksumPath)) {
  fail(`Checksum file does not exist: ${checksumPath}`);
}

const sha256 = fs
  .readFileSync(checksumPath, "utf8")
  .trim();

if (!sha256) {
  fail("Checksum file is empty.");
}

const manifest = {
  schemaVersion: 1,
  artifact: artifactName,
  checksumFile: checksumFileName,
  sha256,
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

console.log(`Artifact SHA-256: ${sha256}`);

function fail(message) {
  console.error(message);
  process.exit(1);
}
