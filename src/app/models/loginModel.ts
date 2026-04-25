import { applyEach, required, schema, SchemaPathTree, validate } from "@angular/forms/signals";


export interface ILoginModel {
  email: string;
  password: string;
  socialLinks:string[];
}

export let initialLoginModel: ILoginModel = {
  email: 'michael',
  password: 'success-password',
  socialLinks:[]
}

export const loginSchema = schema<ILoginModel>((rootpath)=>{
    required(rootpath.email, {message:'Email required'});
    required(rootpath.password, {message:'Password required'});
    applyEach(rootpath.socialLinks,(field)=>{
      required(field,{message:'link required'});
      url(field,{message:'Invalid url'});
    });
});


function url(field:SchemaPathTree<string>,options:{message:string}){
     validate(field,(ctx)=>{
       try{
        new URL(ctx.value());
        return null;
       }
       catch{
        return {kind:'url',message:options.message||'Invalid url'};
       }
     });
}


