export interface DriverQuery {
  pageNumber: number;
  itemsPerPage: number;
  retrieveInactive?: boolean;
  sort?: SortOption[];
  filters?: DriverFilters;
}
export interface SortOption {
  fieldName: string;
  sortDirection: 'ASCENDING' | 'DESCENDING';
}
export interface DriverFilters {
  status?: string;
  firstName?: string;
  lastName?: string;
}

export interface Driver {
  id: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  drivingLicense: string;
  rating: number;
  contactNumber: number;
  email: string;
  totalRatingPoints: number;
  ratingCount: number;
  averageRating: number;
  vehicleIds: any[];
  photoUrl: string;
  subscription: boolean;
  onDuty: boolean;
  joinedAt: string;
  documentsStatus: 'pending' | 'approved' | 'rejected';
  status: 'online' | 'offline' | 'busy' | 'active' | 'inactive';
  tenant: string;
  available: boolean;
}
