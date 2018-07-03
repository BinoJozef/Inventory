
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

import { JwtHelperService } from '@auth0/angular-jwt';
import { DataService } from '../services/data.service';
import { AppConfig } from '../../app.config';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class AuthenticationService {

  
  userPermissions:any={};
  constructor(private http: Http, private config: AppConfig,public jwtHelper:JwtHelperService,private dataService: DataService) { }

  login(upn: string, password: string, companyId: number) {
    const body = new HttpParams()
    .set('Upn', upn)
    .set('Password', password)
    .set('CompanyId',companyId.toString());
   // var body = "Upn=" + upn + "&Password=" +"'"+ password + "&CompanyId=" + companyId;
    return this.http.post(this.config.loginUrl + '/users/authenticate', body.toString(), { headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }) })
      .map(res => res.json());
   
  }

  getUserPermissions(id: number,token:string) {

    return this.http.get(this.config.loginUrl + '/users/permissions/' + id,this.jwt(token)).map(res => res.json());

  }
  getUserNames(id:number[],token:string){
    return this.http.post(this.config.loginUrl + '/users/userNames',id,this.jwt(token)).map(res => res.json());
  }
  
  getSupervisorCode(userId:number,extId:number){
    return this.http.get(this.config.loginUrl+'/users/supervisorCode/'+userId+'/'+extId).map(res=>res.text());
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
  
  isAuthenticated():Observable<boolean> {

    const token=localStorage.getItem('currentUser');
    if(!token)
     return Observable.of(false);
    
     if(this.jwtHelper.isTokenExpired(token))
     return Observable.of(false);

    const tokenPayload=this.jwtHelper.decodeToken(token);

   return this.getUserPermissions(tokenPayload.ui,token).map(
      u => {
        this.userPermissions = u;
        
        if (this.userPermissions.Apps.find(a => a == 101)) {
            // localStorage.setItem('currentUser', JSON.stringify(this.user.Token));
            this.dataService.sendData(this.userPermissions); 
            return true;          
        }
        else {
           return false;
        }
        
    })
    .catch((error: any) => {
      return Observable.of(false);
    });
    
  }

  
  

  private jwt(token) {
   
      let headers = new Headers({ 'Authorization': 'Bearer ' + token });
      return new RequestOptions({ headers: headers });
    
  }
}
