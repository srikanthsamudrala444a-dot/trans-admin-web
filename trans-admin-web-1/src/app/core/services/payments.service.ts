import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';

// Payment Status Enum
export type PaymentStatus = 'Completed' | 'Pending' | 'Failed' | 'Refunded' | 'Processing';
export type TransactionType = 'Ride Payment' | 'Driver Payout' | 'Refund' | 'Commission' | 'Tax Deduction' | 'Bonus Payment';

// Core Payment Interface
export interface Payment {
  id: string;
  rideId: string;
  driverId: string;
  passengerId: string;
  driverName: string;
  passengerName: string;
  transactionId: string;
  type: TransactionType;
  status: PaymentStatus;
  createdAt: Date;
  completedAt?: Date;
  
  // Detailed Breakdown
  breakdown: PaymentBreakdown;
  
  // Payment Method
  paymentMethod: string;
  
  // Additional Info
  description?: string;
  failureReason?: string;
}

// Detailed Payment Breakdown
export interface PaymentBreakdown {
  // Base amounts
  totalAmount: number;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  
  // Fees and additions
  platformFee: number;
  serviceFee: number;
  bookingFee: number;
  
  // Discounts and promotions
  discount: number;
  promoCode?: string;
  promoDiscount: number;
  
  // Commissions and taxes
  platformCommission: number;
  driverEarnings: number;
  
  // Tax breakdown
  taxes: TaxBreakdown;
  
  // Additional charges
  surgeMultiplier: number;
  surgeAmount: number;
  tolls: number;
  parkingFee: number;
  
  // Tips and extras
  tip: number;
  cancellationFee: number;
  
  // Refund details (if applicable)
  refund?: RefundDetails;
}

// Tax Breakdown Interface
export interface TaxBreakdown {
  gst: number;
  serviceTax: number;
  localTax: number;
  totalTax: number;
  taxRate: number;
}

// Refund Details
export interface RefundDetails {
  refundAmount: number;
  refundReason: string;
  refundDate: Date;
  refundMethod: string;
  processingFee: number;
  netRefund: number;
}

// Payment Statistics
export interface PaymentStats {
  totalRevenue: number;
  totalEarnings: number;
  totalCommissions: number;
  totalTaxes: number;
  totalRefunds: number;
  averageRideValue: number;
  commissionRate: number;
  refundRate: number;
  totalTransactions: number;
  pendingPayments: number;
  failedPayments: number;
}

// Paginated Payments Response
export interface PaginatedPayments {
  payments: Payment[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Payment Filters
export interface PaymentFilters {
  status?: PaymentStatus;
  type?: TransactionType;
  dateFrom?: Date;
  dateTo?: Date;
  driverId?: string;
  passengerId?: string;
  minAmount?: number;
  maxAmount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private mockPayments: Payment[] = [
    {
      id: 'PAY001',
      rideId: 'RIDE001',
      driverId: 'DRV001',
      passengerId: 'PASS001',
      driverName: 'Rajesh Kumar',
      passengerName: 'Priya Sharma',
      transactionId: 'TXN001234567',
      type: 'Ride Payment',
      status: 'Completed',
      createdAt: new Date('2024-10-08T14:30:00'),
      completedAt: new Date('2024-10-08T14:32:15'),
      paymentMethod: 'UPI - PhonePe',
      description: 'Airport to Hotel ride payment',
      breakdown: {
        totalAmount: 450,
        baseFare: 100,
        distanceFare: 180,
        timeFare: 60,
        platformFee: 20,
        serviceFee: 15,
        bookingFee: 10,
        discount: 25,
        promoCode: 'FIRST25',
        promoDiscount: 25,
        platformCommission: 90,
        driverEarnings: 335,
        taxes: {
          gst: 81,
          serviceTax: 15,
          localTax: 5,
          totalTax: 101,
          taxRate: 18
        },
        surgeMultiplier: 1.2,
        surgeAmount: 40,
        tolls: 25,
        parkingFee: 0,
        tip: 50,
        cancellationFee: 0
      }
    },
    {
      id: 'PAY002',
      rideId: 'RIDE002',
      driverId: 'DRV002',
      passengerId: 'PASS002',
      driverName: 'Amit Singh',
      passengerName: 'Rahul Mehta',
      transactionId: 'TXN001234568',
      type: 'Driver Payout',
      status: 'Completed',
      createdAt: new Date('2024-10-08T15:45:00'),
      completedAt: new Date('2024-10-08T15:47:30'),
      paymentMethod: 'Bank Transfer',
      description: 'Weekly driver payout',
      breakdown: {
        totalAmount: 2850,
        baseFare: 2500,
        distanceFare: 0,
        timeFare: 0,
        platformFee: 0,
        serviceFee: 0,
        bookingFee: 0,
        discount: 0,
        promoDiscount: 0,
        platformCommission: 570,
        driverEarnings: 2850,
        taxes: {
          gst: 513,
          serviceTax: 75,
          localTax: 25,
          totalTax: 613,
          taxRate: 18
        },
        surgeMultiplier: 1,
        surgeAmount: 0,
        tolls: 0,
        parkingFee: 0,
        tip: 350,
        cancellationFee: 0
      }
    },
    {
      id: 'PAY003',
      rideId: 'RIDE003',
      driverId: 'DRV003',
      passengerId: 'PASS003',
      driverName: 'Suresh Patel',
      passengerName: 'Anita Gupta',
      transactionId: 'TXN001234569',
      type: 'Refund',
      status: 'Completed',
      createdAt: new Date('2024-10-08T10:15:00'),
      completedAt: new Date('2024-10-08T10:17:45'),
      paymentMethod: 'Credit Card - Visa',
      description: 'Ride cancelled by driver - full refund',
      breakdown: {
        totalAmount: 325,
        baseFare: 80,
        distanceFare: 150,
        timeFare: 45,
        platformFee: 18,
        serviceFee: 12,
        bookingFee: 8,
        discount: 15,
        promoDiscount: 15,
        platformCommission: 65,
        driverEarnings: 0,
        taxes: {
          gst: 58.5,
          serviceTax: 10,
          localTax: 3,
          totalTax: 71.5,
          taxRate: 18
        },
        surgeMultiplier: 1,
        surgeAmount: 0,
        tolls: 12,
        parkingFee: 0,
        tip: 0,
        cancellationFee: 0,
        refund: {
          refundAmount: 325,
          refundReason: 'Driver cancelled - vehicle breakdown',
          refundDate: new Date('2024-10-08T10:17:45'),
          refundMethod: 'Original Payment Method',
          processingFee: 5,
          netRefund: 320
        }
      }
    },
    {
      id: 'PAY004',
      rideId: 'RIDE004',
      driverId: 'DRV001',
      passengerId: 'PASS004',
      driverName: 'Rajesh Kumar',
      passengerName: 'Vikram Agarwal',
      transactionId: 'TXN001234570',
      type: 'Commission',
      status: 'Completed',
      createdAt: new Date('2024-10-08T16:20:00'),
      completedAt: new Date('2024-10-08T16:20:00'),
      paymentMethod: 'System Transfer',
      description: 'Platform commission collection',
      breakdown: {
        totalAmount: 125,
        baseFare: 0,
        distanceFare: 0,
        timeFare: 0,
        platformFee: 0,
        serviceFee: 0,
        bookingFee: 0,
        discount: 0,
        promoDiscount: 0,
        platformCommission: 125,
        driverEarnings: 0,
        taxes: {
          gst: 22.5,
          serviceTax: 5,
          localTax: 2,
          totalTax: 29.5,
          taxRate: 18
        },
        surgeMultiplier: 1,
        surgeAmount: 0,
        tolls: 0,
        parkingFee: 0,
        tip: 0,
        cancellationFee: 0
      }
    },
    {
      id: 'PAY005',
      rideId: 'RIDE005',
      driverId: 'DRV004',
      passengerId: 'PASS005',
      driverName: 'Mohammad Ali',
      passengerName: 'Sunita Rao',
      transactionId: 'TXN001234571',
      type: 'Ride Payment',
      status: 'Failed',
      createdAt: new Date('2024-10-08T12:10:00'),
      paymentMethod: 'Debit Card - HDFC',
      description: 'Payment failed - insufficient funds',
      failureReason: 'Insufficient funds in account',
      breakdown: {
        totalAmount: 280,
        baseFare: 70,
        distanceFare: 120,
        timeFare: 35,
        platformFee: 15,
        serviceFee: 10,
        bookingFee: 8,
        discount: 0,
        promoDiscount: 0,
        platformCommission: 56,
        driverEarnings: 0,
        taxes: {
          gst: 50.4,
          serviceTax: 8,
          localTax: 2.5,
          totalTax: 60.9,
          taxRate: 18
        },
        surgeMultiplier: 1,
        surgeAmount: 0,
        tolls: 15,
        parkingFee: 7,
        tip: 0,
        cancellationFee: 0
      }
    },
    {
      id: 'PAY006',
      rideId: 'RIDE006',
      driverId: 'DRV002',
      passengerId: 'PASS006',
      driverName: 'Amit Singh',
      passengerName: 'Deepika Malhotra',
      transactionId: 'TXN001234572',
      type: 'Bonus Payment',
      status: 'Completed',
      createdAt: new Date('2024-10-07T18:30:00'),
      completedAt: new Date('2024-10-07T18:31:15'),
      paymentMethod: 'Wallet Transfer',
      description: 'Monthly performance bonus',
      breakdown: {
        totalAmount: 500,
        baseFare: 500,
        distanceFare: 0,
        timeFare: 0,
        platformFee: 0,
        serviceFee: 0,
        bookingFee: 0,
        discount: 0,
        promoDiscount: 0,
        platformCommission: 0,
        driverEarnings: 500,
        taxes: {
          gst: 90,
          serviceTax: 15,
          localTax: 5,
          totalTax: 110,
          taxRate: 18
        },
        surgeMultiplier: 1,
        surgeAmount: 0,
        tolls: 0,
        parkingFee: 0,
        tip: 0,
        cancellationFee: 0
      }
    }
  ];

  constructor() { }

  getPayments(
    page: number = 1,
    pageSize: number = 10,
    searchTerm: string = '',
    filters: PaymentFilters = {}
  ): Observable<PaginatedPayments> {
    return of(null).pipe(
      delay(800), // Simulate API delay
      map(() => {
        let filteredPayments = [...this.mockPayments];

        // Apply search filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filteredPayments = filteredPayments.filter(payment =>
            payment.transactionId.toLowerCase().includes(term) ||
            payment.driverName.toLowerCase().includes(term) ||
            payment.passengerName.toLowerCase().includes(term) ||
            payment.description?.toLowerCase().includes(term)
          );
        }

        // Apply status filter
        if (filters.status) {
          filteredPayments = filteredPayments.filter(payment => payment.status === filters.status);
        }

        // Apply type filter
        if (filters.type) {
          filteredPayments = filteredPayments.filter(payment => payment.type === filters.type);
        }

        // Apply date filters
        if (filters.dateFrom) {
          filteredPayments = filteredPayments.filter(payment => payment.createdAt >= filters.dateFrom!);
        }

        if (filters.dateTo) {
          filteredPayments = filteredPayments.filter(payment => payment.createdAt <= filters.dateTo!);
        }

        // Apply amount filters
        if (filters.minAmount !== undefined) {
          filteredPayments = filteredPayments.filter(payment => payment.breakdown.totalAmount >= filters.minAmount!);
        }

        if (filters.maxAmount !== undefined) {
          filteredPayments = filteredPayments.filter(payment => payment.breakdown.totalAmount <= filters.maxAmount!);
        }

        // Sort by creation date (newest first)
        filteredPayments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        // Calculate pagination
        const totalItems = filteredPayments.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

        return {
          payments: paginatedPayments,
          totalItems,
          totalPages,
          currentPage: page,
          hasNext: page < totalPages,
          hasPrevious: page > 1
        };
      })
    );
  }

  getPaymentStats(): Observable<PaymentStats> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const completedPayments = this.mockPayments.filter(p => p.status === 'Completed');
        const refundedPayments = this.mockPayments.filter(p => p.status === 'Refunded');
        
        const totalRevenue = completedPayments
          .filter(p => p.type === 'Ride Payment')
          .reduce((sum, p) => sum + p.breakdown.totalAmount, 0);
        
        const totalEarnings = completedPayments
          .reduce((sum, p) => sum + p.breakdown.driverEarnings, 0);
        
        const totalCommissions = completedPayments
          .reduce((sum, p) => sum + p.breakdown.platformCommission, 0);
        
        const totalTaxes = completedPayments
          .reduce((sum, p) => sum + p.breakdown.taxes.totalTax, 0);
        
        const totalRefunds = refundedPayments
          .reduce((sum, p) => sum + (p.breakdown.refund?.netRefund || 0), 0);

        const ridePayments = completedPayments.filter(p => p.type === 'Ride Payment');
        const averageRideValue = ridePayments.length > 0 
          ? ridePayments.reduce((sum, p) => sum + p.breakdown.totalAmount, 0) / ridePayments.length 
          : 0;

        return {
          totalRevenue,
          totalEarnings,
          totalCommissions,
          totalTaxes,
          totalRefunds,
          averageRideValue,
          commissionRate: totalRevenue > 0 ? (totalCommissions / totalRevenue) * 100 : 0,
          refundRate: (refundedPayments.length / this.mockPayments.length) * 100,
          totalTransactions: this.mockPayments.length,
          pendingPayments: this.mockPayments.filter(p => p.status === 'Pending').length,
          failedPayments: this.mockPayments.filter(p => p.status === 'Failed').length
        };
      })
    );
  }

  getPaymentById(id: string): Observable<Payment | null> {
    return of(this.mockPayments.find(payment => payment.id === id) || null).pipe(
      delay(300)
    );
  }

  processRefund(paymentId: string, refundAmount: number, reason: string): Observable<Payment> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const payment = this.mockPayments.find(p => p.id === paymentId);
        if (payment) {
          payment.status = 'Refunded';
          payment.breakdown.refund = {
            refundAmount,
            refundReason: reason,
            refundDate: new Date(),
            refundMethod: 'Original Payment Method',
            processingFee: Math.round(refundAmount * 0.015), // 1.5% processing fee
            netRefund: refundAmount - Math.round(refundAmount * 0.015)
          };
        }
        return payment!;
      })
    );
  }

  retryPayment(paymentId: string): Observable<Payment> {
    return of(null).pipe(
      delay(2000),
      map(() => {
        const payment = this.mockPayments.find(p => p.id === paymentId);
        if (payment) {
          payment.status = 'Completed';
          payment.completedAt = new Date();
          payment.failureReason = undefined;
        }
        return payment!;
      })
    );
  }

  exportPayments(filters: PaymentFilters = {}): Observable<Blob> {
    // Simulate CSV export
    return of(null).pipe(
      delay(1500),
      map(() => {
        const csvContent = 'Transaction ID,Type,Status,Amount,Driver,Passenger,Date\n' +
          this.mockPayments.map(p => 
            `${p.transactionId},${p.type},${p.status},₹${p.breakdown.totalAmount},${p.driverName},${p.passengerName},${p.createdAt.toLocaleDateString()}`
          ).join('\n');
        
        return new Blob([csvContent], { type: 'text/csv' });
      })
    );
  }
}
