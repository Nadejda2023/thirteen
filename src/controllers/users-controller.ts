import { Request, Response} from "express";
import { UserService } from "../_application/users-service"
import { authRepository } from "../infrastructure/repositories/auth-repositori"
import { PaginatedUser, UsersModel } from "../models/users-model";
import { getUsersPagination } from "../hellpers/pagination";
import { inject, injectable } from "inversify";
import { UsersQueryRepository } from "../infrastructure/repositories/users-query-repository";
import { usersQueryRepository } from "../composition-root";


@injectable()
export class UsersController {
    constructor(protected usersService: UserService) {}
    async createUser(req: Request, res: Response) {
        const newUser = await authRepository.createUser(req.body.login, req.body.email, req.body.password)
        if(!newUser) {
            res.sendStatus(401)
        } else {
            res.status(201).send(newUser)
        }
    }
    async getUser(req: Request, res: Response) : Promise<void> {
        const pagination = getUsersPagination(req.query)
        const foundAllUsers: PaginatedUser<UsersModel> = await usersQueryRepository.findUsers(pagination)
        res.status(200).send(foundAllUsers)
    }
    async deleteUserId( req: Request, res: Response) {
        const isDeleted = await this.usersService.deleteUserById(req.params.id)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
        }
}
