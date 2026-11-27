import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { DeleteNotificationUseCase } from "../../application/usecases/DeleteNotificationUseCase";
import { GetNotificationsUseCase } from "../../application/usecases/GetNotificationsUseCase";
import { GetNotificationUseCase } from "../../application/usecases/GetNotificationUseCase";
import { MarkAllNotificationsAsReadUseCase } from "../../application/usecases/MarkAllNotificationsAsReadUseCase";
import { MarkNotificationAsReadUseCase } from "../../application/usecases/MarkNotificationAsReadUseCase";

export class NotificationController {
  constructor(
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
    private readonly getNotificationUseCase: GetNotificationUseCase,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    private readonly markAllNotificationsAsReadUseCase: MarkAllNotificationsAsReadUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationUseCase
  ) {}

  readonly getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
        return;
      }

      const page = req.query.page ? parseInt(String(req.query.page), 10) : undefined;
      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : undefined;

      let isRead: boolean | undefined;
      if (req.query.isRead === "true") {
        isRead = true;
      } else if (req.query.isRead === "false") {
        isRead = false;
      }

      const result = await this.getNotificationsUseCase.execute({
        recipientId: userId,
        page,
        limit,
        isRead,
      });

      ResponseHandler.success(res, HttpStatus.OK, "Notifications fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  readonly getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
        return;
      }

      const id = String(req.params.id);
      const notification = await this.getNotificationUseCase.execute({
        id,
        recipientId: userId,
      });

      ResponseHandler.success(
        res,
        HttpStatus.OK,
        "Notification fetched successfully",
        notification
      );
    } catch (error) {
      next(error);
    }
  };

  readonly markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
        return;
      }

      const id = String(req.params.id);
      const updated = await this.markNotificationAsReadUseCase.execute({
        id,
        recipientId: userId,
      });

      ResponseHandler.success(res, HttpStatus.OK, "Notification marked as read", updated);
    } catch (error) {
      next(error);
    }
  };

  readonly markAllAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
        return;
      }

      const result = await this.markAllNotificationsAsReadUseCase.execute(userId);
      ResponseHandler.success(
        res,
        HttpStatus.OK,
        "All notifications marked as read",
        result
      );
    } catch (error) {
      next(error);
    }
  };

  readonly delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
        return;
      }

      const id = String(req.params.id);
      await this.deleteNotificationUseCase.execute({
        id,
        recipientId: userId,
      });

      ResponseHandler.success(res, HttpStatus.OK, "Notification deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
