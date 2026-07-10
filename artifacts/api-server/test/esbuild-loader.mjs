// A Node module customization hook so `node --test` can run the TypeScript
// source directly, matching how the codebase actually resolves and compiles
// it (bundler-style ".js" specifiers referring to sibling ".ts" files;
// esbuild transform for syntax Node's native type-stripping doesn't support,
// e.g. TS parameter properties). Reuses esbuild, already a devDependency of
// the production build in build.mjs — not a new dependency.
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";

register(
  pathToFileURL(path.join(import.meta.dirname, "esbuild-loader-hooks.mjs")).href,
  import.meta.url,
);
