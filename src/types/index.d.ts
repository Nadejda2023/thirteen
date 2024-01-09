import { UsersModel } from "../models/users-model"
//index.d.ts
declare global {
   declare namespace Express {
        export interface Request {
            userId:  string | null
            user: UsersModel | null
        }
    }
}
