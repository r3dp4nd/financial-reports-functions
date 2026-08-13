"use strict";

const fs = require("fs");
const path = require("path");

const output = process.argv[2] || "dist";

const outputPath = path.resolve(process.cwd(), output);

if (!fs.existsSync(outputPath)) {
  console.error(`Build output does not exist: ${output}`);
  process.exit(1);
}

const stat = fs.statSync(outputPath);

if (!stat.isDirectory()) {
  console.error(`Build output is not a directory: ${output}`);
  process.exit(1);
}

const files = collectFiles(outputPath);

if (files.length === 0) {
  console.error(`Build output is empty: ${output}`);
  process.exit(1);
}

console.log(`Build output validation passed: ${output}`);

console.log(`Files found: ${files.length}`);


function collectFiles(directory) {
  const entries = fs.readdirSync(directory, {
    withFileTypes: true
  });

  const result = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      result.push(...collectFiles(entryPath));

      continue;
    }

    if (entry.isFile()) {
      result.push(entryPath);
    }
  }

  return result;
}
