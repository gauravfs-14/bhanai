import { execute } from "./interpreter.js";
import runtime from "./runtime.js";
import fs from "fs";

// Universal argument evaluator
const parseArgument = (arg) => {
  arg = arg.trim();

  // Handle expressions with '+' operator
  if (arg.includes("+")) {
    const parts = arg.split("+").map((part) => parseArgument(part.trim()));
    // If all parts are numbers, sum them
    if (parts.every((part) => typeof part === "number")) {
      return parts.reduce((a, b) => a + b, 0);
    } else {
      // Otherwise, concatenate as strings
      return parts.map((part) => String(part)).join("");
    }
  }

  // Check for function calls with nested arguments
  if (arg.endsWith(")")) {
    const funcNameMatch = arg.match(/^(\w+)\(/);
    if (funcNameMatch) {
      const funcName = funcNameMatch[1];
      const argsString = arg.slice(funcName.length + 1, -1);

      const funcArgs = [];
      let currentArg = "";
      let parenCount = 0;
      for (let char of argsString) {
        if (char === "(") parenCount++;
        if (char === ")") parenCount--;
        if (char === "," && parenCount === 0) {
          funcArgs.push(parseArgument(currentArg));
          currentArg = "";
        } else {
          currentArg += char;
        }
      }
      if (currentArg) funcArgs.push(parseArgument(currentArg));

      if (typeof runtime[funcName] === "function") {
        return runtime[funcName](...funcArgs);
      } else {
        throw new Error(`Error: Function ${funcName} is not defined.`);
      }
    }
  }

  // Step 2: Check if it's a string literal
  if (arg.startsWith('"') && arg.endsWith('"')) {
    return arg.slice(1, -1); // Remove quotes
  }

  // Step 3: Check if it's a number
  if (!isNaN(arg)) {
    return Number(arg);
  }

  // Step 4: Treat as a variable or constant
  return runtime.get(arg);
};

const parseLine = async (line) => {
  line = line.trim();
  if (!line || line.startsWith("tippani")) return;

  const commandMatch = line.match(/^(\w+)\((.*)\)$/);
  if (!commandMatch) {
    throw new Error(`Syntax Error: Unable to parse line: ${line}`);
  }

  const command = commandMatch[1];
  const argsString = commandMatch[2];

  const args = [];
  let currentArg = "";
  let parenCount = 0;
  let inQuotes = false;

  for (let i = 0; i < argsString.length; i++) {
    const char = argsString[i];

    if (char === '"' && argsString[i - 1] !== "\\") {
      inQuotes = !inQuotes;
    }

    if (!inQuotes) {
      if (char === "(") parenCount++;
      if (char === ")") parenCount--;
      if (char === "," && parenCount === 0) {
        args.push(parseArgument(currentArg.trim()));
        currentArg = "";
        continue;
      }
    }

    currentArg += char;
  }

  if (currentArg.trim()) {
    args.push(parseArgument(currentArg.trim()));
  }

  await execute(command, args);
};

export const parseFile = async (filePath) => {
  const lines = fs.readFileSync(filePath, "utf-8").split("\n");
  for (const line of lines) {
    await parseLine(line);
  }
};
