import {  Router } from "express";
import { authorizationValidation} from "../middlewares/inputvalidationmiddleware";
import { UsersInputValidation } from "../middlewares/usersvalidation";
import { container} from "../composition-root";
import { UsersController } from "../controllers/users-controller";
import "reflect-metadata";


export const usersRouter = Router({})

const usersController = container.resolve(UsersController)

usersRouter.get ( '/', 
usersController.getUser.bind(usersController)
)

usersRouter.post ( '/', 
authorizationValidation,
UsersInputValidation,
usersController.createUser.bind(usersController)
)

usersRouter.delete('/:id',
authorizationValidation,
usersController.deleteUserId.bind(usersController)
)  