import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { environment } from '../../../environments/environment';

const apiUrls: any = {
  springBoot: environment.url,
  python: environment.pythonUrl,
};

@Injectable({
  providedIn: 'root',
})
export abstract class BaseHttp {
  constructor(
    private http: HttpClient,
    public dataStorageService: DataStorageService,
    public router: Router
  ) {}

  get<T>(url: string, tech: any = 'springBoot'): Observable<T> {
    let bearer: any = localStorage.getItem('userToken');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      token: bearer,
    });
    return this.http.get<any>(apiUrls[tech] + url, { headers: header }).pipe(
      map((response) => {
        if (response.statusCode === 401) {
          sessionStorage.clear();
          localStorage.clear();
          sessionStorage.setItem('token_expired', 'true');
          this.router.navigateByUrl('');
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  post<T>(url: string, body: any, tech: any = 'springBoot'): Observable<T> {
    let bearer: any = localStorage.getItem('userToken');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      token: bearer,
    });
    
    // Log the request for debugging
    console.log(`Making POST request to ${apiUrls[tech] + url}`);
    console.log('Request body:', body);
    console.log('Request headers:', header);
    
    return this.http
      .post<any>(apiUrls[tech] + url, JSON.stringify(body), { headers: header })
      .pipe(
        tap(response => console.log('Response received:', response)),
        map((response) => {
          if (response && response.statusCode === 401) {
            sessionStorage.clear();
            localStorage.clear();
            sessionStorage.setItem('token_expired', 'true');
            this.router.navigateByUrl('');
          }
          return response;
        }),
        catchError((error) => {
          console.log('Error in POST request:', error);
          return this.handleError(error);
        })
      );
  }

  filePost<T>(url: string, body: any, tech: any = 'springBoot'): Observable<T> {
    let bearer: any = localStorage.getItem('userToken');
    const header = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      token: bearer,
    });
    return this.http
      .post<any>(apiUrls[tech] + url, body, { headers: header })
      .pipe(
        map((response) => {
          if (response.statusCode === 401) {
            sessionStorage.clear();
            localStorage.clear();
            sessionStorage.setItem('token_expired', 'true');
            this.router.navigateByUrl('');
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  filePostPython<T>(url: string, body: any): Observable<T> {
    let bearer: any = localStorage.getItem('userToken');
    const header = new HttpHeaders({
      // token: bearer,
    });
    return this.http
      .post<any>(environment.pythonUrl + url, body, { headers: header })
      .pipe(
        map((response) => {
          if (response.statusCode === 401) {
            sessionStorage.clear();
            localStorage.clear();
            sessionStorage.setItem('token_expired', 'true');
            this.router.navigateByUrl('');
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  put<T>(url: string, body: any, tech: any = 'springBoot'): Observable<T> {
    let bearer: any = localStorage.getItem('userToken');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      token: bearer,
    });
    return this.http
      .put<any>(apiUrls[tech] + url, JSON.stringify(body), { headers: header })
      .pipe(
        map((response) => {
          if (response.statusCode === 401) {
            sessionStorage.clear();
            localStorage.clear();
            sessionStorage.setItem('token_expired', 'true');
            this.router.navigateByUrl('');
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  delete<T>(url: string, tech: any = 'springBoot'): Observable<T> {
    let bearer: any = localStorage.getItem('userToken');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      token: bearer,
    });
    return this.http.delete<any>(apiUrls[tech] + url, { headers: header }).pipe(
      map((response) => {
        if (response.statusCode === 401) {
          sessionStorage.clear();
          localStorage.clear();
          sessionStorage.setItem('token_expired', 'true');
          this.router.navigateByUrl('');
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  login<T>(url: string, body: any, tech: any = 'springBoot'): Observable<T> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<any>(apiUrls[tech] + url, JSON.stringify(body), { headers: header })
      .pipe(
        map((response) => {
          if (response.statusCode === 401) {
            sessionStorage.clear();
            localStorage.clear();
            sessionStorage.setItem('token_expired', 'true');
            this.router.navigateByUrl('');
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    console.log(error, 'handleError');
    
    if (error.error instanceof Error) {
      // Get client-side error
      console.log(error.error, 'client-side error');
      errorMessage = error.error.message;
      console.log(errorMessage);
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status} \n statusText: ${error.statusText} \n Message: ${error.message}`;
      console.log(errorMessage);
      
      // Log additional details for specific error codes
      if (error.status === 406) {
        console.log('406 Not Acceptable Error - The server cannot produce a response matching the list of acceptable values.');
        console.log('Request headers:', error.headers);
        console.log('Response body:', error.error);
      }
    }
    
    // Add a custom property to the error object for better error handling in components
    error.friendlyMessage = this.getFriendlyErrorMessage(error);
    
    return throwError(error);
  }
  
  private getFriendlyErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'You are not authorized to perform this action.';
      case 403:
        return 'You do not have permission to access this resource.';
      case 404:
        return 'The requested resource was not found.';
      case 406:
        return 'The server cannot process your request in the format provided.';
      case 409:
        return 'This operation could not be completed due to a conflict.';
      case 417:
        return 'The server cannot meet the requirements of the request.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  getHeroes(): Observable<any> {
    return this.http.get<any>('ad').pipe(
      tap((_) => this.log('fetched heroes')),
      catchError(this.MyAppHttp<any>('getHeroes', []))
    );
  }
  MyAppHttp<T>(
    arg0: string,
    arg1: never[]
  ): (
    err: any,
    caught: Observable<ArrayBuffer>
  ) => import('rxjs').ObservableInput<any> {
    throw new Error('Method not implemented.');
  }
  log(arg0: string): void {
    throw new Error('Method not implemented.');
  }

  getchangepassword<T>(url: string, tech: any = 'springBoot'): Observable<T> {
    let bearer: any = localStorage.getItem('LoginData');
    if (bearer) {
      bearer = JSON.parse(bearer);
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        token: bearer.userToken,
      });
      return this.http.get<any>(apiUrls[tech] + url, { headers: header }).pipe(
        map((response) => {
          if (response.statusCode === 401) {
            sessionStorage.clear();
            localStorage.clear();
            sessionStorage.setItem('token_expired', 'true');
            this.router.navigateByUrl('');
          }
          return response;
        }),
        catchError(this.handleError)
      );
    } else {
      // Handle the case where bearer is not found
      return throwError('User is not authenticated');
    }
  }
}
