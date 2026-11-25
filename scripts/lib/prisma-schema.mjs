// Tiny line-by-line parser for prisma/schema.prisma.
// Shared by scripts/erd.mjs and scripts/class-diagram.mjs.
//
// It is NOT a full Prisma parser. It only understands the simple style used in
// this project: `model X { ... }` and `enum X { ... }` blocks, one field per
// line, and `//` or `///` comments.

import fs from "node:fs";

/**
 * Read a schema file and return { models, enums }.
 *
 * models: [{ name, fields: [{ name, type, optional, isList, isId, isUnique,
 *                             relation }] }]
 *   - `type` is the bare type name (no `?` or `[]`).
 *   - `relation` is null, or { fields: [...], references: [...], onDelete }
 *     when the field carries @relation(fields: ...).
 * enums: [{ name, values: ["A", "B"] }]
 */
export function parseSchema(schemaPath) {
  const lines = fs.readFileSync(schemaPath, "utf8").split("\n");
  const models = [];
  const enums = [];

  let current = null; // the block we are inside of, or null

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Start of a block: "model User {" or "enum Category {"
    const start = line.match(/^(model|enum)\s+(\w+)\s*\{$/);
    if (start) {
      current = { kind: start[1], name: start[2], fields: [], values: [] };
      continue;
    }

    // Lines outside blocks (generator, datasource, ...) are ignored.
    if (!current) continue;

    if (line === "}") {
      if (current.kind === "model") models.push({ name: current.name, fields: current.fields });
      else enums.push({ name: current.name, values: current.values });
      current = null;
      continue;
    }

    // Skip blank lines, comments and block attributes such as @@index.
    if (line === "" || line.startsWith("//") || line.startsWith("@@")) continue;

    if (current.kind === "enum") {
      current.values.push(line.split(/\s+/)[0]);
      continue;
    }

    current.fields.push(parseField(line));
  }

  return { models, enums };
}

// Parse one model field line, e.g.
//   authorId String @id @default(cuid())
function parseField(line) {
  // Drop a trailing "// comment" so it cannot confuse the checks below.
  const code = line.split("//")[0].trim();
  const [name, rawType, ...rest] = code.split(/\s+/);
  const attrs = rest.join(" ");

  let relation = null;
  const rel = attrs.match(/@relation\(([^)]*)\)/);
  if (rel) {
    const fieldsMatch = rel[1].match(/fields:\s*\[([^\]]*)\]/);
    const refsMatch = rel[1].match(/references:\s*\[([^\]]*)\]/);
    const onDeleteMatch = rel[1].match(/onDelete:\s*(\w+)/);
    relation = {
      fields: fieldsMatch ? splitList(fieldsMatch[1]) : [],
      references: refsMatch ? splitList(refsMatch[1]) : [],
      onDelete: onDeleteMatch ? onDeleteMatch[1] : null,
    };
  }

  return {
    name,
    type: rawType.replace("?", "").replace("[]", ""),
    optional: rawType.endsWith("?"),
    isList: rawType.endsWith("[]"),
    isId: attrs.includes("@id"),
    isUnique: attrs.includes("@unique"),
    relation,
  };
}

function splitList(text) {
  return text.split(",").map((item) => item.trim()).filter(Boolean);
}
