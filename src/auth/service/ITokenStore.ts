export default interface ITokenService{
    save(token:string|object):void
    get(token:string):Promise<string>
}