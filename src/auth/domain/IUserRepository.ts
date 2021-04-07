
import Pageable from  './Pageable'
import {UserDoc} from './../data/models/UserModel'
import UserCrud from './UserCrud'
export default interface ICategoryRepository{
    find(page:number,pageSize:number):Promise<Pageable<UserCrud>>
    findById(id:string):Promise<UserCrud>
    update(id:string,name?:string,image?:string,description?:string,password?:string,role?:string,verified?:boolean):Promise<UserDoc>
    delete(id:string):Promise<string>
}