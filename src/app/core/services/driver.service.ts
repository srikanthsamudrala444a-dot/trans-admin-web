import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Driver, DriverQuery } from '../models/driver.model';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private apiUrl = 'https://dev.glaciersoft.in.net/driver/api';

  getDocumentList: any;

  constructor(private http: HttpClient) {}
  //https://dev.glaciersoft.in.net/driver/api/v1/driver/all
  //getAllDriversSimple(): Observable<any> {
  //return this.http.get(`${this.apiUrl}/v1/driver/all`);
  //}
  // Update: Accept pagination params for drivers
  getAllDrivers(params?: {
    pageNumber?: number;
    itemsPerPage?: number;
  }): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;

    let options: any = {};
    if (params) {
      const httpParams = new HttpParams()
        .set('pageNumber', params.pageNumber?.toString() || '1')
        .set('itemsPerPage', params.itemsPerPage?.toString() || '10');
      options.params = httpParams;
    }
    if (headers) {
      options.headers = headers;
    }
    return this.http.get(`${this.apiUrl}/v1/driver/all`, options);
  }
  //https://dev.glaciersoft.in.net/driver/api/v1/driver/{id}
  getDriverById(id: string): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;

    let options: any = {};
    if (headers) {
      options.headers = headers;
    }
    return this.http.get(`${this.apiUrl}/v1/driver/${id}`, options);
    //return this.http.get(`${this.apiUrl}/v1/driver/${id}`);

    //return this.http.get(`${this.apiUrl}/v1/driver/${id}`);
  }
  //https://dev.glaciersoft.in.net/driver/api/v1/driver/register
  registerDriver(driverData: any): Observable<any> {
    console.log('Sending driver data to API:', driverData); // Debug log

    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;

    let options: any = {};
    if (headers) {
      options.headers = headers;
    }

    return this.http.post(
      `${this.apiUrl}/v1/driver/register`,
      driverData,
      options
    );
  }
  //https://dev.glaciersoft.in.net/driver/api/v1/plan/create
  createDriver(driverData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/v1/plan/create`, driverData);
  }
  //https://dev.glaciersoft.in.net/driver/api/v1/driver/{id}/availability?available=true

  updateAvailability(id: string, availability: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/v1/driver/${id}/availability?available=true`,
      availability
    );
  }
  //https://dev.glaciersoft.in.net/driver/api/v1/driver/available
  getAvailableDrivers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/v1/driver/available`);
  }
  //
  getDrivers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/v1/driver`);
  }
  //https://dev.glaciersoft.in.net/driver/api/v1/drivers/location/0?lat=0&lon=0
  updateDriverLocation(id: string, location: any): Observable<any> {
    return this.http.post(`${this.apiUrl}v1/driver/location/${id}`, location);
  }

  uploadDriverDocument(driverId: string, selectedDocumentType: string, file: File): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;

    let options: any = {};
    if (headers) {
      options.headers = headers;
    }
    const formData = new FormData();
    formData.append('file', file);
    // Optionally add document type if needed by backend
    // formData.append('documentType', selectedDocumentType);

    return this.http.put(
      `${this.apiUrl}/docs/${driverId}/uploadDriverDocument`,
      formData,
      options
    );
  }
  //https://dev.glaciersoft.in.net/driver/api/v1/driver/docs/{driverId}/getDocumentList///api/v1/driver/docs/{driverId}/getDocumentList
  getDriverDocuments(driverId: string): Observable<any> {
    console.log('DriverService: getDriverDocuments called with driverId:', driverId);
    
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access token exists:', !!accessToken);
    
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;

    let options: any = {};
    if (headers) {
      options.headers = headers;
    }
    
    const url = `${this.apiUrl}/v1/driver/docs/${driverId}/getDocumentList`;
    console.log('API URL:', url);
    
    return this.http.get(url, options);
  }
  getDocuementVerificationList(driverId: string): Observable<any> {
    console.log('DriverService: getDocuementVerificationList called with driverId:', driverId);
    
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access token exists:', !!accessToken);
    
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;

    let options: any = {};
    if (headers) {
      options.headers = headers;
    }
    
    const url = `${this.apiUrl}/v1/driver/docs/${driverId}/getDocumentList`;
    console.log('API URL:', url);
    
    return this.http.get(url, options);
  }
  ///api/v1/drivers/location/nearby  //https://dev.glaciersoft.in.net/driver/api/v1/drivers/location/nearby?lat=0&lon=0&radius=0
  getDriverLocation(driverId: string): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}v1/drivers/location/nearby`);
  }

  getNearbyDrivers(
    lat: number,
    lng: number,
    radius: number
  ): Observable<Driver[]> {
    return this.http.get<Driver[]>(
      `${this.apiUrl}/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    );
  }

  // Updated to fetch real data from backend
  loadNearbyDrivers(lat: number, lng: number, radius: number): Observable<any> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('radius', radius.toString());
    return this.http.get(`${this.apiUrl}/nearby`, { params });
  }

  loadDriverLocation(driverId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/location/${driverId}`);
  }

  loadDriverDocuments(driverId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/docs/${driverId}/getDocumentList`);
  }
  loadAllDrivers(): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;

    let options: any = {};
    if (headers) {
      options.headers = headers;
    }
    return this.http.get(`${this.apiUrl}/v1/drivers/all`, options);
  }
  // pagination
  getDriversByQuery(query: DriverQuery): Observable<any> {
    console.log('DriverService: getDriversByQuery called with query:', query);
    
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access token exists:', !!accessToken);
    
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;

    let options: any = {};
    if (headers) {
      options.headers = headers;
    }
    
    const url = `${this.apiUrl}/v1/driver/query`;
    console.log('API URL:', url);
    console.log('Query body:', query);
    
    return this.http.post(url, query, options);
  }

  approveDocument(driverId: string, documentId: string): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;

    let options: any = {};
    if (headers) {
      options.headers = headers;
    }
    
    return this.http.put(
      `${this.apiUrl}/v1/driver/docs/${driverId}/document/${documentId}/approve`,
      {},
      options
    );
  }

  rejectDocument(driverId: string, documentId: string, reason: string): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;

    let options: any = {};
    if (headers) {
      options.headers = headers;
    }
    
    const body = { rejectionReason: reason };
    
    return this.http.put(
      `${this.apiUrl}/v1/driver/docs/${driverId}/document/${documentId}/reject`,
      body,
      options
    );
  }

  // Test method to check API connectivity and authentication
  testConnection(): Observable<any> {
    console.log('Testing API connection...');
    
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access token for test:', accessToken ? 'Present' : 'Missing');
    
    if (!accessToken) {
      console.error('No access token found in localStorage');
      return throwError(() => new Error('No access token found'));
    }
    
    const headers = { Authorization: `Bearer ${accessToken}` };
    const options = { headers };
    
    // Try a simple endpoint first
    const testUrl = `${this.apiUrl}/v1/driver/all`;
    console.log('Test URL:', testUrl);
    
    return this.http.get(testUrl, options);
  }
}
