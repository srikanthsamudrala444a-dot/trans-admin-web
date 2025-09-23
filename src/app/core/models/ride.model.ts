export interface Ride {
  id: string;
  rideId: string;
  driverId: string;
  passengerId: string;
  vehicleId: string;
  status: 'pending' | 'accepted' | 'started' | 'completed' | 'cancelled';
  pickupLocation: Location;
  dropoffLocation: Location;
  pickupTime?: Date;
  dropoffTime?: Date;
  fare: number;
  distance: number;
  duration: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Driver {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  licenseNumber: string;
  status: 'online' | 'offline' | 'busy' | 'active' | 'inactive';
  rating: number;
  totalRides: number;
  earnings: number;
  vehicleId?: string;
  isApproved: boolean;
  documentsStatus: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface Passenger {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalRides: number;
  rating: number;
  isBanned: boolean;
  createdAt: Date;
}

export interface Document {
  id: string;
  driverId: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
}

export interface RideOptions {
  id: string;
  type: VehicleCategory;
  baseFare: number;
  perKm: number;
  perMin: number;
  seatCapacity: number;
  iconUrl: string;
}

export enum VehicleCategory {
  BIKE = 'BIKE',
  CAB = 'CAB',
  AUTO = 'AUTO',
  BUS = 'BUS',
  TRACTOR = 'TRACTOR',
  TRUCK = 'TRUCK',
}
