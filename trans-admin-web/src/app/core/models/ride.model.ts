export interface Ride {
  id: string;
  rideId: string;
  driverId: string;
  passengerId: string;
  vehicleId: string;
  status: 'pending' | 'accepted' | 'started' | 'completed' | 'cancelled';
  pickupLocation: Location;
  dropLocation: Location;
  pickupTime?: Date;
  dropoffTime?: Date;
  fare: number;
  distance: number;
  duration: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Passenger {
  id: string;
  firstName: string;
  LastName: string;
  email: string;
  contactNumber: string;
  totalRides: number;
  rating: number;
  isBanned: boolean;
  isActive?: boolean;
  isOnHold?: boolean;
  holdReason?: string;
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
