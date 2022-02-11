import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private hc: HttpClient) {}

  createUser(userObj): Observable<any> {
    return this.hc.post('/user/createuser', userObj);
  }
  getUser(userName): Observable<any> {
    return this.hc.get(`/user/getuser/${userName}`);
  }
  updateUserDetails(userObj): Observable<any> {
    return this.hc.post('/user/updateuserdetails', userObj);
  }
  loginUser(loginObj): Observable<any> {
    return this.hc.post('/user/login', loginObj);
  }
  checkUser(userName): Observable<any> {
    return this.hc.post('/user/checkuser', userName);
  }
  //used in home.component.ts
  checkAdminUser(userName): Observable<any> {
    return this.hc.post('/user/checkadminuser', userName);
  }
  getCart(userName): Observable<any> {
    // console.log("from service",userObj)
    return this.hc.get(`/user/getcart/${userName}`);
  }
  addToCart(productObj): Observable<any> {
    return this.hc.post('/user/addtocart', productObj);
  }
  removeQuantity(userName, id): Observable<any> {
    return this.hc.post(`/user/removequantity/${userName}/${id}`, '');
  }
  removeCartItem(userName, id): Observable<any> {
    return this.hc.post(`/user/removecartitem/${userName}/${id}`, '');
  }
  getCount(userName): Observable<any> {
    // console.log("from service",userObj)
    return this.hc.get(`/user/getcount/${userName}`);
  }
  resetCart(userName): Observable<any> {
    return this.hc.post(`/user/resetcart/${userName}`, '');
  }
  changePassword(userName,pwdObj): Observable<any> {
    return this.hc.post(`/user/changepassword/${userName}`, pwdObj);
  }
}
