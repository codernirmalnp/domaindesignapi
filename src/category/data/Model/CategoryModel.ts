import * as mongoose from 'mongoose';
import pagination from 'mongoose-paginate-v2';
export interface CategoryDoc extends mongoose.Document{
   
     name:string,
     image:string,
     description:string

}
 const CategorySchema=new mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,required:true},
    description:{type:String,required:true}
})
export interface CategoryModel
  extends mongoose.PaginateModel<CategoryDoc> {}

CategorySchema.plugin(pagination)

export default CategorySchema;