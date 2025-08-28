import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private baseUrl = 'https://dev.glaciersoft.in.net/driver/api/v1';

  getDocumentList: any;

  constructor(private http: HttpClient) {}

  getAllDrivers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/driver/all`);
  }

  getDriverById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/driver/${id}`);
  }

  registerDriver(driverData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/driver/register`, driverData);
  }

  createDriver(driverData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/driver/create`, driverData);
  }

  updateAvailability(id: string, availability: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/driver/${id}/availability`, availability);
  }

  getAvailableDrivers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/driver/available`);
  }


  updateDriverLocation(id: string, location: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/drivers/location/${id}`, location);
  }

  uploadDriverDocument(driverId: string, selectedDocumentType: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put(`${this.baseUrl}/driver/docs/${driverId}/uploadDriverDocument`, formData);
  }

  getDriverDocuments(driverId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/driver/docs/${driverId}/getDocumentList`);
  }

  getDriverLocation(driverId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/drivers/location/${driverId}`);
  }

  getNearbyDrivers(lat: number, lng: number, radius: number): Observable<any> {
    const params = new HttpParams()
      .set('latitude', lat.toString())
      .set('longitude', lng.toString())
      .set('radius', radius.toString());

    return this.http.get(`${this.baseUrl}/drivers/location/nearby`, { params });
  }
}
