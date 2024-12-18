import runtime from "./runtime.js";

export const execute = async (command, args) => {
  switch (command) {
    case "rakha":
      if (args.length !== 2) {
        throw new Error(`rakha expects 2 arguments, got ${args.length}`);
      }
      runtime.rakha(args[0], args[1]);
      break;

    case "sadai_rakha":
      if (args.length !== 2) {
        throw new Error(`sadai_rakha expects 2 arguments, got ${args.length}`);
      }
      runtime.sadai_rakha(args[0], args[1]);
      break;

    case "bhanai":
      runtime.bhanai(...args);
      break;

    case "sodhString":
      if (args.length !== 1) {
        throw new Error(`sodhString expects 1 argument, got ${args.length}`);
      }
      return await runtime.sodhString(args[0]);

    case "sodhNumber":
      if (args.length !== 1) {
        throw new Error(`sodhNumber expects 1 argument, got ${args.length}`);
      }
      return await runtime.sodhNumber(args[0]);

    default:
      throw new Error(`Unknown command: ${command}`);
  }
};
