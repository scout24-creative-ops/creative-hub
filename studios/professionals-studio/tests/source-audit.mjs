/* Read-only engineering audit. Run: node src/tests/source-audit.mjs */
import { readFile, readdir, access } from "node:fs/promises";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const src = resolve(root, "src");
const files = await readdir(src);
const report = { syntaxChecks: 0, localReferences: 0, syntaxFailures: [], brokenLinks: [], tokenSourcesMissing: [], tokenMirrorMatches: false, notesMirrorMatches: false, inventoryMirrorMatches: false, downloadableNotesLinks: [] };

function checkSyntax(code, file) {
  const result = spawnSync(process.execPath, ["--input-type=module", "--check"], { input: code, encoding: "utf8" });
  report.syntaxChecks++;
  if (result.status !== 0) report.syntaxFailures.push({ file, error: result.stderr.trim() });
}

for (const name of files.filter(file => file.endsWith(".js"))) checkSyntax(await readFile(resolve(src, name), "utf8"), name);

for (const name of files.filter(file => file.endsWith(".html"))) {
  const text = await readFile(resolve(src, name), "utf8");
  let script = 0;
  for (const match of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const [, attrs, code] = match;
    if (/\bsrc\s*=/.test(attrs) || /\btype\s*=\s*["'](?:application\/json|text\/(?:babel|jsx))["']/i.test(attrs)) continue;
    if (code.trim()) checkSyntax(code, `${name}:script-${++script}`);
  }
  const markup = text.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, match => match.slice(0, match.indexOf(">") + 1));
  const references = [...markup.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map(match => match[1]);
  references.push(...[...markup.matchAll(/url\(\s*["']?([^"'\s)]+)["']?\s*\)/gi)].map(match => match[1]));
  for (const ref of new Set(references)) {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(ref) || /[{}<>]/.test(ref)) continue;
    const clean = decodeURIComponent(ref.split(/[?#]/)[0]);
    if (!clean) continue;
    const target = resolve(src, clean);
    report.localReferences++;
    try { await access(target); }
    catch { report.brokenLinks.push({ file: name, reference: ref }); }
  }
}

const canonical = JSON.parse(await readFile(resolve(root, "brand/tokens.json"), "utf8"));
const published = JSON.parse(await readFile(resolve(src, "brand-tokens.json"), "utf8"));
report.tokenMirrorMatches = isDeepStrictEqual(canonical, published);
function tokens(value, path = []) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  if (Object.hasOwn(value, "$value")) {
    if (typeof value.source !== "string" || !value.source.trim()) report.tokenSourcesMissing.push(path.join("."));
    return;
  }
  for (const [key, child] of Object.entries(value)) tokens(child, [...path, key]);
}
tokens(canonical);
for (const [source, publishedName, key] of [["brand/notes.md", "brand-notes.md", "notesMirrorMatches"], ["docs/brandsources.md", "brandsources.md", "inventoryMirrorMatches"]]) {
  const [sourceText, publishedText] = await Promise.all([readFile(resolve(root, source), "utf8"), readFile(resolve(src, publishedName), "utf8")]);
  const expected = source === "brand/notes.md" ? sourceText.replace(/\]\(\.\/tokens\.json(?=[#)])/g, "](./brand-tokens.json") : sourceText;
  report[key] = expected === publishedText;
  for (const match of publishedText.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const ref = match[1];
    if (/^(?:[a-z]+:|#)/i.test(ref)) continue;
    const target = resolve(src, ref.split("#")[0]);
    try { await access(target); }
    catch { report.downloadableNotesLinks.push({ file: publishedName, reference: ref, resolvesTo: relative(root, target) }); }
  }
}
console.log(JSON.stringify(report, null, 2));
if (report.syntaxFailures.length || report.brokenLinks.length || report.tokenSourcesMissing.length || report.downloadableNotesLinks.length || !report.tokenMirrorMatches || !report.notesMirrorMatches || !report.inventoryMirrorMatches) process.exitCode = 1;
