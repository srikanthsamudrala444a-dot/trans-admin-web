import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginUrl = 'https://dev.glaciersoft.in.net/authentication/api/v1/auth/login';

  constructor(private http: HttpClient) {}

  

    login(credentials: { contactNumber: string; pin: string }): Observable<any> {
      return this.http.post(this.loginUrl, credentials);
    }
}
