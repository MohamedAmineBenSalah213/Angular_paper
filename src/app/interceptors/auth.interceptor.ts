import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, from, switchMap, take, throwError } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
 
@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {
  token: any;
  angularClient:any
  constructor(private oidcSecurityService: OidcSecurityService,private router: Router,private _activatedRoute:ActivatedRoute,private msalService:MsalService,) {}
 
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const account = this.msalService.instance.getActiveAccount();
 // console.log(account,"account")
    if (account) {
      // Convert the promise to an observable
      return from(
        this.msalService.acquireTokenSilent({
          account,
          scopes: ['user.read'],
          forceRefresh: true
        })
      ).pipe(
        switchMap(response => {
        // console.log("response",response)
          // Clone the request and set the authorization header
          localStorage.setItem('accessToken', response.accessToken);
          const expiresOn = new Date(response.expiresOn);
          const now = new Date();
          if (expiresOn.getTime() < now.getTime()) {
            // Token has expired, attempt refresh
           
            return this.refreshToken(account, request, next);
          } else {
            // Token is valid, clone the request and set the authorization header
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${response.idToken}`,
              },
            });
            return next.handle(request);
          }
        }),
        catchError(error => {
          // Handle errors during token acquisition or refresh
          console.error('Error acquiring token silently:', error);
          return throwError(error);
        })
      )
    } else {
      console.error('No active account!');
      return next.handle(request); // Continue without modifying the request
    }
  }
 
  private refreshToken(account: any, request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(
      this.msalService.acquireTokenSilent({
        account,
        scopes: ['user.read']
      })
    ).pipe(
      switchMap(response => {
        // Clone the request and set the new authorization header with refreshed token
        localStorage.setItem('accessToken', response.accessToken);
        const newRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${response.idToken}`,
          },
        });
        // Continue with the next handler
        return next.handle(newRequest);
      }),
      catchError(refreshError => {
        console.error('Error refreshing token:', refreshError);
        // Optionally handle refresh error, e.g., redirect to login
        return throwError(refreshError);
      })
    );
  }
}
//93d5a0b4-00ab-4543-8b11-e2502e04cebf
    // return this.oidcSecurityService.getAccessToken().pipe(
    //   take(1), // Take the latest token value
    //   switchMap((token) => {
    //     if (token) {
    //       request = request.clone({
    //         setHeaders: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       });
    //     }
    //     const angularClient = sessionStorage.getItem('0-angularclient');
    //     const tokenObject = JSON.parse(angularClient);
    //     if (tokenObject?.authnResult?.expires_in == 0) {
    //       this.oidcSecurityService.forceRefreshSession().subscribe((result) => console.warn(result));
    //     return next.handle(request);

    //     }

    //     return next.handle(request);
    //   })
    // );
  //}

     
    
    // if (!angularClient) {
    //   console.error('Access token is not available.');
    //   this.router.navigate(['/login']);
    //   return next.handle(request);
    // }
    // // const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
    // // console.log("redirectURL",redirectURL)
    // // // // Navigate to the redirect url
    // //  this.router.navigateByUrl(redirectURL);
     
    
    // const accessToken = tokenObject?.authnResult?.access_token;

    // if (!accessToken) {
    // //   console.error('Access token is not available.');
    // //   return next.handle(request);
    //       request = request.clone({
    //         setHeaders: {
    //           Authorization: `Bearer ${accessToken}`,
    //         },
    //       });

         
    //  }

    
//   }
//}