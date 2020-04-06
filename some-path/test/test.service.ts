import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  submitOrder(order: Object): Observable<boolean> {
    console.log(JSON.stringify(order));
    return of(true);
  }
}
