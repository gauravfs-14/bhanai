import readline from "node:readline/promises"; // Use readline/promises for async support
import { stdin as input, stdout as output } from "node:process";

const variables = {};
const constants = {};

const runtime = {
  // Declare a variable
  rakha: (name, value) => {
    if (constants[name]) {
      throw new Error(`Error: ${name} is a constant and cannot be changed.`);
    }
    variables[name] = value;
  },

  // Declare a constant
  sadai_rakha: (name, value) => {
    if (variables[name] || constants[name]) {
      throw new Error(`Error: ${name} is already defined.`);
    }
    constants[name] = value;
  },

  // Retrieve a variable or constant - Update this function
  get: (name) => {
    if (variables.hasOwnProperty(name)) return variables[name];
    if (constants.hasOwnProperty(name)) return constants[name];
    if (runtime.hasOwnProperty(name)) return runtime[name];
    throw new Error(`Error: Variable ${name} is not defined.`);
  },

  // Output to console
  bhanai: (...args) => {
    const output = args
      .map((arg) => {
        if (arg === null) return "null";
        if (arg === undefined) return "undefined";
        if (Array.isArray(arg)) {
          return JSON.stringify(arg); // Remove formatting for arrays
        }
        if (typeof arg === "object") {
          return JSON.stringify(arg, null, 2); // Keep pretty printing for objects
        }
        return String(arg);
      })
      .join(" ");
    console.log(output);
  },

  // Input for strings
  sodhString: async (message) => {
    const rl = readline.createInterface({ input, output });
    const answer = await rl.question(message);
    rl.close();
    return answer.trim(); // Always return a trimmed string
  },

  // Input for numbers
  sodhNumber: async (message) => {
    const rl = readline.createInterface({ input, output });
    const answer = await rl.question(message);
    rl.close();

    // Convert input to a number and validate
    const number = Number(answer);
    if (isNaN(number)) {
      throw new Error("Error: Input is not a valid number.");
    }
    return number;
  },

  // Arithmetic functions
  jod: (a, b) => a + b,
  ghata: (a, b) => a - b,
  guna: (a, b) => a * b,
  bhaag: (a, b) => {
    if (b === 0) throw new Error("Error: Division by zero.");
    return a / b;
  },
  shesh: (a, b) => a % b,

  // Logical operations
  ra: (a, b) => a && b, // Logical AND
  athawa: (a, b) => a || b, // Logical OR
  hoina: (a) => !a, // Logical NOT

  // Truthy and falsy values
  sachho: true,
  jutho: false,

  // String functions
  jodString: (str1, str2) => String(str1) + String(str2), // String concatenation
  lambai: (str) => str.length, // String length
  tola: (str, start, end) => str.substring(start, end), // Substring

  // Add more string functions
  badal: (str, oldSub, newSub) => str.replace(new RegExp(oldSub, "g"), newSub), // Replace substring
  thuloAkshar: (str) => str.toUpperCase(), // Convert to uppercase
  sanoAkshar: (str) => str.toLowerCase(), // Convert to lowercase
  chhaina: (str, searchStr) => str.includes(searchStr), // Check if a substring exists

  // New string functions
  kattnu: (str, delimiter) => str.split(delimiter), // Split string into an array
  khaliHatau: (str) => str.trim(), // Trim whitespace
  khojnu: (str, searchStr) => str.indexOf(searchStr), // Find the position of a substring

  ulto: (str) => str.split("").reverse().join(""), // Reverse a string
  thapString: (str, padStr, length) => str.padEnd(length, padStr), // Pad string on the right
  suruThap: (str, padStr, length) => str.padStart(length, padStr), // Pad string on the left
  sabdaGanna: (str) => str.trim().split(/\s+/).length, // Count words in a string

  // Array functions
  lambaiList: (arr) => {
    if (!Array.isArray(arr)) throw new Error("Not an array");
    return arr.length;
  },

  thapList: (arr, item) => {
    if (!Array.isArray(arr)) throw new Error("Not an array");
    arr.push(item);
    return arr;
  },

  hatauList: (arr) => {
    if (!Array.isArray(arr)) throw new Error("Not an array");
    return arr.pop();
  },

  // Object functions
  chaabiList: (obj) => {
    if (typeof obj !== "object" || obj === null)
      throw new Error("Not an object");
    return Object.keys(obj);
  },

  maanList: (obj) => {
    if (typeof obj !== "object" || obj === null)
      throw new Error("Not an object");
    return Object.values(obj);
  },
};

export default runtime;
