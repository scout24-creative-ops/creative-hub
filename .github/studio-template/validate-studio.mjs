import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const templateDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(templateDirectory, "../..");
const requiredGuidelineIds = [
  "overview",
  "audience-jobs",
  "principles",
  "language-terminology",
  "visual-system",
  "components-interaction",
  "templates-output-specifications",
  "ai-automation-rules",
  "quality-assurance",
  "ownership-changelog",
];
const workflowStates = ["empty", "planned", "in-development", "testing", "available", "paused", "retired"];
const nonLaunchStates = ["empty", "planned", "in-development", "paused", "retired"];
const placeholderPattern = /\[(?:Development placeholder|Entwicklungsplatzhalter)\]/i;

function isObject(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
function collectStrings(value, output = []) {
  if (typeof value === "string") output.push(value);
  else if (Array.isArray(value)) value.forEach((entry) => collectStrings(entry, output));
  else if (isObject(value)) Object.values(value).forEach((entry) => collectStrings(entry, output));
  return output;
}
function localized(value, field, errors) {
  if (!isObject(value)) { errors.push(`${field} must contain en and de.`); return; }
  ["en", "de"].forEach((locale) => {
    if (typeof value[locale] !== "string" || !value[locale].trim()) errors.push(`${field}.${locale} is required.`);
  });
}
function safeAction(action, field, errors) {
  if (!isObject(action)) { errors.push(`${field} must be an action object.`); return; }
  if (typeof action.url !== "string" || !action.url.trim()) errors.push(`${field}.url is required.`);
  else if (!/^https:\/\//i.test(action.url) && (/^[a-z][a-z0-9+.-]*:/i.test(action.url) || /^\/\//.test(action.url))) errors.push(`${field}.url must be HTTPS or relative.`);
  if (!["same-tab", "new-tab"].includes(action.openMode)) errors.push(`${field}.openMode is invalid.`);
}

export function validateManifest(manifest, { release = false, manifestPath } = {}) {
  const errors = [];
  if (!isObject(manifest)) return ["Manifest must be an object."];
  if (manifest.schemaVersion !== 1) errors.push("schemaVersion must be 1.");
  if (!["placeholder", "approved"].includes(manifest.contentStatus)) errors.push("contentStatus is invalid.");
  if (release && manifest.contentStatus !== "approved") errors.push("Release manifests must be approved.");

  const identity = manifest.identity;
  if (!isObject(identity)) errors.push("identity is required.");
  else {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(identity.id || "")) errors.push("identity.id must be a lowercase URL-safe slug.");
    localized(identity.name, "identity.name", errors);
    localized(identity.description, "identity.description", errors);
    if (!isObject(identity.logo) || !identity.logo.src) errors.push("identity.logo.src is required.");
    else {
      localized(identity.logo.alt, "identity.logo.alt", errors);
      if (manifestPath && !/^https:\/\//i.test(identity.logo.src)) {
        const logoPath = path.resolve(path.dirname(manifestPath), identity.logo.src);
        if (!fs.existsSync(logoPath)) errors.push(`identity.logo.src does not exist: ${identity.logo.src}`);
      }
    }
    if (!isObject(identity.owner) || !identity.owner.name || !identity.owner.team) errors.push("identity.owner name and team are required.");
    if (!workflowStates.slice(1).includes(identity.status)) errors.push("identity.status is invalid.");
    if (!identity.version) errors.push("identity.version is required.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(identity.updatedAt || "")) errors.push("identity.updatedAt must use YYYY-MM-DD.");
  }

  const workflow = manifest.primaryWorkflow;
  if (!isObject(workflow)) errors.push("primaryWorkflow is required.");
  else {
    localized(workflow.name, "primaryWorkflow.name", errors);
    localized(workflow.description, "primaryWorkflow.description", errors);
    localized(workflow.availabilityMessage, "primaryWorkflow.availabilityMessage", errors);
    if (!Array.isArray(workflow.steps)) errors.push("primaryWorkflow.steps must be an array.");
    if (!workflowStates.includes(workflow.availability)) errors.push("primaryWorkflow.availability is invalid.");
    if (nonLaunchStates.includes(workflow.availability) && workflow.launchTarget) errors.push(`${workflow.availability} workflows must not define launchTarget.`);
    if (workflow.availability === "testing" || workflow.availability === "available") {
      if (!workflow.launchTarget) errors.push(`${workflow.availability} workflows require launchTarget.`);
      else {
        safeAction(workflow.launchTarget, "primaryWorkflow.launchTarget", errors);
        const expected = workflow.availability === "testing" ? "test" : "production";
        if (workflow.launchTarget.environment !== expected) errors.push(`${workflow.availability} workflows require a ${expected} target.`);
      }
      localized(workflow.launchLabel, "primaryWorkflow.launchLabel", errors);
    }
  }

  const guidelines = manifest.guidelines;
  if (!isObject(guidelines)) errors.push("guidelines is required.");
  else {
    if (!Array.isArray(guidelines.locales) || !["en", "de"].every((locale) => guidelines.locales.includes(locale))) errors.push("guidelines.locales must include en and de.");
    localized(guidelines.overview, "guidelines.overview", errors);
    if (!Array.isArray(guidelines.sections)) errors.push("guidelines.sections must be an array.");
    else {
      const ids = new Set(guidelines.sections.map((section) => section.id));
      requiredGuidelineIds.forEach((id) => { if (!ids.has(id)) errors.push(`Missing guideline section: ${id}.`); });
      guidelines.sections.forEach((section, index) => {
        localized(section.title, `guidelines.sections[${index}].title`, errors);
        localized(section.summary, `guidelines.sections[${index}].summary`, errors);
        if (!Array.isArray(section.blocks)) errors.push(`guidelines.sections[${index}].blocks must be an array.`);
        if (release && Array.isArray(section.blocks) && !section.blocks.length) errors.push(`guidelines.sections[${index}].blocks cannot be empty for release.`);
      });
    }
  }

  if (!Array.isArray(manifest.templates)) errors.push("templates must be an array.");
  if (!Array.isArray(manifest.relatedTools)) errors.push("relatedTools must be an array.");
  if (!isObject(manifest.theme) || typeof manifest.theme.tokenSet !== "string" || !manifest.theme.tokenSet) errors.push("theme.tokenSet is required.");
  if (release && collectStrings(manifest).some((value) => placeholderPattern.test(value))) errors.push("Release manifests must not contain marked placeholders.");
  return errors;
}

function scanRepositoryBoundary() {
  const errors = [];
  const publishedRoots = ["index.html", "js", "css"];
  const forbiddenReference = /(?:\.github\/studio-template|StudioShell|studio-manifest\.placeholder)/i;
  function scan(target) {
    const absolute = path.join(repositoryRoot, target);
    const stats = fs.statSync(absolute);
    if (stats.isDirectory()) fs.readdirSync(absolute).forEach((entry) => scan(path.join(target, entry)));
    else if (forbiddenReference.test(fs.readFileSync(absolute, "utf8"))) errors.push(`Published Hub references repository-only Studio tooling: ${target}`);
  }
  publishedRoots.forEach(scan);

  const sharedSources = [path.join(templateDirectory, "src", "StudioShell.jsx"), path.join(templateDirectory, "src", "studio-shell.css")];
  const forbiddenSharedContent = [/\bplus(?:\+)?(?=\W|$)/i, /concept studio/i, /deck studio/i, /logo-plus/i, /plus-(?:teal|purple)/i, /openai_api_key/i, /#[0-9a-f]{3,8}\b/i];
  sharedSources.forEach((sourcePath) => {
    const content = fs.readFileSync(sourcePath, "utf8");
    forbiddenSharedContent.forEach((pattern) => { if (pattern.test(content)) errors.push(`Shared shell contains forbidden product content (${pattern.source}): ${path.relative(repositoryRoot, sourcePath)}`); });
  });
  return errors;
}

function validateRegistry() {
  const registryPath = path.join(repositoryRoot, ".github", "studios", "registry.json");
  if (!fs.existsSync(registryPath)) return ["Studio registry is missing."];
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  const errors = [];
  if (registry.schemaVersion !== 1) errors.push("Studio registry schemaVersion must be 1.");
  if (!Array.isArray(registry.studios)) return [...errors, "Studio registry studios must be an array."];
  const ids = new Set();
  registry.studios.forEach((studio, index) => {
    const field = `registry.studios[${index}]`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(studio.id || "")) errors.push(`${field}.id must be a lowercase URL-safe slug.`);
    if (ids.has(studio.id)) errors.push(`${field}.id must be unique.`);
    ids.add(studio.id);
    localized(studio.name, `${field}.name`, errors);
    localized(studio.purpose, `${field}.purpose`, errors);
    if (!isObject(studio.owner) || !studio.owner.name || !studio.owner.team || !/^[A-Za-z0-9-]+$/.test(studio.owner.github || "")) errors.push(`${field}.owner requires name, team and a GitHub username.`);
    if (!Array.isArray(studio.scope) || !studio.scope.length || studio.scope.some((scope) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(scope))) errors.push(`${field}.scope requires URL-safe entries.`);
    if (!workflowStates.slice(1).includes(studio.status)) errors.push(`${field}.status is invalid.`);
  });
  return errors;
}

function runSelfTest() {
  const placeholderPath = path.join(templateDirectory, "studio-manifest.placeholder.json");
  const manifest = JSON.parse(fs.readFileSync(placeholderPath, "utf8"));
  const developmentErrors = validateManifest(manifest, { manifestPath: placeholderPath });
  const releaseErrors = validateManifest(manifest, { release: true, manifestPath: placeholderPath });
  const boundaryErrors = scanRepositoryBoundary();
  const registryErrors = validateRegistry();
  if (developmentErrors.length) return developmentErrors;
  if (!releaseErrors.length) return ["Placeholder fixture unexpectedly passed release validation."];
  return [...boundaryErrors, ...registryErrors];
}

const args = process.argv.slice(2);
const selfTest = args.includes("--self-test");
const release = args.includes("--release");
const manifestArgument = args.find((value) => !value.startsWith("--"));
let errors;

if (selfTest) errors = runSelfTest();
else if (!manifestArgument) {
  console.error("Usage: node validate-studio.mjs [--release] <studio-manifest.json> | --self-test");
  process.exit(1);
} else {
  const manifestPath = path.resolve(manifestArgument);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  errors = validateManifest(manifest, { release, manifestPath });
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}
console.log(selfTest ? "Studio starter-kit self-test passed." : `Studio manifest validation passed${release ? " for release" : ""}.`);
