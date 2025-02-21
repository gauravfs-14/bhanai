import { execute } from "./interpreter.js";
import runtime from "./runtime.js";
import fs from "fs/promises";

// Universal argument evaluator
const parseArgument = async (arg) => {
  if (typeof arg === "object" && arg !== null) {
    return arg; // If already an object, return as-is
  }

  arg = arg.trim();

  // Handle string literals first
  if (arg.startsWith('"') && arg.endsWith('"')) {
    return arg.slice(1, -1);
  }

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

  // Handle array literals - Update this section
  if (arg.startsWith("[") && arg.endsWith("]")) {
    const arrayContent = arg.slice(1, -1).trim();
    if (!arrayContent) return [];

    const parsed = [];
    let currentItem = "";
    let depth = 0;
    let inQuotes = false;

    for (let i = 0; i < arrayContent.length; i++) {
      const char = arrayContent[i];

      if (char === '"' && arrayContent[i - 1] !== "\\") {
        inQuotes = !inQuotes;
      }

      if (!inQuotes) {
        if (char === "{" || char === "[") depth++;
        if (char === "}" || char === "]") depth--;

        if (char === "," && depth === 0) {
          if (currentItem.trim()) {
            parsed.push(await parseArgument(currentItem.trim()));
          }
          currentItem = "";
          continue;
        }
      }

      currentItem += char;
    }

    if (currentItem.trim()) {
      parsed.push(await parseArgument(currentItem.trim()));
    }

    return parsed;
  }

  // Handle object literals - Update this section
  if (arg.startsWith("{") && arg.endsWith("}")) {
    const objectContent = arg.slice(1, -1).trim();
    if (!objectContent) return {};

    const obj = {};
    let currentKey = "";
    let currentValue = "";
    let depth = 0;
    let inQuotes = false;
    let parsingKey = true;

    for (let i = 0; i < objectContent.length; i++) {
      const char = objectContent[i];

      if (char === '"' && objectContent[i - 1] !== "\\") {
        inQuotes = !inQuotes;
        if (parsingKey) currentKey += char;
        else currentValue += char;
        continue;
      }

      if (!inQuotes) {
        if (char === "{" || char === "[") depth++;
        if (char === "}" || char === "]") depth--;

        if (char === ":" && depth === 0 && parsingKey) {
          currentKey = currentKey.trim();
          if (currentKey.startsWith('"') && currentKey.endsWith('"')) {
            currentKey = currentKey.slice(1, -1);
          }
          parsingKey = false;
          continue;
        }

        if (char === "," && depth === 0) {
          const parsedValue = await parseArgument(currentValue.trim());
          obj[currentKey] = parsedValue;
          currentKey = "";
          currentValue = "";
          parsingKey = true;
          continue;
        }
      }

      if (parsingKey) currentKey += char;
      else currentValue += char;
    }

    if (currentKey && currentValue.trim()) {
      const parsedValue = await parseArgument(currentValue.trim());
      obj[currentKey] = parsedValue;
    }

    return obj;
  }

  // Handle complex property/array access
  const complexAccess = arg.match(/^(\w+)((?:\.\w+|\[\d+\])+)$/);
  if (complexAccess) {
    const [_, baseVar, path] = complexAccess;
    let result = await runtime.get(baseVar);

    // Extract all property accesses and array indices
    const accessors = path.match(/\.(\w+)|\[(\d+)\]/g);

    for (const accessor of accessors) {
      if (accessor.startsWith(".")) {
        // Property access
        const prop = accessor.slice(1);
        if (!result || typeof result !== "object") {
          throw new Error(`Cannot access property ${prop} of non-object`);
        }
        result = result[prop];
      } else {
        // Array access
        const index = parseInt(accessor.slice(1, -1));
        if (!Array.isArray(result)) {
          throw new Error(`Cannot use array index on non-array`);
        }
        if (index < 0 || index >= result.length) {
          throw new Error(`Array index ${index} out of bounds`);
        }
        result = result[index];
      }

      if (result === undefined) {
        throw new Error(`Invalid property/index access: ${accessor}`);
      }
    }

    return result;
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

// Update the parseLine function's argument handling
const parseLine = async (line) => {
  line = line.trim();
  if (!line) return;

  // Handle comments
  const commentIndex = Math.min(
    ...["#", "tippani"].map((marker) =>
      line.indexOf(marker) >= 0 ? line.indexOf(marker) : Infinity
    )
  );
  if (commentIndex !== Infinity) {
    line = line.slice(0, commentIndex).trim();
  }
  if (!line) return;

  // Match and parse commands with better array access handling
  const commandMatch = line.match(/^(\w+)\((.*)\)$/);
  if (!commandMatch) {
    throw new Error(`Syntax Error: Unable to parse line: ${line}`);
  }

  const command = commandMatch[1];
  const argsString = commandMatch[2];

  // Parse arguments with array access awareness
  const args = [];
  let currentArg = "";
  let depth = 0;
  let inQuotes = false;

  for (let i = 0; i < argsString.length; i++) {
    const char = argsString[i];

    if (char === '"' && argsString[i - 1] !== "\\") {
      inQuotes = !inQuotes;
    }

    if (!inQuotes) {
      if (char === "{" || char === "[") depth++;
      if (char === "}" || char === "]") depth--;

      if (char === "," && depth === 0) {
        if (currentArg.trim()) {
          args.push(await parseArgument(currentArg.trim()));
        }
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
  let multilineBuffer = "";
  let openBraces = 0;
  let openBrackets = 0;
  let inQuotes = false;

  while (i < lines.length) {
    let line = lines[i].trim();

    // Handle multi-line comments
    if (line.startsWith('"""')) {
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
      line = line.slice(0, commentIndex).trim();
    }

    if (!line) {
      i++;
      continue;
    }

    // Count braces and brackets, respecting quotes
    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"' && line[j - 1] !== "\\") {
        inQuotes = !inQuotes;
        continue;
      }

      if (!inQuotes) {
        if (char === "{") openBraces++;
        if (char === "}") openBraces--;
        if (char === "[") openBrackets++;
        if (char === "]") openBrackets--;
      }
    }

    // Accumulate multi-line object/array
    if (openBraces > 0 || openBrackets > 0) {
      multilineBuffer += line + " ";
      i++;
      continue;
    } else if (multilineBuffer) {
      // Process complete multi-line statement
      line = multilineBuffer + line;
      multilineBuffer = "";
      inQuotes = false;
    }

    // Process the line
    if (!line.startsWith("yadi ")) {
      await parseLine(line);
    } else {
      // Handle yadi blocks
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
    i++;
  }
};
