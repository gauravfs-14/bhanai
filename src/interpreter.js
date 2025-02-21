import runtime from "./runtime.js";

export const execute = async (command, args) => {
  switch (command) {
    case "rakha":
      if (args.length !== 2) {
        throw new Error(`rakha expects 2 arguments, got ${args.length}`);
      }
      // Allow direct object/array assignment
      runtime.rakha(String(args[0]), args[1]);
      break;

    case "bhanai":
      runtime.bhanai(...args);
      break;

    case "sadai_rakha":
      if (args.length !== 2) {
        throw new Error(`sadai_rakha expects 2 arguments, got ${args.length}`);
      }
      runtime.sadai_rakha(args[0], args[1]);
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

    // Array manipulation commands
    case "thapList":
      if (args.length !== 2) {
        throw new Error(`thapList expects 2 arguments, got ${args.length}`);
      }
      return runtime.thapList(args[0], args[1]);

    case "hatauList":
      if (args.length !== 1) {
        throw new Error(`hatauList expects 1 argument, got ${args.length}`);
      }
      return runtime.hatauList(args[0]);

    case "lambaiList":
      if (args.length !== 1) {
        throw new Error(`lambaiList expects 1 argument, got ${args.length}`);
      }
      return runtime.lambaiList(args[0]);

    // Object manipulation commands
    case "chaabiList":
      if (args.length !== 1) {
        throw new Error(`chaabiList expects 1 argument, got ${args.length}`);
      }
      return runtime.chaabiList(args[0]);

    case "maanList":
      if (args.length !== 1) {
        throw new Error(`maanList expects 1 argument, got ${args.length}`);
      }
      return runtime.maanList(args[0]);

    default:
      throw new Error(`Unknown command: ${command}`);
  }
};
