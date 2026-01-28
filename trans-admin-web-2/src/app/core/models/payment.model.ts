export interface Transaction {
  id: string;
  type: 'cash' | 'upi' | 'card' | 'wallet';
  amount: number;
  date: Date;
  rideId: string;
  driverId: string;
  driverName: string;
  passengerId: string;
  passengerName: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentGateway?: string;
  transactionId?: string;
  commissionRate: number;
  driverEarnings: number;
  companyCommission: number;
  vehicleCategory: string;
  pickupLocation: string;
  dropoffLocation: string;
  distance: number;
  duration: number;
  baseFare: number;
  kmRate: number;
  timeRate: number;
  waitingCharges?: number;
  tolls?: number;
  taxes: number;
  tips?: number;
  discounts?: number;
  promocode?: string;
}

export interface Invoice {
  id: string;
  type: 'driver' | 'company';
  driverId?: string;
  driverName?: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  totalRides: number;
  totalEarnings: number;
  totalCommission: number;
  netAmount: number;
  transactions: Transaction[];
  status: 'generated' | 'sent' | 'paid' | 'overdue';
  generatedDate: Date;
  dueDate?: Date;
  paidDate?: Date;
  invoiceNumber: string;
  taxAmount: number;
  deductions?: {
    type: string;
    amount: number;
    description: string;
  }[];
  bonuses?: {
    type: string;
    amount: number;
    description: string;
  }[];
}

export interface PaymentSummary {
  totalTransactions: number;
  totalRevenue: number;
  cashTransactions: {
    count: number;
    amount: number;
  };
  upiTransactions: {
    count: number;
    amount: number;
  };
  cardTransactions: {
    count: number;
    amount: number;
  };
  walletTransactions: {
    count: number;
    amount: number;
  };
  totalCommission: number;
  totalDriverEarnings: number;
  pendingPayments: number;
  failedTransactions: number;
  refundedAmount: number;
}

export interface InvoiceFilters {
  type?: 'driver' | 'company';
  status?: 'generated' | 'sent' | 'paid' | 'overdue';
  driverId?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export interface TransactionFilters {
  type?: 'cash' | 'upi' | 'card' | 'wallet';
  status?: 'completed' | 'pending' | 'failed' | 'refunded';
  driverId?: string;
  passengerId?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}
