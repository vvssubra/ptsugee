import {createRequire} from "node:module";
import {dirname, resolve} from "node:path";

const require = createRequire(import.meta.url);

/**
 * Load environment files with the same precedence rules as a production Next.js
 * process. `@next/env` is resolved beside Next itself so this remains compatible
 * with both pnpm's isolated layout and a conventional node_modules directory.
 */
export function loadNextEnvironment(directory) {
  const nextDirectory = dirname(require.resolve("next/package.json"));
  const nextEnvDirectory = resolve(nextDirectory, "..", "@next", "env");
  const {loadEnvConfig} = require(nextEnvDirectory);

  loadEnvConfig(directory, false, {
    error: (...values) => console.error(...values),
    warn: (...values) => console.warn(...values),
  });
}
