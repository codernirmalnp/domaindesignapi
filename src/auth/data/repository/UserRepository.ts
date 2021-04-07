import {Mongoose,PaginateResult} from 'mongoose'
import IUserRepository from './../../domain/IUserRepository';
import Pageable from './../../domain/Pageable';
import {user_path} from './../../../../config'
import fs from 'fs'
import UserSchema,{UserModel,UserDoc} from './../models/UserModel';
import UserCrud from '../../domain/UserCrud';
export default class UserRepository implements IUserRepository {
  constructor(private readonly client:Mongoose){}
  public async find(page:number,pageSize:number):Promise<Pageable<UserCrud>>{
    const model=this.client.model<UserDoc>("User",UserSchema) as UserModel;
    const pageOptions={page:page,limit:pageSize, sort: { _id: -1 }}
    const pageResults = await model.paginate({}, pageOptions).catch((err) => null)
    return this.userFromPageResults(pageResults);
  }
  public async findById(id:string):Promise<UserCrud>{
    const userModel=this.client.model<UserDoc>("User",UserSchema)
    const user=await userModel.findOne({_id:id})
    if(!user) return Promise.reject("Cannot find User")
    return new UserCrud(
      user.id,
      user.name,
      user.email,
      user.type,
      user.verified,
      user.description,
      user.image,
      user.role
    )

  }



  public async update(id:string,name?:string,description?:string,password?:string,image?:string,role?:string,verified?:boolean):Promise<UserDoc>{
    const updateUser=this.client.model<UserDoc>("User",UserSchema)
    let user = {name:'',image:'',description:'',password:'',role:'',verified:false};
    await updateUser.findOne({ _id:id }, (err:any, result:any) => {
      if (err) {
         return user;
      }
      if (result != null) {
        user= result;
      }
    });


    if(user.image){
      const FILE_PATH=user_path
      let filepath=user?.image.split('/')[5]
       if(fs.existsSync(FILE_PATH+'/'+filepath)) fs.unlinkSync(FILE_PATH+'/'+filepath)
    }

    const result=await updateUser.findOneAndUpdate({ _id:id },{
        $set: {
          name: name ? name : user.name,
         description:description ? description:user.description ,
         password:password ? password:user.password,
         role:role ? role:user.role,
         verified:verified ?verified:user.verified,
         image: image ? image: user.image
        },
      },
      { new: true,useFindAndModify:false })

   
    if(!result) return Promise.reject("Something went Wrong")
    return Promise.resolve(result)
    
  }
  public async delete(id:string):Promise<string>{
    const FILE_PATH=user_path
    const deleteUser=this.client.model<UserDoc>("User",UserSchema)
    const users=await deleteUser.findOne({_id:id})
    let filepath=users?.image.split('/')[5]
    if(fs.existsSync(FILE_PATH+'/'+filepath)) fs.unlinkSync(FILE_PATH+'/'+filepath)
    await deleteUser.findOneAndDelete({_id:id},{useFindAndModify:false})
    return Promise.resolve("User  deleted SuccessFully")
  }

  private userFromPageResults(
    pageResults: PaginateResult<UserDoc> | null
  ) {
    if (pageResults === null || pageResults.docs.length === 0)
      return Promise.reject('User not found')

    const results = pageResults.docs.map<UserCrud>(
      (model) =>
        new UserCrud(
          model.id,
          model.name,
          model.email,
          model.type,
          model.verified,
          model.image,
          model.description,
          model.role
         
        )
    )

    return new Pageable<UserCrud>(
      pageResults.page ?? 0,
      pageResults.limit,
      pageResults.totalPages,
      results
    )
  }

 

}
