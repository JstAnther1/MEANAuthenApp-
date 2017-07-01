import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http:Http) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('process.env.PORT/users/register', user,{headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('process.env.PORT/users/authenticate', user,{headers: headers})
      .map(res => res.json());
  }

  storeUserData(token,user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('process.env.PORT/users/profile',{headers: headers})
      .map(res => res.json());
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(){
    return tokenNotExpired('id_token');
  }

}

/*communicate with backend's post request at http://localhost:3000/users/register, and since in node.express backend part
under 'routes' folder, user.js, addUser() function is went through and returns success field as 'true' or 'false'*/

/*localstorage can only store strings (e.g. objects canot be stored ), in this case backend returns 'user' as an object
so therefore a need to stringify it. For proof, use Postman to check out the route localhost:3000/users/authenticate*/  

/*in order to get each users unique profile, confirmation through jwt required therefore need loadToken(){...} and then 
'Authorization'*/






