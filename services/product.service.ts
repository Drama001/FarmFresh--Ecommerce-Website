import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private hc: HttpClient) {}

  addProduct(productObj): Observable<any> {
    return this.hc.post('/product/addproduct', productObj);
  }
  getProducts(): Observable<any> {
    return this.hc.get('/product/getproducts');
  }
  updateProductsPrice(productValue): Observable<any> {
    return this.hc.post('/product/updateprice', productValue);
  }
  getProductById(id): Observable<any> {
    return this.hc.get(`/product/getproduct/${id}`);
  }
  updateProduct(newData): Observable<any> {
    return this.hc.post('/product/updateproduct', newData);
  }
  deleteProduct(productObj): Observable<any> {
    return this.hc.post('/product/deleteproduct', productObj);
  }
  addProductReview(reviewObj): Observable<any> {
    return this.hc.post('/product/addproductreview', reviewObj);
  }
}
