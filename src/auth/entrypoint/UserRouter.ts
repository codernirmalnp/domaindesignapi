import * as express from 'express'
import multer from 'multer'
import TokenValidator from './../../auth/helper/TokenValidator'
import ICategoryRepository from '../domain/IUserRepository'
import CategoryController from './UserController'

const multerStorage = multer.diskStorage({
  destination: (req:express.Request, file:any, cb:any) => {
    cb(null, 'public/users');
  },
  filename: (req:express.Request, file:any, cb:any) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${Date.now()}.${ext}`);
  }
});
const limits = { fileSize: 1000 * 1000 * 4 };
const multerFilter = (req:Express.Request, file:any, cb:any) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits
});


 
export default class UserRouter{
    public static configure(repository:ICategoryRepository,tokenValidator:TokenValidator):express.Router{
      const router=express.Router();
      let controller=new CategoryController(repository)
      router.get('/',
      (req:express.Request,res:express.Response,next:express.NextFunction)=>tokenValidator.validate(req,res,next),
      (req, res) => controller.findAll(req,res))
      router.get('/:id',
      (req, res) => controller.findOne(req, res))
      router.patch('/:id',
      upload.single('image'),
      (req, res) => controller.update(req, res))
      router.delete('/:id',
      (req, res) => controller.delete(req,res))

      return router;

    }
}