import { isValidObjectId } from "mongoose";
import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotificationRepository } from "../../domain/repositories/NotificationRepository.interface";
import { GetNotificationsDto } from "../dtos/GetNotificationsDto";
import { NotificationMapper } from "../mappers/NotificationMapper";

export interface GetNotificationsResponse
  extends PaginatedResult<ReturnType<typeof NotificationMapper.toResponse>> {
  unreadCount: number;
}

export class GetNotificationsUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(input: GetNotificationsDto): Promise<GetNotificationsResponse> {
    if (!input.recipientId || !isValidObjectId(input.recipientId)) {
      throw new BadRequestError("Valid recipientId is required");
    }

    const [paginated, unreadCount] = await Promise.all([
      this.repository.findPaginatedByRecipientId(input),
      this.repository.countUnreadByRecipientId(input.recipientId),
    ]);

    return {
      ...paginated,
      items: NotificationMapper.toResponseList(paginated.items),
      unreadCount,
    };
  }
}
