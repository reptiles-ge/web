import type { SqlExpression, SqlValue } from "./speciesRows";

const MAX_ROWS_PER_INSERT = 40;
const MAX_STATEMENT_BYTES = 90_000;
const MAX_BOUND_VALUES = 99;
const encoder = new TextEncoder();

export type BoundStatement = { sql: string; values: SqlValue[] };

export function renderBoundInserts(
  table: string,
  columns: readonly string[],
  rows: unknown[][],
): BoundStatement[] {
  const statements: BoundStatement[] = [];
  const head = `INSERT INTO ${table} (${columns.join(", ")}) VALUES `;
  let groups: string[] = [];
  let values: SqlValue[] = [];
  for (const row of rows) {
    checkWidth(table, columns, row);
    const cells = row.map(cell);
    const rowValues = cells.flatMap((entry) => entry.values);
    if (
      groups.length > 0 &&
      values.length + rowValues.length > MAX_BOUND_VALUES
    ) {
      statements.push({ sql: `${head}${groups.join(", ")}`, values });
      groups = [];
      values = [];
    }
    groups.push(`(${cells.map((entry) => entry.sql).join(", ")})`);
    values.push(...rowValues);
  }
  if (groups.length > 0) {
    statements.push({ sql: `${head}${groups.join(", ")}`, values });
  }
  return statements;
}

export function renderLiteralInserts(
  table: string,
  columns: readonly string[],
  rows: unknown[][],
) {
  const statements: string[] = [];
  const head = `INSERT INTO ${table} (${columns.join(", ")}) VALUES `;
  let batch: string[] = [];
  let size = encoder.encode(head).length;
  for (const row of rows) {
    checkWidth(table, columns, row);
    const values = `(${row.map((entry) => inline(cell(entry))).join(", ")})`;
    const bytes = encoder.encode(values).length;
    if (
      batch.length > 0 &&
      (batch.length >= MAX_ROWS_PER_INSERT ||
        size + bytes > MAX_STATEMENT_BYTES)
    ) {
      statements.push(`${head}${batch.join(", ")};`);
      batch = [];
      size = encoder.encode(head).length;
    }
    batch.push(values);
    size += bytes + 2;
  }
  if (batch.length > 0) statements.push(`${head}${batch.join(", ")};`);
  return statements;
}

function cell(value: unknown): SqlExpression {
  if (isExpression(value)) return value;
  return { sql: "?", values: [checked(value)] };
}

function checked(value: unknown): SqlValue {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error(`Bad number ${value}`);
    return value;
  }
  if (typeof value !== "string") throw new Error(`Bad value ${String(value)}`);
  return value;
}

function checkWidth(table: string, columns: readonly string[], row: unknown[]) {
  if (row.length !== columns.length) {
    throw new Error(`${table} row has ${row.length} values`);
  }
}

function inline({ sql, values }: SqlExpression) {
  let index = 0;
  return sql.replaceAll("?", () => literal(values[index++] ?? null));
}

function isExpression(value: unknown): value is SqlExpression {
  return (
    typeof value === "object" &&
    value !== null &&
    "sql" in value &&
    "values" in value
  );
}

function literal(value: SqlValue) {
  if (value === null) return "NULL";
  if (typeof value === "number") return String(value);
  return `'${value.replaceAll("'", "''")}'`;
}
