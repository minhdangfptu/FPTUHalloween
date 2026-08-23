import fs from "node:fs";
import path from "node:path";
import { parse } from "espree";
import { KEYS } from "eslint-visitor-keys";

const root = path.resolve("src");
const readableAttributeNames = new Set(["alt", "title", "placeholder", "aria-label"]);
const uiPropertyNames = new Set([
  "label", "title", "subtitle", "description", "placeholder", "emptyText",
  "emptyTitle", "helperText", "ariaLabel", "message",
]);
const technicalPatterns = [
  /^\s*$/,
  /^[-+]?\d+(?:[.,]\d+)?%?$/,
  /^(?:GET|POST|PUT|PATCH|DELETE)$/,
  /^(?:[a-z]+:)?\/\//i,
  /^[/#.]/,
  /^(?:[a-z][a-z0-9-]*)(?:\s+[a-z][a-z0-9:[\]/.%#_-]*)+$/,
  /^(?:is-[a-z-]+|page|admin|staff|text|password|open|closed|true|false)$/,
  /^[a-z][a-z0-9]*(?:[-_]+[a-z0-9]+)+$/,
  /^(?:F|PDP|FPTU|FBGC|HLW\d*|35K)$/,
  /^var\(--[a-z0-9-]+\)$/,
];

const isReadable = (value) => {
  const normalized = String(value).replace(/\s+/g, " ").trim();
  return /\p{L}/u.test(normalized) && !technicalPatterns.some((pattern) => pattern.test(normalized));
};

const listFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const target = path.join(directory, entry.name);
  if (entry.isDirectory()) return listFiles(target);
  return /\.(?:js|jsx)$/.test(entry.name) ? [target] : [];
});

const literalValue = (node) => {
  if (node?.type === "Literal" && typeof node.value === "string") return node.value;
  if (node?.type === "TemplateLiteral" && node.expressions.length === 0) return node.quasis[0]?.value?.cooked;
  return null;
};

const reports = [];
const report = (file, node, kind, value) => {
  if (value == null) return;
  if (!isReadable(value)) return;
  reports.push(`${path.relative(root, file)}:${node.loc.start.line}\t${kind}\t${String(value).replace(/\s+/g, " ").trim()}`);
};

for (const file of listFiles(root)) {
  if (file.endsWith("i18n.js") || /[\\/](?:apis|assets)[\\/]/.test(file) || /example\.jsx$/.test(file)) continue;
  const source = fs.readFileSync(file, "utf8");
  const localizedProperties = source.includes("i18n-audit: localized-properties");
  let ast;
  try {
    ast = parse(source, { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true }, loc: true });
  } catch (error) {
    console.error(`Cannot parse ${file}: ${error.message}`);
    continue;
  }

  const visit = (node) => {
    if (!node || typeof node.type !== "string") return;

    if (node.type === "JSXText") report(file, node, "jsx", node.value);
    if (node.type === "JSXAttribute" && readableAttributeNames.has(node.name?.name)) {
      report(file, node, `attr:${node.name.name}`, literalValue(node.value));
    }
    if (node.type === "JSXExpressionContainer") {
      const collectExpressionLiterals = (expression) => {
        const value = literalValue(expression);
        if (value !== null) report(file, expression, "jsx-expression", value);
        if (["ConditionalExpression", "LogicalExpression"].includes(expression?.type)) {
          collectExpressionLiterals(expression.consequent);
          collectExpressionLiterals(expression.alternate);
          collectExpressionLiterals(expression.left);
          collectExpressionLiterals(expression.right);
        }
      };
      collectExpressionLiterals(node.expression);
    }
    if (!localizedProperties && node.type === "Property" && !node.computed && uiPropertyNames.has(node.key?.name || node.key?.value)) {
      report(file, node.value, `property:${node.key?.name || node.key?.value}`, literalValue(node.value));
    }
    if (node.type === "CallExpression") {
      const callee = node.callee;
      const name = callee.type === "Identifier" ? callee.name : callee.property?.name;
      const isToastCall = callee.type === "MemberExpression" && callee.object?.name === "toast" && ["success", "error", "loading"].includes(name);
      if (["alert", "confirm", "setError", "setMessage"].includes(name) || isToastCall) {
        report(file, node.arguments[0] || node, `call:${name}`, literalValue(node.arguments[0]));
      }
    }

    for (const key of KEYS[node.type] || []) {
      const child = node[key];
      if (Array.isArray(child)) child.forEach(visit);
      else visit(child);
    }
  };
  visit(ast);
}

console.log(reports.sort().join("\n"));
console.error(`Found ${reports.length} potential user-facing literals.`);

globalThis.localStorage ??= { getItem: () => null, setItem: () => {} };
const { default: i18n } = await import("../src/i18n.js");
const flattenKeys = (value, prefix = "", result = []) => {
  for (const [key, nestedValue] of Object.entries(value || {})) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (nestedValue && typeof nestedValue === "object" && !Array.isArray(nestedValue)) {
      flattenKeys(nestedValue, fullKey, result);
    } else {
      result.push(fullKey);
    }
  }
  return result;
};
const viKeys = flattenKeys(i18n.getResourceBundle("vi", "translation"));
const enKeys = flattenKeys(i18n.getResourceBundle("en", "translation"));
const missingEnglish = viKeys.filter((key) => !enKeys.includes(key));
const missingVietnamese = enKeys.filter((key) => !viKeys.includes(key));

if (missingEnglish.length || missingVietnamese.length) {
  console.error("Missing English keys:", missingEnglish);
  console.error("Missing Vietnamese keys:", missingVietnamese);
} else {
  console.error(`Translation key parity passed (${viKeys.length} keys per language).`);
}

if (reports.length || missingEnglish.length || missingVietnamese.length) {
  process.exitCode = 1;
}
