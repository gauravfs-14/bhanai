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

  // Retrieve a variable or constant
  get: (name) => {
    if (variables[name] !== undefined) return variables[name];
    if (constants[name] !== undefined) return constants[name];
    throw new Error(`Error: Variable ${name} is not defined.`);
  },

  // Output to console
  bhanai: (...args) => {
    // Trim each argument and ensure clean concatenation
    const output = args.map((arg) => String(arg).trim()).join(" ");
    console.log(output);
  },

  // Console input
  sodh: async (message) => {
    const rl = readline.createInterface({ input, output });
    const answer = await rl.question(message);
    rl.close();
    return answer;
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
};

export default runtime;
