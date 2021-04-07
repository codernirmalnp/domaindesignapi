export default class User{
   
    constructor(
        public readonly id:string,
        public readonly name:string,
        public readonly email:string,
        public readonly type:string,
        public readonly verified:boolean,
        public readonly description:string,
        public readonly image:string,
        public readonly role:string,
        public readonly password:string
        ){};
}