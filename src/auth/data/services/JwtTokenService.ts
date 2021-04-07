import jwt from 'jsonwebtoken';
import ITokenService from './../../service/ITokenService';
export default class JwtTokenService implements ITokenService{
    constructor(private readonly access_secret:string,private readonly refresh_secret:string){}
    encode(payload:string | object,access:boolean,refresh:boolean):string | object{
        let token;
       if(refresh)
           token=jwt.sign({data:payload},this.refresh_secret,{
               issuer:'codernirmal',
               expiresIn:'1m',
               algorithm:'HS256'
           })

      else
         token=jwt.sign({data:payload},this.access_secret,{
            issuer:'codernirmal',
            expiresIn:'10m',
            algorithm: 'HS256',
        })

        return token;
    }
    decode(token:string,access:boolean,refresh:boolean): object | string {
        try{
            let decoded;
            if(refresh)
                 decoded=jwt.verify(token,this.refresh_secret);
            else
                decoded=jwt.verify(token,this.access_secret)
               


        
            return decoded;
           
        }
        catch(err)
        {
            return '';
        }
    }

}