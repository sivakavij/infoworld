import {Component, Injectable} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';

export class SessionHandler {
  private storage;
  private hash = "Infoworld"; 
  public modal ;
  
  constructor(modal: any){
    if(!modal) {
      modal = 'common';
    }
    this.modal = modal;
  }
  
  protected change_model(modal: any): void {
    this.modal = modal;
  }
  
  protected set(key: string, data: any ): void {
    var modal_key = this.get_key(key);
    
   return localStorage.setItem(modal_key, data); 
  }
  
  public get(key: string): any {
    if(this.has(key)){
      var modal_key = this.get_key(key);
      return localStorage.getItem(modal_key);
    }
    return false;
  }
  
  public has(key: string): boolean {
     var modal_key = this.get_key(key);
    if(localStorage.getItem(modal_key)){     
      return true;
    }
    return false;
  }
  
  public remove(key: string): void {
     var modal_key = this.get_key(key);
    localStorage.removeItem(modal_key);
  }
  
  private get_key(key: string) {    
    return this.hash + '-' + this.modal + '-' + key;    
  }
}

@Injectable()
export class SessionUrlHandler extends SessionHandler {
  private profileurl;
  constructor(private _routeParams: RouteParams) {
    super("url");
    this.profileurl = _routeParams.get('profileurl');
    console.log(this.profileurl);
  }
  
  public getcontent() : any {
   if(this.has(this.profileurl)){
     return JSON.parse(this.get(this.profileurl));
   }
   return false;
  }
  
  public createContent(data : any) : any {
   if(this.hasUrl()){
     return {"error":true,'type':"EXIST"};
   }
   data = JSON.stringify(data);
   return this.set(this.profileurl,data);
  }
  
  public getOrCreateContent() : any {
   if(this.has(this.profileurl)){
     return this.getcontent();
   }else{
     var data = this.sampleJson();
     data['searchUrl']=this.profileurl;
     return this.createContent(data);
   } 
  }
  
  public updateContent(data : any) : any {
   if(!this.hasUrl()){
     return {"error":true,'type':"EXIST"};
   }
   data = JSON.stringify(data);
   return this.set(this.profileurl,data);
  }
  
  public hasUrl() : any {
   if(this.has(this.profileurl)){
     return true;
   }
   return false;
  }
  
  public updateKeyContent(key:string,data:any) : any {
   if(this.has(this.profileurl)){
     var datasource =  JSON.parse(this.get(this.profileurl));
     datasource[key] = data;
    return this.updateContent(datasource);      
   }
   return false;
  }
  
  public hasUrlbyurl(profileurl:string) : any {
   if(this.has(profileurl)){
     return true;
   }
   return false;
  }
  
  public getgravitor(sizeInMM: Number) : any {
      let data = this.getcontent();
      if(data['basicInfo'] == undefined || data['basicInfo']['emailAddress'] == undefined) {
        return false;
  }
   return "http://www.gravatar.com/avatar/" + md5(data['basicInfo']['emailAddress']) + "?s="+sizeInMM+"&d=mm";
    
 }
 
 
  private sampleJson() :any{
    return {
            "searchUrl": "sample",
            "basicInfo": {
                "profileImage": "",
                "displayname": "Mr. Sample Name",
                "phoneNumber": 9999999999,
                "contryCode": 91,
                "address": "Old No:374, New No: 388, Vazhuthavur Main Road, Shanmugapuram, Puducherry, 605009",
                "currentProfession": "Web & UI Developer",
                "emailAddress":"sample@email.com",
                "dob":"1990/02/21"
            },
            "objective": "These samples of resumes and cover letters are intended purely as a guide to what is possible. Do not simply try to copy them for your own resume, because your resume should be unique (like you!).",
            "about": "These samples of resumes and cover letters are intended purely as a guide to what is possible. Do not simply try to copy them for your own resume, because your resume should be unique (like you!).",
            "knowledge": [],
            "skill": [],
            "exprience": [],
            "education": []
        };
  }
  
  
}

