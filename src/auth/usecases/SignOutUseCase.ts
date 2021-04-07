import ITokenStore from './../service/ITokenStore';
export default class SignOutUseCase{
    constructor(private readonly tokenStore:ITokenStore){}
    public async execute(token:string):Promise<string>{
        this.tokenStore.save(token);
        return Promise.resolve('SuccessFully Signed Out')

    }
}
