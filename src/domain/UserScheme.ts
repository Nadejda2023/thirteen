import mongoose, { Model } from "mongoose";
import { UserType, UsersModel } from "../models/users-model";

export const UserSchema = new mongoose.Schema<UserType,UsersModel, UserSccountDBMethodsType>({
    id:{type:String, required: true },
    login: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    passwordSalt: {type: String, required: true},
    passwordHash: {type: String, required: true},
    recoveryCode: {type: String},
    emailConfirmation : {
      isConfirmed: {type: Boolean, required: true},
      confirmationCode: {type: String, required: true},
      expirationDate: {type: Date, required: true},
    },
    //refreshTokenBlackList: string[]  
  });

  export type UserSccountDBMethodsType = {
    canBeConfirmed: (code:string) => boolean
    confirm: (code: string) => void
  }

  type UserModelType = Model<UserType, {}, UserSccountDBMethodsType>;

  UserSchema.method('canBeConfirmed', function canBeConfirmed(code: string){
    const that = this as UserType
    return that.emailConfirmation.confirmationCode === code && that.emailConfirmation.expirationDate < new Date
  });
  UserSchema.method('confirm', function confirm(){
    const that = this as UserType
    if(that.emailConfirmation.isConfirmed) throw new Error('Already confirmed account can`t confirmed again')
    return that.emailConfirmation.isConfirmed = true;
  });
  
  export const UserModel = mongoose.model<UserType, UserModelType>('Users', UserSchema)