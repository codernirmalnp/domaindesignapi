import {Mongoose,PaginateResult} from 'mongoose'
import IAuthRepository from '../../domain/IAuthRespository';
import User from '../../domain/User';
import UserSchema,{UserModel,UserDoc} from './../models/UserModel';
export default class AuthRepository implements IAuthRepository{
    constructor(private readonly client:Mongoose){};

    public async find(email: string): Promise<User> {
        const users = this.client.model<UserDoc>('User', UserSchema) as UserModel;
        const user = await users.findOne({ email: email.toLowerCase() }).catch((_)=>null)
        if (!user) return Promise.reject('User not found')
    
        return new User(
          user.id,
          user.name,
          user.email,
          user.type,
          user.verified,
          user.description,
          user.image,
          user.role,
          user.password ?? '',
        )
      }
     
    public async add(name:string,email:string,type:string,verified:boolean,uniqueString:string,passwordHash?:string):Promise<string>{
        const userModel=this.client.model('User',UserSchema);
        const savedUser=new userModel({type:type,name:name,verified,uniqueString,email:email.toLowerCase()})
        if(passwordHash) savedUser.password=passwordHash;
        await savedUser.save();
        return savedUser.id;
    }

    
   

}
