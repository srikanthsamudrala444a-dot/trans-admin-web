import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private baseUrl = 'https://dev.glaciersoft.in.net/driver/api';

  constructor(private http: HttpClient) {}

  // ✅ 1. Get vehicle by ID
  //https://dev.glaciersoft.in.net/driver/api/vehicles/{id}
  getVehicleById(id: string): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken); // Debug log
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;
    //return this.http.get(`${this.baseUrl}/vehicles/${id}`, { headers });
    return this.http.get(`${this.baseUrl}/vehicles/${id}`, { headers });
  }

  // ✅ 2. Update vehicle details by ID
  //https://dev.glaciersoft.in.net/driver/api/vehicles/{id}
  updateVehicle(id: string, vehicleData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/vehicles/${id}`, vehicleData);
  }

  // ✅ 3. Delete vehicle by ID
  //https://dev.glaciersoft.in.net/driver/api/vehicles/{id}
  deleteVehicle(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/vehicles/${id}`);
  }

  // ✅ 4. Register a new vehicle
  //https://dev.glaciersoft.in.net/driver/api/vehicles
  registerVehicle(vehicleData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/vehicles`, vehicleData);
  }

  // ✅ 5. Query vehicles (advanced search/filter)
  //https://dev.glaciersoft.in.net/driver/api/vehicles/query
  queryVehicles(queryData: any): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken);
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;
    return this.http.post(`${this.baseUrl}/vehicles/query`, queryData, { headers });
    //return this.http.post(`${this.baseUrl}/vehicles/query`, queryData); --- IGNORE ---
    // Remove stray '}' --- IGNORE ---
    //
    //return this.http.post(`${this.baseUrl}/vehicles/query`, queryData);
  }

  // ✅ 6. Get vehicles by driver ID
  //https://dev.glaciersoft.in.net/driver/api/vehicles/driver/{driverId}
  getVehiclesByDriver(driverId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/vehicles/driver/${driverId}`);
  }

  // ✅ 7. Get all active vehicles
  //https://dev.glaciersoft.in.net/driver/api/vehicles/active
  getActiveVehicles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/vehicles/active`);
  }
}
