import IAuthRepository from '../domain/IAuthRespository';
import IPasswordService from '../service/IPasswordService';
export default class  SignUpUseCase{
    constructor(
        private authRepository:IAuthRepository,
        private passwordService:IPasswordService
    ){}

    public async execute(name:string,authType:string,email:string,password:string):Promise<string>{
        const user=await this.authRepository.find(email).catch((_)=>null)
        if(user) return Promise.reject('User Already exists')
        let passwordhash;
        if(password){
            passwordhash = await this.passwordService.hash(password)
        }
        else{
            passwordhash = undefined
        }
     
        const verified=false;
        const userId = await this.authRepository.add(
            name,
            email,
            authType,
            verified,
            passwordhash
          )
          
          
          return userId;

    }

}