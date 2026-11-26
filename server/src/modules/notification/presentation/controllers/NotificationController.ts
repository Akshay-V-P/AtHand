import { Request, Response, NextFunction } from "express";

export class NotificationController {
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

