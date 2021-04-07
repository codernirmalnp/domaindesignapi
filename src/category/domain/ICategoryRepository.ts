import Category from './Category'
import Pageable from  './Pageable'
import {CategoryDoc} from './../data/Model/CategoryModel'
export default interface ICategoryRepository{
    find(page:number,pageSize:number):Promise<Pageable<Category>>
    findById(id:string):Promise<Category>
    add(name:string,image:string,description:string):Promise<CategoryDoc>
    update(id:string,name?:string,image?:string,description?:string):Promise<CategoryDoc>
    delete(id:string):Promise<string>
}