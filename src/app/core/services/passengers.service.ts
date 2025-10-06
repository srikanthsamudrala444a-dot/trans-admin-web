import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassengersService {

  private apiUrl = 'https://dev.glaciersoft.in.net/passenger/api';

  constructor(private http: HttpClient) {}

  // Get all passengers using /all endpoint
  getAllPassengers(): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken); // Debug log
    
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    const options: any = {};
    
    if (accessToken) {
      options.headers = headers;
    }
    
    return this.http.get(`${this.apiUrl}/v1/passenger/all`, options);
  }

  // Get passenger by ID
  getPassengerById(id: string): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken); // Debug log
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;
    return this.http.get(`${this.apiUrl}/v1/passenger/${id}`, { headers });
  }

  // Get logged-in passenger profile
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/v1/passenger/profile`);
  }

  // Register new passenger
  registerPassenger(data: any): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken); // Debug log
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;
    return this.http.post(`${this.apiUrl}/v1/passenger/register`, data, { headers });
  }

  // Update passenger by ID
  updatePassenger(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/v1/passenger/${id}/update`, data);
  }

  // Delete passenger by ID
  deletePassenger(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/v1/passenger/${id}/delete`, {});
  }

  // Query passengers (filter/search) - keeping for fallback if needed
  queryPassengers(query: any): Observable<any> {
     const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken); // Debug log
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;
    return this.http.post(`${this.apiUrl}/v1/passenger/query`, query, { headers });
  }
}
