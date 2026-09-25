import ts from "typescript";

type LiteralRoot = "guide" | "message" | "news" | "regionContent" | "regionMap";

export function readContentLiteral(
  raw: string,
  kind: LiteralRoot,
  id: string,
  path: string[],
) {
  return contentLiteral(raw, kind, id, path).node.text;
}

export function replaceContentLiteral(
  raw: string,
  kind: LiteralRoot,
  id: string,
  path: string[],
  value: string,
) {
  const { node, source } = contentLiteral(raw, kind, id, path);
  const next =
    raw.slice(0, node.getStart(source)) +
    JSON.stringify(value) +
    raw.slice(node.getEnd());
  if (readContentLiteral(next, kind, id, path) !== value)
    throw new Error("Content replacement failed validation");
  return next;
}

function contentLiteral(
  raw: string,
  kind: LiteralRoot,
  id: string,
  path: string[],
) {
  const source = ts.createSourceFile(
    `content.${kind === "message" ? "json" : "ts"}`,
    raw,
    ts.ScriptTarget.Latest,
    true,
    kind === "message" ? ts.ScriptKind.JSON : ts.ScriptKind.TS,
  );
  if (
    (source as ts.SourceFile & { parseDiagnostics: readonly ts.Diagnostic[] })
      .parseDiagnostics.length
  )
    throw new Error("Content syntax is invalid");
  let node: ts.Expression = sourceRoot(source, kind, id);
  for (const segment of path) {
    if (ts.isObjectLiteralExpression(node)) node = property(node, segment);
    else if (ts.isArrayLiteralExpression(node) && /^\d+$/.test(segment)) {
      const entry = node.elements[Number(segment)];
      if (!entry || !ts.isExpression(entry))
        throw new Error("Content index is unavailable");
      node = entry;
    } else throw new Error("Content path is unavailable");
  }
  if (!ts.isStringLiteral(node) && !ts.isNoSubstitutionTemplateLiteral(node)) {
    throw new Error("Content field is not a string literal");
  }
  return { node, source };
}

function property(node: ts.ObjectLiteralExpression, key: string) {
  const match = node.properties.find(
    (entry) =>
      ts.isPropertyAssignment(entry) && propertyName(entry.name) === key,
  );
  if (!match || !ts.isPropertyAssignment(match))
    throw new Error("Content key is unavailable");
  return match.initializer;
}

function propertyName(node: ts.PropertyName) {
  return ts.isIdentifier(node) ||
    ts.isStringLiteral(node) ||
    ts.isNumericLiteral(node)
    ? node.text
    : "";
}

function sourceRoot(
  source: ts.SourceFile,
  kind: LiteralRoot,
  id: string,
): ts.Expression {
  if (kind === "message") {
    const statement = source.statements[0];
    if (statement && ts.isExpressionStatement(statement))
      return statement.expression;
    throw new Error("Invalid messages file");
  }
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        kind === "guide" &&
        declaration.name.getText(source) === "COPY" &&
        declaration.initializer
      ) {
        return declaration.initializer;
      }
      if (
        kind === "regionContent" &&
        declaration.name.getText(source) === "regionContent" &&
        declaration.initializer &&
        ts.isObjectLiteralExpression(declaration.initializer)
      ) {
        return property(declaration.initializer, id);
      }
      if (
        kind === "regionMap" &&
        declaration.name.getText(source) === "regions" &&
        declaration.initializer &&
        ts.isArrayLiteralExpression(declaration.initializer)
      ) {
        const region = declaration.initializer.elements.find((entry) => {
          if (!ts.isObjectLiteralExpression(entry)) return false;
          const value = property(entry, "id");
          return ts.isStringLiteral(value) && value.text === id;
        });
        if (region && ts.isObjectLiteralExpression(region)) return region;
      }
      if (
        kind === "news" &&
        declaration.initializer &&
        ts.isObjectLiteralExpression(declaration.initializer)
      ) {
        try {
          const value = property(declaration.initializer, "id");
          if (ts.isStringLiteral(value) && value.text === id)
            return declaration.initializer;
        } catch {}
      }
    }
  }
  throw new Error("Content object is unavailable");
}
