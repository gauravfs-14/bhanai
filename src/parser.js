import { execute } from "./interpreter.js";
import runtime from "./runtime.js";
import fs from "fs/promises";

// Universal argument evaluator
const parseArgument = async (arg) => {
  arg = arg.trim();

  // Handle expressions with '+' operator
  if (arg.includes("+")) {
    const parts = await Promise.all(
      arg.split("+").map((part) => parseArgument(part.trim()))
    );

    if (parts.every((part) => typeof part === "number")) {
      return parts.reduce((a, b) => a + b, 0); // Numeric sum
    } else {
      return parts.map((part) => String(part)).join(""); // String concatenation
    }
  }

  // Handle function calls
  if (arg.endsWith(")")) {
    const funcNameMatch = arg.match(/^(\w+)\(/);
    if (funcNameMatch) {
      const funcName = funcNameMatch[1];
      const argsString = arg.slice(funcName.length + 1, -1);

      const funcArgs = [];
      let currentArg = "";
      let parenCount = 0;

      for (const char of argsString) {
        if (char === "(") parenCount++;
        if (char === ")") parenCount--;
        if (char === "," && parenCount === 0) {
          funcArgs.push(await parseArgument(currentArg));
          currentArg = "";
        } else {
          currentArg += char;
        }
      }
      if (currentArg) funcArgs.push(await parseArgument(currentArg));

      if (typeof runtime[funcName] === "function") {
        return runtime[funcName](...funcArgs);
      } else {
        throw new Error(`Error: Function ${funcName} is not defined.`);
      }
    }
  }

  // Handle string literals
  if (arg.startsWith('"') && arg.endsWith('"')) {
    return arg.slice(1, -1); // Remove quotes
  }

  // Handle numbers
  if (!isNaN(arg)) {
    return Number(arg);
  }

  // Handle variables/constants
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

  for (const char of argsString) {
    if (char === '"' && argsString[argsString.indexOf(char) - 1] !== "\\") {
      inQuotes = !inQuotes;
    }

    if (!inQuotes) {
      if (char === "(") parenCount++;
      if (char === ")") parenCount--;
      if (char === "," && parenCount === 0) {
        args.push(await parseArgument(currentArg.trim()));
        currentArg = "";
        continue;
      }
    }

    currentArg += char;
  }

  if (currentArg.trim()) {
    args.push(await parseArgument(currentArg.trim()));
  }

  await execute(command, args);
};

export const parseFile = async (filePath) => {
  const lines = (await fs.readFile(filePath, "utf-8")).split("\n");
  for (const line of lines) {
    await parseLine(line);
  }
};
