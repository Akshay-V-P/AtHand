import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { UpdateUserProfileDto } from "../../application/usecases/UpdateUserProfileUsecase";
import { User } from "../../domain/entities/User";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";

export class UpdateUserProfileController {
    constructor(
        private readonly updateUserProfileUsecase: IUsecase<UpdateUserProfileDto, Omit<User, "password">>
    ) { }

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user; 
            if (!user) {
                ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "User not authenticated");
                return;
            }

            const { name, phone, profilePhotoUrl } = req.body;

            const updatedUser = await this.updateUserProfileUsecase.execute({
                id: user.id as string,
                name,
                phone,
                profilePhotoUrl
            });

            ResponseHandler.success(res, HttpStatus.OK, "Profile updated successfully", { user: updatedUser });
        } catch (error) {
            next(error);
        }
    }
}
