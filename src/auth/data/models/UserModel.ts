import * as mongoose from 'mongoose';
import pagination from 'mongoose-paginate-v2';
export interface UserDoc extends mongoose.Document{
 type:string,
 name:string,
 email:string,
 password?:string,
 verified:boolean,
 description:string,
 image:string,
 role:string
}
const UserSchema=new mongoose.Schema({
    type:{
        type:String,
        required:true,
        enum:["google","email"]
    },
    name:String,
    email:{type:String,required:true},
    password:String,
    verified:{type:Boolean,default:false},
    description:String,
    image:String,
    role: {
        type: String,
        default: 'user',
        enum: ["user",  "admin"]
       },



})
export interface UserModel
  extends mongoose.PaginateModel<UserDoc> {}

  UserSchema.plugin(pagination)

  export default UserSchema;