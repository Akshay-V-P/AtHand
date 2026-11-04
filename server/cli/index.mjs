
// #!/usr/bin/env node

import { Command } from "commander";

import {
  generateResource,
  generateModule,
  generateSingle,
} from "./generator.mjs";

const program = new Command();

program
  .name("express-arch")
  .description("Generate modules following your Express Clean Architecture")
  .version("1.0.0");

program
  .command("resource <name>")
  .alias("r")
  .description("Generate a complete resource module")
  .option("-p, --path <path>", "Modules directory", "src/modules")
  .option("--dry-run", "Print files without writing")
  .action((name, options) => generateResource(name, options));

program
  .command("module <name>")
  .description("Generate only the module directory skeleton")
  .option("-p, --path <path>", "Modules directory", "src/modules")
  .option("--dry-run", "Print files without writing")
  .action((name, options) => generateModule(name, options));

program
  .command("controller <module> [name]")
  .description("Generate a controller")
  .option("-p, --path <path>", "Modules directory", "src/modules")
  .option("--dry-run", "Print files without writing")
  .action((moduleName, name, options) =>
    generateSingle("controller", moduleName, name || moduleName, options)
  );

program
  .command("usecase <module> <name>")
  .description("Generate a use case")
  .option("-p, --path <path>", "Modules directory", "src/modules")
  .option("--dry-run", "Print files without writing")
  .action((moduleName, name, options) =>
    generateSingle("usecase", moduleName, name, options)
  );

program
  .command("dto <module> <name>")
  .description("Generate a DTO")
  .option("-p, --path <path>", "Modules directory", "src/modules")
  .option("--dry-run", "Print files without writing")
  .action((moduleName, name, options) =>
    generateSingle("dto", moduleName, name, options)
  );

program
  .command("entity <module> [name]")
  .description("Generate a domain entity")
  .option("-p, --path <path>", "Modules directory", "src/modules")
  .option("--dry-run", "Print files without writing")
  .action((moduleName, name, options) =>
    generateSingle("entity", moduleName, name || moduleName, options)
  );

program
  .command("repository <module> [name]")
  .description("Generate repository interface and implementation")
  .option("-p, --path <path>", "Modules directory", "src/modules")
  .option("--dry-run", "Print files without writing")
  .action((moduleName, name, options) =>
    generateSingle("repository", moduleName, name || moduleName, options)
  );

program.parse();
