import ITokenStore from './../service/ITokenStore'
import ITokenService from './../service/ITokenService'
interface Token{
  data:string,
  iat:number,
  exp:number,
  iss:string
}
export default class RefreshUseCase{
  
    constructor(
        private tokenStore:ITokenStore,
        private tokenService:ITokenService,
     
    ){

    }
    public async execute(refreshToken:string){
      if(!refreshToken) return Promise.reject("Token not provided")

      const token=await this.tokenStore.get(refreshToken)
      if(!token) return Promise.reject("Refresh token expires")  


    const payload =this.tokenService.decode(refreshToken, false, true) as Token;
       return this.tokenService.encode(payload.data,true,false)
      }
    }
