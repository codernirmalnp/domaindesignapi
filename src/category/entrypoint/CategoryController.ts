import * as express from 'express'
import ICategoryRepository from './../domain/ICategoryRepository'
export default class CategoryController{
    constructor(private readonly repository:ICategoryRepository){}
    public async findAll(req:express.Request,res:express.Response){
        try{
            const {page,limit}={...req.query} as {page:any,limit:any}
            return this.repository.find(parseInt(page),parseInt(limit)).then(
                    pageable=>res.status(200).json({
                        metadata:{
                            page:pageable.page,
                            pageSize:pageable.pageSize,
                            totalPages:pageable.totalPages
                        },
                        category:pageable.data
                    })
            ).catch((err:Error)=>res.status(404).json({error:err}))
        }
        catch(err){
            return res.status(400).json({ error: err })

        }
    }
    public async findOne(req:express.Request,res:express.Response){
        try{
            const {id}=req.params

            return this.repository.findById(id).then((results)=>{
                res.status(200).json(results)
            }).catch((err:Error)=>res.status(404).json({ error: err }))

        }
        catch(e){
            return res.status(400).json({ error: e })
        }
    }

    public async add(req:express.Request,res:express.Response){
        try{
            const {name,description}=req.body
           
            const image=req.file ? `http://localhost:3000/api/public/category/${req.file.filename}`:"http://localhost:3000/api/public/category/default.jpg"
            return this.repository.add(name,image,description).then((result)=>{
                res.status(200).json(result)
            }).catch((err:Error)=>res.status(404).json({err}))
        }
        catch(e){
            console.log(e)
        }
    }

    public async update(req:express.Request,res:express.Response){
        try{
            
            let image;
            console.log(req.file)
            if(req.file)
             image=`http://localhost:3000/api/public/category/${req.file.filename}`
             
            const {name,description,id}=req.body
            console.log(name,description,id,image)
            return this.repository.update(id,name,image,description).then(
                (result)=>res.status(200).json(result)
            ).catch((err:Error)=>res.status(404).json({error:err}))
        }
        catch(e)
        {
            return res.status(400).json({error:e})
        }
    }
    public async delete(req:express.Request,res:express.Response){
        try{
            const {id}=req.params
         
            return this.repository.delete(id).then((result)=>{
                res.status(200).json(result)
            }).catch((err:Error)=>console.log(err))
        }
        catch(e)
        {
            return res.status(400).json({error:e})
        }
    }
}