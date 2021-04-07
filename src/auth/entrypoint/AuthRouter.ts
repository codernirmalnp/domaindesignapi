import * as express from 'express';
import IAuthRepository from '../domain/IAuthRespository';
import TokenValidator from '../helper/TokenValidator';
import {signinValidationRules,signupValidationRules} from './../helper/Validators'
import IPasswordService from './../service/IPasswordService';
import ITokenService from './../service/ITokenService';
import ITokenStore from '../service/ITokenStore'
import SignInUseCase from './../usecases/SignInUseCase';
import SignUpUseCase from './../usecases/SignUpUseCase';
import SignOutUseCase from './../usecases/SignOutUseCase';
import {validate } from './../helper/Validators';
import AuthController from './AuthController';
import RefreshUseCase from '../usecases/RefreshUseCase';

export default class AuthRouter{
    public static configure(
        authRepository: IAuthRepository,
        tokenService: ITokenService,
        tokenStore: ITokenStore,
        passwordService: IPasswordService,
        tokenValidator: TokenValidator,
     

    ):express.Router{
        const router=express.Router();
        let controller = AuthRouter.composeController(
            authRepository,
            tokenService,
            tokenStore,
            passwordService,
         
          )
          router.post(
            '/signin',
            signinValidationRules(),
            validate,
            (req: express.Request, res: express.Response) =>
              controller.signin(req, res)
          )
          router.post(
            '/signup',
            signupValidationRules(),
            validate,
            (req: express.Request, res: express.Response) =>
              controller.signup(req, res)
          )
      
          router.post(
            '/signout',
            (req, res, next) => tokenValidator.validate(req, res, next),
            (req: express.Request, res: express.Response) =>
              controller.signout(req, res)
          )
          router.post(
            '/refreshtoken',
            (req:express.Request,res:express.Response,next:express.NextFunction)=>tokenValidator.validate(req,res,next),
            (req: express.Request, res: express.Response) =>
              controller.refreshToken(req, res)
          )

          
          return router
    }
    public static composeController(
        authRepository: IAuthRepository,
        tokenService: ITokenService,
        tokenStore: ITokenStore,
        passwordService: IPasswordService,
      
    ):AuthController{
        const signinUseCase = new SignInUseCase(authRepository, passwordService)
        const signupUseCase = new SignUpUseCase(authRepository, passwordService)
        const signoutUseCase = new SignOutUseCase(tokenStore)
        const refreshUseCase=new RefreshUseCase(tokenStore,tokenService)
        const controller = new AuthController(
          signinUseCase,
          signupUseCase,
          signoutUseCase,
          tokenService,
          refreshUseCase,
          tokenStore

        )
        return controller

    }
}