import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderObject:any;

  constructor(private hc: HttpClient) {}

  createOrder(orderObj): Observable<any> {
    return this.hc.post('/order/createorder', orderObj);
  }

  getOrders(userName): Observable<any> {
    return this.hc.get(`/order/getorders/${userName}`);
  }

  storeCart(cartObj){
    this.orderObject= cartObj;
  }

  storeAddress(addressObj){
    this.orderObject['address']=addressObj;
    //console.log(this.orderObject)
  }

  confirmedOrder(){
    this.orderObject.orderStatus = true;
    return this.orderObject;
  }

  
}
