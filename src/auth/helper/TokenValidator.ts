import {NextFunction,Request,Response} from 'express';
import ITokenService from './../service/ITokenService';
import ITokenStore from './../service/ITokenStore';
export default class TokenValidator{
    constructor(private readonly tokenService:ITokenService,private readonly tokenStore:ITokenStore){}
    public async validate(req:Request,res:Response,next:NextFunction){
        const authHeader=req.cookies.access_token!;
        if(!authHeader){
            return res.status(401).json({error:"Authorization header required"});
        }
        const decoded= this.tokenService.decode(authHeader,true,false)
        if (decoded === '' )
            return res.status(403).json({ error: 'Invalid Token' })
           
            req.user=decoded
        
            next()
        }
      
}