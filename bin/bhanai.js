#!/usr/bin/env node

import { parseFile } from "../src/parser.js";
import path from "path";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: chalau <file.bhn>");
  process.exit(1);
}

// Ensure the file has a .bhn extension
if (path.extname(filePath) !== ".bhn") {
  console.error("Error: Please provide a valid .bhn file.");
  process.exit(1);
}

// Attempt to parse and execute the file
parseFile(filePath)
  .then(() => {
    console.log("Execution completed successfully.");
  })
  .catch((err) => {
    console.error(`Runtime Error: ${err.message}`);
    process.exit(1);
  });
