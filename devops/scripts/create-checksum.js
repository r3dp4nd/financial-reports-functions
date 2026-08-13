"use strict";

const crypto = require("crypto");

const fs = require("fs");

const path = require("path");

const filePath = process.argv[2];

if (!filePath) {
  console.error("Artifact path is required.");

  process.exit(1);
}

const resolvedPath = path.resolve(filePath);

if (!fs.existsSync(resolvedPath)) {
  console.error(`Artifact does not exist: ${resolvedPath}`);

  process.exit(1);
}

const buffer = fs.readFileSync(resolvedPath);

const checksum = crypto
  .createHash("sha256")
  .update(buffer)
  .digest("hex");

const checksumPath = `${resolvedPath}.sha256`;

fs.writeFileSync(checksumPath, `${checksum}\n`, "utf8");

console.log(`SHA-256: ${checksum}`);

console.log(`Checksum file: ${checksumPath}`);
