import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private baseUrl = 'https://dev.glaciersoft.in.net/ride/api/';

  constructor(private http: HttpClient) {}

  // ✅ 1. Get all rides
  getAllRides(): Observable<any> {
    return this.http.get(`${this.baseUrl}/v1/rides/all`);
  }
  getRidesByQuery(queryData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/v1/rides/query`, queryData);
  }

  // ✅ 2. Get ride by ID
  getRideById(rideId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/rides/${rideId}`);
  }

  // ✅ 3. Create a new ride (e.g. booking request)
  createRide(rideData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/rides/create`, rideData);
  }
  
  // ✅ 4. Update ride status (pending → accepted → completed/cancelled)
  updateRideStatus(rideId: string, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/rides/${rideId}/status`, { status });
  }

  // ✅ 5. Assign a driver to a ride
  assignDriver(rideId: string, driverId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/rides/${rideId}/assign`, { driverId });
  }

  // ✅ 6. Get rides by passenger (customer)
  getRidesByPassenger(passengerId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/rides/passenger/${passengerId}`);
  }

  // ✅ 7. Get rides by driver
  getRidesByDriver(driverId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/rides/driver/${driverId}`);
  }

  // ✅ 8. Cancel ride
  cancelRide(rideId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/rides/${rideId}/cancel`, {});
  }

  // ✅ 9. Get nearby available rides (for drivers to accept)
  getNearbyRides(lat: number, lng: number, radius: number): Observable<any> {
    const params = new HttpParams()
      .set('latitude', lat.toString())
      .set('longitude', lng.toString())
      .set('radius', radius.toString());

    return this.http.get(`${this.baseUrl}/rides/nearby`, { params });
  }

  // ✅ 10. Get ride history (completed rides for a passenger or driver)
  getRideHistory(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/rides/history/${userId}`);
  }
}
