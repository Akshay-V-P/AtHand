
import fs from "node:fs";
import path from "node:path";
import pluralize from "pluralize";
import { resource, single } from "./templates.mjs";

function toPascalCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join("");
}

function toCamelCase(value) {
  const pascal = toPascalCase(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function buildNames(input) {
  const kebab = toKebabCase(input);
  const singular = pluralize.singular(kebab);
  const plural = pluralize.plural(singular);

  return {
    input,
    kebab,
    singular,
    plural,
    pascal: toPascalCase(singular),
    pluralPascal: toPascalCase(plural),
    camel: toCamelCase(singular),
    pluralCamel: toCamelCase(plural),
  };
}

// Replace placeholders in both file paths and file contents.
function render(template, names) {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => names[key] ?? `{{${key}}}`
  );
}

function writeFiles(modulePath, files, options = {}) {
  let created = 0;

  for (const [relativePath, content] of Object.entries(files)) {
    const fullPath = path.join(modulePath, relativePath);

    if (options.dryRun) {
      console.log(`[dry-run] ${fullPath}`);
      continue;
    }

    if (fs.existsSync(fullPath)) {
      console.warn(`Skipped existing file: ${fullPath}`);
      continue;
    }

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });

    fs.writeFileSync(
      fullPath,
      content.trimStart() + "\n",
      "utf8"
    );

    console.log(`Created: ${fullPath}`);
    created++;
  }

  if (!options.dryRun) {
    console.log(`Done. ${created} file(s) created.`);
  }
}

// FIX: render placeholders in filename AND content.
function resourceFiles(names) {
  const files = {};

  for (const [templatePath, templateContent] of Object.entries(resource)) {
    const outputPath = render(templatePath, names);
    const outputContent = render(templateContent, names);

    files[outputPath] = outputContent;
  }

  return files;
}

export function generateResource(name, options = {}) {
  const names = buildNames(name);

  const modulePath = path.resolve(
    options.path || "src/modules",
    names.kebab
  );

  if (fs.existsSync(modulePath) && !options.dryRun) {
    console.warn(`Module directory already exists: ${modulePath}`);
    console.warn(
      "Existing files will be preserved; only missing files will be generated."
    );
  }

  writeFiles(modulePath, resourceFiles(names), options);
}

export function generateModule(name, options = {}) {
  const names = buildNames(name);

  const modulePath = path.resolve(
    options.path || "src/modules",
    names.kebab
  );

  const files = {};

  const dirs = [
    "application/dtos",
    "application/mappers",
    "application/usecases",
    "domain/entities",
    "domain/enums",
    "domain/repositories",
    "infrastructure/database/mappers",
    "infrastructure/database/models",
    "infrastructure/database/repositories",
    "presentation/controllers",
    "presentation/routes",
  ];

  for (const dir of dirs) {
    files[path.join(dir, ".gitkeep")] = "";
  }

  files["container.ts"] = resource["container.ts"];

  const renderedFiles = Object.fromEntries(
    Object.entries(files).map(([key, value]) => [
      render(key, names),
      render(value, names),
    ])
  );

  writeFiles(modulePath, renderedFiles, options);
}

export function generateSingle(
  type,
  moduleName,
  itemName,
  options = {}
) {
  const moduleNames = buildNames(moduleName);
  const itemNames = buildNames(itemName);

  const map = {
    controller: {
      path: `presentation/controllers/{{pascal}}Controller.ts`,
      template: single.controller,
    },

    usecase: {
      path: `application/usecases/{{pascal}}UseCase.ts`,
      template: single.usecase,
    },

    dto: {
      path: `application/dtos/{{pascal}}Dto.ts`,
      template: single.dto,
    },

    entity: {
      path: `domain/entities/{{pascal}}.ts`,
      template: single.entity,
    },
  };

  let files;

  if (type === "repository") {
    files = {
      [`domain/repositories/${moduleNames.pascal}Repository.interface.ts`]:
        render(
          resource[
            "domain/repositories/{{pascal}}Repository.interface.ts"
          ],
          moduleNames
        ),

      [`infrastructure/database/repositories/${moduleNames.pascal}RepositoryImpl.ts`]:
        render(
          resource[
            "infrastructure/database/repositories/{{pascal}}RepositoryImpl.ts"
          ],
          moduleNames
        ),
    };
  } else {
    const selected = map[type];

    if (!selected) {
      throw new Error(`Unknown generator type: ${type}`);
    }

    files = {
      [render(selected.path, itemNames)]: render(
        selected.template,
        { ...moduleNames, ...itemNames }
      ),
    };
  }

  writeFiles(
    path.resolve(
      options.path || "src/modules",
      moduleNames.kebab
    ),
    files,
    options
  );
}
