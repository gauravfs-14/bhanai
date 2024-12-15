import { execute } from "./interpreter.js";
import runtime from "./runtime.js";
import fs from "fs/promises";

// Universal argument evaluator
const parseArgument = async (arg) => {
  arg = arg.trim();

  // Handle logical NOT (hoina)
  if (arg.startsWith("hoina(") && arg.endsWith(")")) {
    const inner = arg.slice(6, -1).trim();
    return runtime.hoina(await parseArgument(inner));
  }

  // Handle logical expressions (AND/OR)
  if (arg.includes(" ra ") || arg.includes(" athawa ")) {
    const parts = arg.split(/ ra | athawa /g);
    const operators = arg.match(/ ra | athawa /g);

    let result = await parseArgument(parts[0].trim());
    for (let i = 0; i < operators.length; i++) {
      const operator = operators[i].trim();
      const nextValue = await parseArgument(parts[i + 1].trim());
      if (operator === "ra") {
        result = runtime.ra(result, nextValue);
      } else if (operator === "athawa") {
        result = runtime.athawa(result, nextValue);
      }
    }
    return result;
  }

  // Handle comparisons (e.g., age < 18)
  const comparisonMatch = arg.match(/(.+?)\s*(==|!=|<=|>=|<|>)\s*(.+)/);
  if (comparisonMatch) {
    const left = await parseArgument(comparisonMatch[1].trim());
    const operator = comparisonMatch[2].trim();
    const right = await parseArgument(comparisonMatch[3].trim());

    switch (operator) {
      case "==":
        return left === right;
      case "!=":
        return left !== right;
      case "<":
        return left < right;
      case ">":
        return left > right;
      case "<=":
        return left <= right;
      case ">=":
        return left >= right;
      default:
        throw new Error(`Invalid comparison operator: ${operator}`);
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

// Parse a single line of code
const parseLine = async (line) => {
  line = line.trim();

  // Ignore empty lines
  if (!line) return;

  // Handle inline comments with # or tippani
  const commentIndex = Math.min(
    ...["#", "tippani"].map((marker) =>
      line.indexOf(marker) >= 0 ? line.indexOf(marker) : Infinity
    )
  );
  if (commentIndex !== Infinity) {
    line = line.slice(0, commentIndex).trim(); // Remove the inline comment
  }

  // Ignore the line if it's now empty after removing comments
  if (!line) return;

  // Match and parse commands
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

// Update the parseBlock function to correctly capture indented blocks
const parseBlock = (lines, startIndex, currentIndent) => {
  const blockLines = [];
  let currentIndex = startIndex;

  while (currentIndex < lines.length) {
    const line = lines[currentIndex];
    const lineIndent = line.search(/\S/);

    if (lineIndent <= currentIndent) break;
    blockLines.push(line);
    currentIndex++;
  }

  return { blockLines, nextIndex: currentIndex };
};

// Modify the parseFile function to fix the 'nextIndex' scope issue
export const parseFile = async (filePath) => {
  const lines = (await fs.readFile(filePath, "utf-8")).split("\n");
  let isInsideMultilineComment = false;
  let skipNextElse = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle multi-line comments
    if (line.trim().startsWith('"""')) {
      isInsideMultilineComment = !isInsideMultilineComment;
      continue;
    }
    if (isInsideMultilineComment) continue;

    // Remove inline comments
    const commentIndex = Math.min(
      ...["#", "tippani"].map((marker) =>
        line.indexOf(marker) >= 0 ? line.indexOf(marker) : Infinity
      )
    );
    if (commentIndex !== Infinity) {
      line = line.slice(0, commentIndex);
    }

    line = line.trim();
    if (!line) continue;

    // Handle conditions
    if (line.startsWith("yadi ") && line.endsWith(":")) {
      const conditionStr = line.slice(5, -1).trim();
      const condition = await parseArgument(conditionStr);
      const currentIndent = lines[i].search(/\S/);
      const { blockLines, nextIndex } = parseBlock(lines, i + 1, currentIndent);

      if (condition) {
        for (const blockLine of blockLines) {
          await parseLine(blockLine);
        }
        skipNextElse = true; // Skip the next 'aru' block
      } else {
        skipNextElse = false;
      }
      i = nextIndex - 1;
      continue;
    } else if (line.startsWith("aru:")) {
      const currentIndent = lines[i].search(/\S/);
      const { blockLines, nextIndex } = parseBlock(lines, i + 1, currentIndent);

      if (!skipNextElse) {
        // Execute the 'aru' block
        for (const blockLine of blockLines) {
          await parseLine(blockLine);
        }
      }
      skipNextElse = false; // Reset after handling 'aru'
      i = nextIndex - 1;
      continue;
    }

    // Parse the line as a command
    await parseLine(line);
  }
};
