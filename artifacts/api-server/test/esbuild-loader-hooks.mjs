import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { transformSync } from "esbuild";

const TS_EXT_CANDIDATES = [".ts", ".tsx"];

function tryResolveTs(basePath) {
  for (const ext of TS_EXT_CANDIDATES) {
    if (existsSync(basePath + ext)) return basePath + ext;
  }
  for (const ext of TS_EXT_CANDIDATES) {
    const indexPath = path.join(basePath, "index" + ext);
    if (existsSync(indexPath)) return indexPath;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
  if (isRelative && context.parentURL) {
    const parentDir = path.dirname(fileURLToPath(context.parentURL));

    // "./foo.js" referring to the ".ts" file that produces it — the codebase's
    // real convention, correct for the esbuild-bundled production build, but
    // meaningless to Node's own resolver.
    if (specifier.endsWith(".js")) {
      const jsPath = path.resolve(parentDir, specifier);
      if (!existsSync(jsPath)) {
        const tsPath = tryResolveTs(jsPath.slice(0, -3));
        if (tsPath) return { url: pathToFileURL(tsPath).href, shortCircuit: true };
      }
    } else if (!path.extname(specifier)) {
      // Extensionless "./foo" (bundler-style resolution) — try foo.ts, then
      // foo/index.ts, exactly as tsc's moduleResolution:"bundler" does.
      const basePath = path.resolve(parentDir, specifier);
      const tsPath = tryResolveTs(basePath);
      if (tsPath) return { url: pathToFileURL(tsPath).href, shortCircuit: true };
    }
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.endsWith(".ts") || url.endsWith(".tsx")) {
    const filePath = fileURLToPath(url);
    const source = readFileSync(filePath, "utf8");
    const { code } = transformSync(source, {
      loader: url.endsWith(".tsx") ? "tsx" : "ts",
      format: "esm",
      target: "node22",
      sourcefile: filePath,
    });
    return { format: "module", source: code, shortCircuit: true };
  }
  return nextLoad(url, context);
}
