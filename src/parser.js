import { execute } from "./interpreter.js";
import runtime from "./runtime.js";
import fs from "fs/promises";

// Universal argument evaluator
const parseArgument = async (arg) => {
  arg = arg.trim();

  // Handle expressions with '+' operator
  if (arg.includes("+")) {
    const tokens = [];
    let currentToken = "";
    let inQuotes = false;
    let parenCount = 0;

    for (let i = 0; i < arg.length; i++) {
      const char = arg[i];

      if (char === '"' && arg[i - 1] !== "\\") {
        inQuotes = !inQuotes;
      }

      if (!inQuotes) {
        if (char === "(") parenCount++;
        if (char === ")") parenCount--;
        if (char === "+" && parenCount === 0) {
          tokens.push(await parseArgument(currentToken.trim()));
          currentToken = "";
          continue;
        }
      }

      currentToken += char;
    }

    if (currentToken.trim()) {
      tokens.push(await parseArgument(currentToken.trim()));
    }

    // Sum numbers or concatenate strings
    if (tokens.every((token) => typeof token === "number")) {
      return tokens.reduce((a, b) => a + b, 0);
    } else {
      return tokens.map((token) => String(token)).join("");
    }
  }

  // Handle function calls
  const functionMatch = arg.match(/^(\w+)\((.*)\)$/);
  if (functionMatch) {
    const funcName = functionMatch[1];
    const argsString = functionMatch[2];

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

    if (typeof runtime[funcName] === "function") {
      return await runtime[funcName](...args);
    } else {
      throw new Error(`Error: Function ${funcName} is not defined.`);
    }
  }

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
  let i = 0;

  while (i < lines.length) {
    let line = lines[i];

    // Handle multi-line comments
    if (line.trim().startsWith('"""')) {
      isInsideMultilineComment = !isInsideMultilineComment;
      i++;
      continue;
    }
    if (isInsideMultilineComment) {
      i++;
      continue;
    }

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
    if (!line) {
      i++;
      continue;
    }

    // Handle conditions
    if (line.startsWith("yadi ") && line.endsWith(":")) {
      let conditionMet = false;
      while (i < lines.length) {
        line = lines[i].trim();

        if (
          (line.startsWith("yadi ") || line.startsWith("athawa ")) &&
          line.endsWith(":")
        ) {
          // 'yadi' or 'athawa' clause
          let conditionStr;
          if (line.startsWith("yadi ")) {
            conditionStr = line.slice(5, -1).trim();
          } else {
            conditionStr = line.slice(7, -1).trim();
          }
          const condition = await parseArgument(conditionStr);
          const currentIndent = lines[i].search(/\S/);
          const { blockLines, nextIndex } = parseBlock(
            lines,
            i + 1,
            currentIndent
          );

          if (condition && !conditionMet) {
            for (const blockLine of blockLines) {
              await parseLine(blockLine);
            }
            conditionMet = true;
          }

          i = nextIndex;
        } else if (line.startsWith("aru:")) {
          // 'aru' clause
          const currentIndent = lines[i].search(/\S/);
          const { blockLines, nextIndex } = parseBlock(
            lines,
            i + 1,
            currentIndent
          );

          if (!conditionMet) {
            for (const blockLine of blockLines) {
              await parseLine(blockLine);
            }
          }

          i = nextIndex;
          break;
        } else {
          // No more clauses
          break;
        }
      }
      continue;
    }

    // Parse the line as a command
    await parseLine(line);
    i++;
  }
};
