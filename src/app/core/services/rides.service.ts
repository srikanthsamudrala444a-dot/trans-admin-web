import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RideService {
  // Remove trailing slash
  private baseUrl = 'https://dev.glaciersoft.in.net/ride/api';

  constructor(private http: HttpClient) {}

  // ✅ 1. Get all rides
  getAllRides(): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken); // Debug log
    const headers = accessToken
      ? new HttpHeaders({ Authorization: `Bearer ${accessToken}` })
      : undefined;
    return this.http.get(`${this.baseUrl}/v1/rides/all`, { headers });
  }
  
  // Removed getRidesByQuery - now using only getAllRides()
  /*
  getRidesByQuery(queryData: any): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken);
    const headers = accessToken
      ? new HttpHeaders({ Authorization: `Bearer ${accessToken}` })
      : undefined;
    return this.http.post(`${this.baseUrl}/rides/query`, queryData, {
      headers,
    });
  }
  */

  // ✅ 2. Get ride by ID
  getRideById(rideId: string): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken); // Debug log
    const headers = accessToken
      ? new HttpHeaders({ Authorization: `Bearer ${accessToken}` })
      : undefined;
    return this.http.get(`${this.baseUrl}/rides/${rideId}`, { headers });
  }

  // ✅ 3. Create a new ride (e.g. booking request)
  createRide(rideData: any): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken); // Debug log
    const headers = accessToken
      ? new HttpHeaders({ Authorization: `Bearer ${accessToken}` })
      : undefined;
    console.log('Creating ride with data:', rideData);
    console.log(`${this.baseUrl}/rides/create`);
    return this.http.post(`${this.baseUrl}/rides/create`, rideData, {
      headers,
    });
    //
   // return this.http.post(`${this.baseUrl}/rides/create`, rideData);
  }

  // ✅ 4. Update ride status (pending → accepted → completed/cancelled)
  updateRideStatus(rideId: string, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/rides/${rideId}/status`, { status });
  }

  // ✅ 5. Assign a driver to a ride
  assignDriver(rideId: string, driverId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/rides/${rideId}/assign`, {
      driverId,
    });
  }

  // ✅ 6. Get rides by passenger (customer)
  getRidesByPassenger(passengerId: string): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken); // Debug log
    const headers = accessToken
      ? new HttpHeaders({ Authorization: `Bearer ${accessToken}` })
      : undefined;
    return this.http.get(
      `${this.baseUrl}/rides/history/passenger/${passengerId}`,
      { headers }
    );
    //
    //return this.http.get(`${this.baseUrl}/rides/history/passenger/${passengerId}`);
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

  // ✅ 11. Create ride options
  createRideOptions(rideData: any): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken);
    const headers = accessToken
      ? new HttpHeaders({ Authorization: `Bearer ${accessToken}` })
      : undefined;
    console.log(`${this.baseUrl}/ride/options/all`);
    return this.http.post(`${this.baseUrl}/ride/options`, rideData, {
      headers,
    });
  }

  // ✅ 12. Get All Ride Options
  getAllRideOptions(): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken);
    const headers = accessToken
      ? new HttpHeaders({ Authorization: `Bearer ${accessToken}` })
      : undefined;
    console.log(`${this.baseUrl}/ride/options/all`);

    return this.http.get(`${this.baseUrl}/ride/options/all`, {
      headers,
    });
  }

  // ✅ 13. Get ride tracking details
  getRideTracking(rideId: string): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken);
    const headers = accessToken
      ? new HttpHeaders({ Authorization: `Bearer ${accessToken}` })
      : undefined;
    console.log(`${this.baseUrl}/rides/tracking/${rideId}`);

    return this.http.get(`${this.baseUrl}/rides/tracking/${rideId}`, {
      headers,
    });
  }
}
