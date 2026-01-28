import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassengerService {
  private baseUrl = 'https://dev.glaciersoft.in.net/ride/api/';

  constructor(private http: HttpClient) {}

  getPassengerById(passengerId: string): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken); // Debug log
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;
    return this.http.get(`${this.baseUrl}/passenger/${passengerId}`, { headers });
    //
    //return this.http.get(`${this.baseUrl}/passenger/${passengerId}`);
  }
}
