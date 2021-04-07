export default interface ITokenService{
    encode(payload:string | object,access:boolean,refresh:boolean):string | object;
    decode(payload:string | object,access:boolean,refresh:boolean):object | string;
}