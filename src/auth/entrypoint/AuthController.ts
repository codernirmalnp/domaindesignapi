import * as express from 'express';
import ITokenService from './../service/ITokenService'
import SignUpUseCase from './../usecases/SignUpUseCase';
import SignInUseCase from './../usecases/SignInUseCase';
import SignOutUseCase from './../usecases/SignOutUseCase';
import RefreshUseCase from '../usecases/RefreshUseCase';
import ITokenStore from '../service/ITokenStore'
const { OAuth2Client } = require('google-auth-library')
export default class AuthController{
    private client = new OAuth2Client(process.env.CLIENT_ID)
    private readonly signInUseCase:SignInUseCase;
    private readonly signUpUseCase:SignUpUseCase;
    private readonly signOutUseCase:SignOutUseCase;
    private readonly refreshUseCase:RefreshUseCase;
    private readonly tokenService:ITokenService;
    private readonly tokenStore:ITokenStore;
    constructor(signinUseCase:SignInUseCase,signupUseCase:SignUpUseCase,signoutUseCase:SignOutUseCase,tokenService:ITokenService,refreshUseCase:RefreshUseCase,tokenStore:ITokenStore){
        this.signInUseCase=signinUseCase;
        this.signUpUseCase=signupUseCase;
        this.signOutUseCase=signoutUseCase;
        this.tokenService=tokenService;
        this.refreshUseCase=refreshUseCase;
        this.tokenStore=tokenStore
  

    }
    public async signin (req:express.Request,res:express.Response){
        try{
            const {name,email,password,auth_type,token}=req.body;
            if(token && auth_type=="google"){
                const ticket = await this.client.verifyIdToken({
                    idToken: token,
                    audience: process.env.CLIENT_ID
                });
                const { name, email} = ticket.getPayload();
            
                return this.signInUseCase
                              .execute(name, email, password, "google")
                              .then((id: string) =>  {
                                  const accessToken=this.tokenService.encode(id,true,false)
                                  const refreshToken=this.tokenService.encode(id,false,true)
                                  this.tokenStore.save(refreshToken)
                                  res.cookie('access_token',accessToken)
                                  res.cookie('refresh_token',refreshToken)
                                 return res.status(200).json({msg:"Login SuccesFull"})
                                 

                              })
                              .catch((err: Error) => res.status(404).json({ error: err }))

            }
            if(auth_type=="email"){
                return  await this.signInUseCase.execute(name, email, password, auth_type).then((id:string)=>{
                    const accessToken=this.tokenService.encode(id,true,false)
                    const refreshToken=this.tokenService.encode(id,false,true)
                    this.tokenStore.save(refreshToken)
                    res.cookie('access_token',accessToken)
                    res.cookie('refresh_token',refreshToken)
                   return res.status(200).json({msg:"Login SuccesFull"})
                   
                  }).catch((err)=>res.status(401).json({error:err}))

            }
            return res.status(401).json({error:"Please login with email or google"})

            
        }
        catch(e){
            console.log(e)
           return res.status(400).json({ error: e })
        }
        

    }

    public async signup(req:express.Request,res:express.Response){
        try{
            const {name,email,password,auth_type}=req.body
            return this.signUpUseCase.execute(name,auth_type,email,password).then((id:string)=>{
                return res.status(200).json({message:"Signup SuccessFully"})
            }).catch((err:Error) => {
               res.status(401).json({ error: err })
            })
        }
        catch(error){
            res.status(400).json({ error: error })

        }
        
    }
    public async signout(req:express.Request,res:express.Response){
        try{
            const token=req.headers.authorization!
            return this.signOutUseCase.execute(token).then((result)=>{
              
                return res.status(200).json({ message: result })
            }).catch((err: Error) => res.status(404).json({ error: err }))
        }
        catch(error){
            return res.status(400).json({ error: error })
        }
    }
    public async refreshToken(req:express.Request,res:express.Response){
        const {refresh_token}=req.cookies
          this.refreshUseCase.execute(refresh_token).then((response)=>{
               res.cookie('token',response)
               return res.status(200).json({ access_token: response})
          }).catch((err)=>res.status(401).json(err))
    }


  
  


}