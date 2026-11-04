
export const resource = {
  "application/dtos/Create{{pascal}}Dto.ts": `
export interface Create{{pascal}}Dto {
  // TODO: Add validated input fields.
}
`,

  "application/dtos/Update{{pascal}}Dto.ts": `
export interface Update{{pascal}}Dto {
  // TODO: Add optional update fields.
}
`,

  "application/mappers/{{pascal}}Mapper.ts": `
import { {{pascal}} } from "../../domain/entities/{{pascal}}";

export class {{pascal}}Mapper {
  static toResponse(entity: {{pascal}}) {
    return { ...entity };
  }
}
`,

  "application/usecases/Create{{pascal}}UseCase.ts": `
import { Create{{pascal}}Dto } from "../dtos/Create{{pascal}}Dto";
import { {{pascal}}Repository } from "../../domain/repositories/{{pascal}}Repository.interface";

export class Create{{pascal}}UseCase {
  constructor(private readonly repository: {{pascal}}Repository) {}

  async execute(input: Create{{pascal}}Dto) {
    return this.repository.create(input);
  }
}
`,

  "application/usecases/Get{{pascal}}UseCase.ts": `
import { {{pascal}}Repository } from "../../domain/repositories/{{pascal}}Repository.interface";

export class Get{{pascal}}UseCase {
  constructor(private readonly repository: {{pascal}}Repository) {}

  async execute(id: string) {
    return this.repository.findById(id);
  }
}
`,

  "application/usecases/Get{{pluralPascal}}UseCase.ts": `
import { {{pascal}}Repository } from "../../domain/repositories/{{pascal}}Repository.interface";

export class Get{{pluralPascal}}UseCase {
  constructor(private readonly repository: {{pascal}}Repository) {}

  async execute() {
    return this.repository.findAll();
  }
}
`,

  "application/usecases/Update{{pascal}}UseCase.ts": `
import { Update{{pascal}}Dto } from "../dtos/Update{{pascal}}Dto";
import { {{pascal}}Repository } from "../../domain/repositories/{{pascal}}Repository.interface";

export class Update{{pascal}}UseCase {
  constructor(private readonly repository: {{pascal}}Repository) {}

  async execute(id: string, input: Update{{pascal}}Dto) {
    return this.repository.update(id, input);
  }
}
`,

  "application/usecases/Delete{{pascal}}UseCase.ts": `
import { {{pascal}}Repository } from "../../domain/repositories/{{pascal}}Repository.interface";

export class Delete{{pascal}}UseCase {
  constructor(private readonly repository: {{pascal}}Repository) {}

  async execute(id: string) {
    return this.repository.delete(id);
  }
}
`,

  "domain/entities/{{pascal}}.ts": `
export interface {{pascal}} {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}
`,

  "domain/repositories/{{pascal}}Repository.interface.ts": `
import { Create{{pascal}}Dto } from "../../application/dtos/Create{{pascal}}Dto";
import { Update{{pascal}}Dto } from "../../application/dtos/Update{{pascal}}Dto";
import { {{pascal}} } from "../entities/{{pascal}}";

export interface {{pascal}}Repository {
  create(input: Create{{pascal}}Dto): Promise<{{pascal}}>;
  findById(id: string): Promise<{{pascal}} | null>;
  findAll(): Promise<{{pascal}}[]>;
  update(id: string, input: Update{{pascal}}Dto): Promise<{{pascal}} | null>;
  delete(id: string): Promise<boolean>;
}
`,

  "infrastructure/database/mappers/{{pascal}}DbMapper.ts": `
import { {{pascal}} } from "../../../domain/entities/{{pascal}}";

export class {{pascal}}DbMapper {
  static toDomain(record: any): {{pascal}} {
    return {
      id: String(record.id),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  static toPersistence(entity: Partial<{{pascal}}>) {
    return { ...entity };
  }
}
`,

  "infrastructure/database/models/{{pascal}}Model.ts": `
/**
 * Define your ORM/ODM model here.
 * Keep database-specific details inside infrastructure.
 */
export const {{pascal}}Model = {
  collectionName: "{{plural}}",
};
`,

  "infrastructure/database/repositories/{{pascal}}RepositoryImpl.ts": `
import { Create{{pascal}}Dto } from "../../../application/dtos/Create{{pascal}}Dto";
import { Update{{pascal}}Dto } from "../../../application/dtos/Update{{pascal}}Dto";
import { {{pascal}} } from "../../../domain/entities/{{pascal}}";
import { {{pascal}}Repository } from "../../../domain/repositories/{{pascal}}Repository.interface";

export class {{pascal}}RepositoryImpl implements {{pascal}}Repository {
  async create(input: Create{{pascal}}Dto): Promise<{{pascal}}> {
    throw new Error("Not implemented");
  }

  async findById(id: string): Promise<{{pascal}} | null> {
    throw new Error("Not implemented");
  }

  async findAll(): Promise<{{pascal}}[]> {
    throw new Error("Not implemented");
  }

  async update(id: string, input: Update{{pascal}}Dto): Promise<{{pascal}} | null> {
    throw new Error("Not implemented");
  }

  async delete(id: string): Promise<boolean> {
    throw new Error("Not implemented");
  }
}
`,

  "presentation/controllers/{{pascal}}Controller.ts": `
import { Request, Response, NextFunction } from "express";

export class {{pascal}}Controller {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ data: [] });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ data: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json({ data: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ data: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
`,

  "presentation/routes/{{pascal}}Routes.ts": `
import { Router } from "express";

const router = Router();

// TODO: Wire controller routes.

export default router;
`,

  "container.ts": `
/**
 * Module composition root.
 * Instantiate repository, use cases, and controller here.
 */
export {};
`
};

export const single = {
  controller: `
import { Request, Response, NextFunction } from "express";

export class {{pascal}}Controller {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ data: null });
    } catch (error) {
      next(error);
    }
  }
}
`,

  usecase: `
export class {{pascal}}UseCase {
  async execute() {
    // TODO: Implement application logic.
  }
}
`,

  dto: `
export interface {{pascal}}Dto {
  // TODO: Add DTO fields.
}
`,

  entity: `
export interface {{pascal}} {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}
`
};
