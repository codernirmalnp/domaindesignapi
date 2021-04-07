import {Mongoose,PaginateResult} from 'mongoose'
import ICategoryRepository from './../../domain/ICategoryRepository';
import Category from './../../domain/Category'
import Pageable from './../../domain/Pageable';
import fs from 'fs'
import CategorySchema,{CategoryModel,CategoryDoc} from './../Model/CategoryModel';
export default class CategoryRepository implements ICategoryRepository{
  constructor(private readonly client:Mongoose){}
  public async find(page:number,pageSize:number):Promise<Pageable<Category>>{
    const model=this.client.model<CategoryDoc>("Category",CategorySchema) as CategoryModel ;
    const pageOptions={page:page,limit:pageSize, sort: { _id: -1 }}
    const pageResults = await model.paginate({}, pageOptions).catch((err) => null)
    return this.categoryFromPageResults(pageResults);

  }
  public async findById(id:string):Promise<Category>{
    const catlist=this.client.model<CategoryDoc>("Category",CategorySchema)
    const category=await catlist.findOne({_id:id})
    if(!category) return Promise.reject("Cannot find Category")
    return new Category(category.id,category.name,category.image,category.description)

  }

  public async add(name:string,image:string,description:string):Promise<CategoryDoc>{
    const newCategory=this.client.model<CategoryDoc>("Category",CategorySchema)
    const category= new newCategory({name:name,image:image,description:description})
    await category.save();
    if(!category) return Promise.reject("Something went Wrong")
    return Promise.resolve(category)
  }
  public async update(id:string,name?:string,image?:string,description?:string):Promise<CategoryDoc>{
    const updateCategory=this.client.model<CategoryDoc>("Category",CategorySchema)
    let category = {name:'',image:'',description:''};
    await updateCategory.findOne({ _id:id }, (err:any, result:any) => {
      if (err) {
         return category;
      }
      if (result != null) {
        category= result;
      }
    });
    const result=await updateCategory.findOneAndUpdate({ _id:id },{
        $set: {
          name: name ? name : category.name,
          image: image
            ? image
            : category.image,
         description:description ? description:category.description 
          
        },
      },
      { new: true,useFindAndModify:false })

   
    if(!result) return Promise.reject("Something went Wrong")
    return Promise.resolve(result)
    
  }
  public async delete(id:string):Promise<string>{
    const FILE_PATH='public/category/'
    const deleteCategory=this.client.model<CategoryDoc>("Category",CategorySchema)
    const category=await deleteCategory.findOne({_id:id})
    let filepath=category?.image.split('/')[4]
    if(fs.existsSync(FILE_PATH+'/'+filepath)) fs.unlinkSync(FILE_PATH+'/'+filepath)
    await deleteCategory.findOneAndDelete({_id:id},{useFindAndModify:false})
    return Promise.resolve("Category deleted SuccessFully")
  }

  private categoryFromPageResults(
    pageResults: PaginateResult<CategoryDoc> | null
  ) {
    if (pageResults === null || pageResults.docs.length === 0)
      return Promise.reject('Category not found')

    const results = pageResults.docs.map<Category>(
      (model) =>
        new Category(
          model.id,
          model.name,
          model.image,
          model.description
        )
    )

    return new Pageable<Category>(
      pageResults.page ?? 0,
      pageResults.limit,
      pageResults.totalPages,
      results
    )
  }

 

}
