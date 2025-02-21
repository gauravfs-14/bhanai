#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseFile } from "../src/parser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const exampleDir = __dirname;

async function runTests() {
  const files = fs.readdirSync(exampleDir);
  const bhnFiles = files.filter((file) => file.endsWith(".bhn"));

  if (bhnFiles.length === 0) {
    console.log("No .bhn files found to test.");
    return;
  }

  for (const file of bhnFiles) {
    const filePath = path.join(exampleDir, file);
    console.log("------------------------------------------------------");
    console.log(`Testing ${filePath}:`);
    try {
      await parseFile(filePath);
      console.log(`Test passed for ${file}.`);
    } catch (err) {
      console.error(`Test failed for ${file}: ${err.message}`);
    }
  }
  console.log("------------------------------------------------------");
  console.log("All tests completed.");
}

runTests();
