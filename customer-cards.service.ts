import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Card } from 'src/app/shared/models/card';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CustomerCardsService {
  private headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
  constructor(private http: HttpClient) { }


   deleteCard( cardId: number): Observable<string> {
     let url: string = `${environment.customerCardUrl}/customers/deleteCard/${cardId}/customerCards`;
     return this.http.delete<string>(url, { headers: this.headers,responseType: 'text' as 'json' })
       .pipe(
         catchError(this.handleError)
       );
   }

  getMyCards(email:string):Observable<any>{
    let url: string = `${environment.customerCardUrl}/customers/${email}/customerCards`;
    return this.http.get(url,{ headers: this.headers });
  }



  addNewCard(cardToadd: Card, email: string): Observable<any> {
      let url: string = `${environment.customerCardUrl}/customers/addCard/${email}/customerCards`;
      return this.http.post<string>(url, cardToadd,{responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError)
      );
          
  }

  // updateNewAddress(address: Address): Observable<string> {
  //     let url: string = environment.customerAPIUrl + "/addresses";
  //     return this.http.put<string>(url, address, { responseType: 'text' as 'json' })
  //         .pipe(
  //             catchError(this.handleError)
  //         );
  // }

  private handleError(err: HttpErrorResponse) {
    console.log(err)
    let errMsg: string = '';

    if (err.status == 400) {
      errMsg = "The request can not be processed at the moment. Please try again later or connect with admin!!";
    } else if (err.status == 404) {
      errMsg = "The resources you are looking for is not available. Please try again later or connect with admin!!";
    } else {
      if (err.error instanceof Error) {

        errMsg = err.error.message;

        console.log(errMsg)
      }
      else if (typeof err.error === 'string') {
        alert("I am in error")
        errMsg = JSON.parse(err.error).errorMessage
      }
      else {
        if (err.status == 0) {
          errMsg = "A connection to back end can not be established.";
        } else {
          errMsg = err.error.message;
        }
      }
    }
    return throwError(errMsg);
  }



}