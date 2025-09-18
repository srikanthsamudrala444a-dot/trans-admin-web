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
    return this.http.get(`${this.baseUrl}/passenger/${passengerId}`);
  }
}
