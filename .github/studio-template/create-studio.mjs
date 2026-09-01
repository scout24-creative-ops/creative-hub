import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const templateDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(templateDirectory, "../..");
const registryPath = path.join(repositoryRoot, ".github", "studios", "registry.json");
const args = process.argv.slice(2);
const studioId = args.find((value) => !value.startsWith("--"));
const destinationFlag = args.indexOf("--destination");

if (!studioId || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(studioId)) {
  console.error("Usage: node .github/studio-template/create-studio.mjs <studio-id> [--destination <path>]");
  console.error("studio-id must be a lowercase URL-safe slug such as campaign-studio.");
  process.exit(1);
}

if (destinationFlag >= 0 && !args[destinationFlag + 1]) {
  console.error("--destination requires a path.");
  process.exit(1);
}

const destination = destinationFlag >= 0
  ? path.resolve(args[destinationFlag + 1])
  : path.join(repositoryRoot, ".studio-workspaces", studioId);

if (fs.existsSync(destination)) {
  console.error(`Destination already exists: ${destination}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(path.join(templateDirectory, "studio-manifest.placeholder.json"), "utf8"));
const registry = fs.existsSync(registryPath)
  ? JSON.parse(fs.readFileSync(registryPath, "utf8"))
  : { studios: [] };
const registration = registry.studios.find((studio) => studio.id === studioId);
manifest.identity.id = studioId;
manifest.identity.updatedAt = new Date().toISOString().slice(0, 10);
manifest.guidelines.sections.forEach((section) => { section.updatedAt = manifest.identity.updatedAt; });
if (registration) {
  manifest.identity.name = registration.name;
  manifest.identity.description = registration.purpose;
  manifest.identity.owner = {
    name: registration.owner.name,
    team: registration.owner.team,
  };
  if (registration.owner.github) manifest.identity.owner.contact = `https://github.com/${registration.owner.github}`;
  manifest.identity.status = registration.status;
  manifest.primaryWorkflow.name = registration.name;
  manifest.primaryWorkflow.description = registration.purpose;
  manifest.primaryWorkflow.availability = registration.status;
  manifest.primaryWorkflow.availabilityMessage = {
    en: `${registration.name.en} is registered and ready for local development.`,
    de: `${registration.name.de} ist registriert und bereit für die lokale Entwicklung.`,
  };
}

fs.mkdirSync(path.join(destination, "src"), { recursive: true });
fs.mkdirSync(path.join(destination, "assets"), { recursive: true });
fs.copyFileSync(path.join(templateDirectory, "src", "StudioShell.jsx"), path.join(destination, "src", "StudioShell.jsx"));
fs.copyFileSync(path.join(templateDirectory, "src", "studio-shell.css"), path.join(destination, "src", "studio-shell.css"));
fs.copyFileSync(path.join(templateDirectory, "assets", "product-logo.svg"), path.join(destination, "assets", "product-logo.svg"));
fs.writeFileSync(path.join(destination, "studio-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(destination, "README.md"), `# ${studioId}\n\nThis is an isolated local Studio workspace generated from the Creative Hub starter kit.\n\n## Validate\n\n\u0060\u0060\u0060sh\nnode ${path.relative(destination, path.join(templateDirectory, "validate-studio.mjs"))} studio-manifest.json\n\u0060\u0060\u0060\n\nUse \u0060--release\u0060 only after all content is approved and every marked placeholder has been removed.\n`);

console.log(`Created Studio workspace: ${destination}`);
if (registration) console.log(`Applied registered ownership for ${registration.owner.github ? `@${registration.owner.github}` : registration.owner.name}.`);
console.log("The default .studio-workspaces directory is ignored by Git.");
