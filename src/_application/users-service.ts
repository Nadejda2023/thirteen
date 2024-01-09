import { UsersModel } from "../models/users-model"
import * as bcrypt from 'bcrypt'
import { UserRepository} from "../infrastructure/repositories/users-repository"
import { UserModel } from "../db/db"
import { injectable } from "inversify"




@injectable()
export class UserService {
   
    constructor(protected usersRepository:UserRepository,
        ){}
   
   
       async findUserById(id:string): Promise<UsersModel | null> {
           const foundedUser = await UserModel.findOne({id: id},{projection: {_id: 0, passwordSalt: 0, passwordHash: 0, emailConfirmation: 0, refreshTokenBlackList: 0}})
           
           if(!foundedUser){
               return null
           } return foundedUser
           
       }

       
       async _generateHash(password: string, salt: string){
           const hash = await bcrypt.hash(password,salt)
           return hash
       }
      
       async deleteUserById(id: string): Promise<boolean> {
           return await this.usersRepository.deleteUsers(id)
       } 

     

}





