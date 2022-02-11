import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  num=0;
  private numvalue= new BehaviorSubject(this.num);
  constructor() { }
  getNum(){
    return this.numvalue.asObservable();
  }
  setNum(value){
    // this.num=value;
    this.numvalue.next(value)
    
  }
}
