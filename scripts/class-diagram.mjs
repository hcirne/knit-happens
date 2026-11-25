// Generates docs/architecture/class-diagram.md (a Mermaid class diagram) from
// the source code. Run it with:  npm run docs:classes
//
// The diagram is split into the three MVC regions used in the architecture doc:
//   Model      Prisma models + the helper modules in src/lib
//   View       pages, layouts and *Form components in src/app
//   Controller API route handlers (src/app/api/**/route.js)
//
// Arrows (A ..> B) mean "A imports B", plus "A uses the Prisma model B"
// when a file calls prisma.<model>.something().

import fs from "node:fs";
import path from "node:path";
import { parseSchema } from "./lib/prisma-schema.mjs";

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "src");
const { models } = parseSchema(path.join(root, "prisma/schema.prisma"));

// ---------- helpers ----------

// Return every .js file under a folder, as paths relative to the project root
// (always with "/" separators, sorted so the output is stable).
function findJsFiles(dir) {
  let found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found = found.concat(findJsFiles(full));
    else if (entry.name.endsWith(".js")) found.push(path.relative(root, full).split(path.sep).join("/"));
  }
  return found.sort();
}

// "auth/login" -> "AuthLogin". Non-alphanumeric characters are dropped because
// Mermaid class names must be alphanumeric.
function pascalCase(text) {
  return text
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
}

// Folder of a file below src/app, as a list of path segments.
// "src/app/account/page.js" -> ["account"]
function routeSegments(file) {
  return path.posix.dirname(file).replace(/^src\/app\/?/, "").split("/").filter(Boolean);
}

// ---------- scan the source tree ----------

const files = findJsFiles(srcDir);
const classes = []; // { name, region, file, attributes: [], methods: [], path? }

for (const file of files) {
  const base = path.posix.basename(file);
  const source = fs.readFileSync(path.join(root, file), "utf8");

  if (file.startsWith("src/lib/")) {
    const { attributes, methods } = readExports(source);
    classes.push({ name: pascalCase(base.replace(".js", "")) + "Lib", region: "Model", file, attributes, methods });
  } else if (/^src\/app\/api\/.*\/route\.js$/.test(file)) {
    const segments = routeSegments(file).slice(1); // drop the leading "api"
    const methods = readExports(source).methods.filter((m) => /^(GET|POST|PUT|PATCH|DELETE)\(\)$/.test(m));
    classes.push({
      name: pascalCase(segments.join("/")) + "Route",
      region: "Controller",
      file,
      attributes: [],
      methods,
      urlPath: "/api/" + segments.join("/"),
    });
  } else if (base === "page.js" || base === "layout.js") {
    const segments = routeSegments(file);
    let name;
    if (base === "layout.js") name = (segments.length === 0 ? "Root" : pascalCase(segments.join("/"))) + "Layout";
    else name = (segments.length === 0 ? "Home" : pascalCase(segments.join("/"))) + "Page";
    classes.push({ name, region: "View", file, attributes: [], methods: [] });
  } else if (base.endsWith("Form.js")) {
    classes.push({ name: pascalCase(base.replace(".js", "")), region: "View", file, attributes: [], methods: [] });
  }
}

// Model classes come from the Prisma schema: scalar fields only (no relations).
const modelNames = models.map((m) => m.name);
for (const model of models) {
  const attributes = model.fields
    .filter((f) => !modelNames.includes(f.type))
    .map((f) => `${f.type} ${f.name}`);
  classes.push({ name: model.name, region: "Model", file: null, attributes, methods: [] });
}

// Two classes with the same name would silently merge in Mermaid, so fail loudly.
const seen = new Set();
for (const c of classes) {
  if (seen.has(c.name)) throw new Error(`Duplicate class name: ${c.name}`);
  seen.add(c.name);
}

// Find the exported names of a module. Functions become methods "name()",
// constants become attributes.
function readExports(source) {
  const attributes = [];
  const methods = [];
  for (const line of source.split("\n")) {
    const fn = line.match(/^export (?:async )?function (\w+)/);
    const constant = line.match(/^export const (\w+)\s*=(.*)/);
    if (fn) {
      methods.push(`${fn[1]}()`);
    } else if (constant) {
      // `export const x = (a) => ...` is really a function.
      const isArrowFunction = /=>/.test(constant[2]) || /\bfunction\b/.test(constant[2]);
      if (isArrowFunction) methods.push(`${constant[1]}()`);
      else attributes.push(constant[1]);
    }
  }
  return { attributes, methods };
}

// ---------- arrows ----------

// Turn an import path into a scanned file, or null for external packages.
function resolveImport(fromFile, specifier) {
  let target;
  if (specifier.startsWith("@/")) target = "src/" + specifier.slice(2);
  else if (specifier.startsWith(".")) target = path.posix.join(path.posix.dirname(fromFile), specifier);
  else return null; // "next/server", "bcryptjs", "node:crypto", ...
  return [target, target + ".js"].find((candidate) => files.includes(candidate)) ?? null;
}

const classByFile = new Map(classes.filter((c) => c.file).map((c) => [c.file, c]));
const arrows = new Set();

for (const from of classes) {
  if (!from.file) continue; // Prisma model classes import nothing
  const source = fs.readFileSync(path.join(root, from.file), "utf8");

  // Internal imports.
  for (const match of source.matchAll(/^import .*? from ["']([^"']+)["']/gm)) {
    const targetFile = resolveImport(from.file, match[1]);
    const to = targetFile && classByFile.get(targetFile);
    if (to && to !== from) arrows.add(`${from.name} ..> ${to.name}`);
  }

  // Use of a Prisma model, e.g. prisma.user.findUnique(...) -> User.
  // The prisma module itself only creates the client, so it is skipped.
  if (from.file === "src/lib/prisma.js") continue;
  for (const model of modelNames) {
    const accessor = model[0].toLowerCase() + model.slice(1);
    if (new RegExp(`\\bprisma\\.${accessor}\\b`).test(source)) arrows.add(`${from.name} ..> ${model}`);
  }
}

// ---------- write the Markdown ----------

const out = ["classDiagram"];
for (const region of ["Model", "View", "Controller"]) {
  out.push(`    namespace ${region} {`);
  for (const c of classes.filter((item) => item.region === region)) {
    // A class with no members is written without braces; some Mermaid
    // versions reject an empty "{ }" body.
    if (c.attributes.length === 0 && c.methods.length === 0) {
      out.push(`        class ${c.name}`);
      continue;
    }
    out.push(`        class ${c.name} {`);
    for (const attribute of c.attributes) out.push(`            +${attribute}`);
    for (const method of c.methods) out.push(`            +${method}`);
    out.push("        }");
  }
  out.push("    }");
}
// Relationships and notes go outside the namespace blocks.
for (const c of classes.filter((item) => item.urlPath)) out.push(`    note for ${c.name} "${c.urlPath}"`);
out.push(...[...arrows].sort().map((arrow) => `    ${arrow}`));

const output = [
  "# Class diagram",
  "",
  "This file is auto-generated by `npm run docs:classes` from the code in `src/` and `prisma/schema.prisma`. Do not edit it by hand.",
  "",
  "```mermaid",
  ...out,
  "```",
  "",
].join("\n");

const outFile = path.join(root, "docs/architecture/class-diagram.md");
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, output);
console.log("Wrote docs/architecture/class-diagram.md");
