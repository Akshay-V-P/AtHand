import { isValidObjectId } from "mongoose";
import { PaginatedResult } from "../../../../../shared/application/dtos/PaginatedResultDTO";
import { BaseRepository } from "../../../../../shared/infrastructure/database/BaseRepository";
import { UserRole } from "../../../../auth/domain/enum/UserRole";
import { CreateNotificationDto } from "../../../application/dtos/CreateNotificationDto";
import { GetNotificationsDto } from "../../../application/dtos/GetNotificationsDto";
import { UpdateNotificationDto } from "../../../application/dtos/UpdateNotificationDto";
import { Notification } from "../../../domain/entities/Notification";
import { NotificationRepository } from "../../../domain/repositories/NotificationRepository.interface";
import { NotificationDbMapper } from "../mappers/NotificationDbMapper";
import { NotificationModel, NotificationSchemaType } from "../models/NotificationModel";

export class NotificationRepositoryImpl
  extends BaseRepository<NotificationSchemaType>
  implements NotificationRepository
{
  constructor() {
    super(NotificationModel as any);
  }

  async create(input: CreateNotificationDto): Promise<Notification> {
    const doc = new NotificationModel({
      recipientId: input.recipientId,
      recipientRole: input.recipientRole ?? UserRole.USER,
      type: input.type,
      title: input.title,
      message: input.message,
      data: input.data ?? {},
      isRead: input.isRead ?? false,
    });
    const saved = await doc.save();
    return NotificationDbMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Notification | null> {
    if (!isValidObjectId(id)) return null;
    const doc = await this.findDocumentById(id);
    if (!doc) return null;
    return NotificationDbMapper.toDomain(doc);
  }

  async findAll(): Promise<Notification[]> {
    const docs = await NotificationModel.find({isRead:false}).sort({ createdAt: -1 });
    return docs.map((doc) => NotificationDbMapper.toDomain(doc));
  }

  async findPaginatedByRecipientId(
    options: GetNotificationsDto
  ): Promise<PaginatedResult<Notification>> {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 20);
    const skip = (page - 1) * limit;

    if (!isValidObjectId(options.recipientId)) {
      return {
        items: [],
        totalItems: 0,
        page,
        limit,
        totalPages: 1,
      };
    }

    const filter: Record<string, unknown> = {
      recipientId: options.recipientId,
    };

    if (typeof options.isRead === "boolean") {
      filter.isRead = options.isRead;
    }

    const [docs, totalItems] = await Promise.all([
      NotificationModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      NotificationModel.countDocuments(filter),
    ]);

    return {
      items: docs.map((doc) => NotificationDbMapper.toDomain(doc)),
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit) || 1,
    };
  }

  async countUnreadByRecipientId(recipientId: string): Promise<number> {
    if (!isValidObjectId(recipientId)) return 0;
    return NotificationModel.countDocuments({ recipientId, isRead: false });
  }

  async markAsRead(id: string, recipientId: string): Promise<Notification | null> {
    if (!isValidObjectId(id) || !isValidObjectId(recipientId)) return null;

    const updated = await NotificationModel.findOneAndUpdate(
      { _id: id, recipientId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true }
    );

    if (updated) {
      return NotificationDbMapper.toDomain(updated);
    }

    const existing = await NotificationModel.findOne({ _id: id, recipientId });
    if (!existing) return null;
    return NotificationDbMapper.toDomain(existing);
  }

  async markAllAsRead(recipientId: string): Promise<number> {
    if (!isValidObjectId(recipientId)) return 0;

    const result = await NotificationModel.updateMany(
      { recipientId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    return result.modifiedCount ?? 0;
  }

  async update(id: string, input: UpdateNotificationDto): Promise<Notification | null> {
    if (!isValidObjectId(id)) return null;
    const updated = await this.updateDocument(id, input);
    if (!updated) return null;
    return NotificationDbMapper.toDomain(updated);
  }

  async delete(id: string, recipientId?: string): Promise<boolean> {
    if (!isValidObjectId(id)) return false;
    if (recipientId && !isValidObjectId(recipientId)) return false;

    const filter = recipientId ? { _id: id, recipientId } : { _id: id };
    const deleted = await NotificationModel.findOneAndDelete(filter);
    return Boolean(deleted);
  }
}
