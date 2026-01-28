export interface Vehicle {
  id: string;
  createdBy: string;
  modifiedBy: string;
  registrationNumber: string;
  model: string;
  make: string;
  yearOfManufacture: number;
  type: string;
  color: string;
  fuelType: string;
  driverId: string;
  passengerCapacity: number;
  active: boolean;
  insurancePolicyNumber: string;
  insuranceExpiryDate: string;
  registeredAt: string;
  photoUrls: any[];
  ownershipStatus: string;
  owner: Owner;
  category: string;
  verified: boolean;
}

export interface Owner {
  ownerName: string;
  ownerId: string;
  ownerType: string;
}
