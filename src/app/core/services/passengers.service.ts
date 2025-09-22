import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassengersService {

  private apiUrl = 'https://dev.glaciersoft.in.net/passenger';

  constructor(private http: HttpClient) {}

  // Get all passengers
  //https://dev.glaciersoft.in.net/passenger/passenger/all
  getAllPassengers(): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken); // Debug log
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;
    return this.http.get(`${this.apiUrl}/passenger/all`, { headers });
  }

  // Get passenger by ID
  getPassengerById(id: string): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken); // Debug log
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;
    return this.http.get(`${this.apiUrl}/passenger/${id}`, { headers });
  }

  // Get logged-in passenger profile
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/passenger/profile`);
  }

  // Register new passenger
  registerPassenger(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/passenger/register`, data);
  }

  // Update passenger by ID
  //https://dev.glaciersoft.in.net/passenger/passenger/{id}/update
  updatePassenger(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/passenger/${id}/update`, data);
  }

  // Delete passenger by ID
  deletePassenger(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/passenger/${id}/delete`, {});
  }

  // Query passengers (filter/search)
  queryPassengers(query: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/passenger/query`, query);
  }
}
