import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../models/ride.model';


@Injectable({
  providedIn: 'root'
})
export class DriverService {
 

private apiUrl = '/api/v1/drivers';

  getDocumentList: any;

  constructor(private http: HttpClient) {}

  getAllDrivers() {
     return this.http.get('/api/v1/drivers/all');
 }

  getDriverById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/driver/${id}`);
  }

  registerDriver(driverData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/driver/register`, driverData);
  }

  createDriver(driverData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/driver/create`, driverData);
  }

  updateAvailability(id: string, availability: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/driver/${id}/availability`, availability);
  }

  getAvailableDrivers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/driver/available`);
  }

  getDrivers(): Observable<any> {
    return this.http.get('https://jsonplaceholder.typicode.com/users');
  }


  updateDriverLocation(id: string, location: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/drivers/location/${id}`, location);
  }

  uploadDriverDocument(driverId: string, selectedDocumentType: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put(`${this.apiUrl}/driver/docs/${driverId}/uploadDriverDocument`, formData);
  }

  getDriverDocuments(driverId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/driver/docs/${driverId}/getDocumentList`);
  }

getDriverLocation(driverId: string): Observable<any> {
  return this.http.get<any>('assets/mock/driver-location.json');
}


getNearbyDrivers(lat: number, lon: number, radius: number): Observable<any> {
  return this.http.get<any>('assets/mock/nearby-drivers.json');
}

getMockDriverLocation(): Observable<Driver> {
  return this.http.get<Driver>('assets/mock/driver-location.json');
}

getMockNearbyDrivers(): Observable<Driver[]> {
  return this.http.get<Driver[]>('assets/mock/nearby-drivers.json');
}


loadNearbyDrivers(lat: number, lng: number, radius: number): Observable<any> {
  return this.http.get(`/api/v1/drivers/location/nearby`, {
    params: {
      latitude: lat,
      longitude: lng,
      radius: radius
    }
  });
}

loadDriverLocation(driverId: string): Observable<any> {
  return this.http.get(`/api/v1/drivers/location/${driverId}`);
}

loadDriverDocuments(driverId: string): Observable<any> {
  return this.http.get(`/api/v1/drivers/docs/${driverId}`);
}

}
