import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Transaction, Invoice, PaymentSummary, InvoiceFilters } from '../models/payment.model';

interface PaginatedInvoices {
  invoices: Invoice[];
  totalItems: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private mockTransactions: Transaction[] = [
    {
      id: 'txn-001',
      type: 'cash',
      amount: 450,
      date: new Date('2024-01-15'),
      rideId: 'ride-001',
      driverId: 'drv-001',
      driverName: 'Rajesh Kumar',
      passengerId: 'pass-001',
      passengerName: 'Priya Sharma',
      status: 'completed',
      paymentGateway: 'Cash Payment',
      transactionId: 'cash-txn-001',
      commissionRate: 20,
      driverEarnings: 360,
      companyCommission: 90,
      vehicleCategory: 'Economy',
      pickupLocation: 'Koramangala',
      dropoffLocation: 'Whitefield',
      distance: 18.5,
      duration: 35,
      baseFare: 100,
      kmRate: 12,
      timeRate: 2,
      waitingCharges: 20,
      tolls: 25,
      taxes: 45,
      tips: 50,
      discounts: 0
    },
    {
      id: 'txn-002',
      type: 'upi',
      amount: 680,
      date: new Date('2024-01-15'),
      rideId: 'ride-002',
      driverId: 'drv-001',
      driverName: 'Rajesh Kumar',
      passengerId: 'pass-002',
      passengerName: 'Amit Patel',
      status: 'completed',
      paymentGateway: 'PhonePe',
      transactionId: 'upi-txn-002',
      commissionRate: 20,
      driverEarnings: 544,
      companyCommission: 136,
      vehicleCategory: 'Premium',
      pickupLocation: 'Indiranagar',
      dropoffLocation: 'Airport',
      distance: 22.3,
      duration: 45,
      baseFare: 150,
      kmRate: 15,
      timeRate: 3,
      waitingCharges: 0,
      tolls: 80,
      taxes: 68,
      tips: 100,
      discounts: 50
    },
    // Add more transactions...
  ];

  private mockInvoices: Invoice[] = [
    {
      id: 'inv-001',
      type: 'driver',
      driverId: 'drv-001',
      driverName: 'Rajesh Kumar',
      period: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07')
      },
      totalRides: 45,
      totalEarnings: 15750,
      totalCommission: 3150,
      netAmount: 12600,
      transactions: this.mockTransactions.filter(t => t.driverId === 'drv-001'),
      status: 'generated',
      generatedDate: new Date('2024-01-08'),
      dueDate: new Date('2024-01-15'),
      invoiceNumber: 'DRV-2024-001',
      taxAmount: 1260,
      deductions: [
        {
          type: 'Fuel Advance',
          amount: 500,
          description: 'Fuel advance deduction'
        }
      ],
      bonuses: [
        {
          type: 'Performance Bonus',
          amount: 1000,
          description: 'Weekly performance bonus'
        }
      ]
    },
    {
      id: 'inv-002',
      type: 'driver',
      driverId: 'drv-002',
      driverName: 'Suresh Singh',
      period: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07')
      },
      totalRides: 38,
      totalEarnings: 12450,
      totalCommission: 2490,
      netAmount: 9960,
      transactions: [],
      status: 'sent',
      generatedDate: new Date('2024-01-08'),
      dueDate: new Date('2024-01-15'),
      invoiceNumber: 'DRV-2024-002',
      taxAmount: 996,
      deductions: [],
      bonuses: []
    },
    {
      id: 'inv-003',
      type: 'company',
      period: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31')
      },
      totalRides: 1250,
      totalEarnings: 456750,
      totalCommission: 91350,
      netAmount: 365400,
      transactions: this.mockTransactions,
      status: 'paid',
      generatedDate: new Date('2024-02-01'),
      paidDate: new Date('2024-02-05'),
      invoiceNumber: 'COMP-2024-001',
      taxAmount: 45675
    }
  ];

  constructor() {}

  // Get paginated invoices with filters
  getInvoices(
    page: number = 1, 
    limit: number = 10, 
    filters: InvoiceFilters = {}
  ): Observable<PaginatedInvoices> {
    return of(null).pipe(
      delay(800),
      map(() => {
        let filteredInvoices = [...this.mockInvoices];

        // Apply filters
        if (filters.type) {
          filteredInvoices = filteredInvoices.filter(invoice => invoice.type === filters.type);
        }

        if (filters.status) {
          filteredInvoices = filteredInvoices.filter(invoice => invoice.status === filters.status);
        }

        if (filters.driverId) {
          filteredInvoices = filteredInvoices.filter(invoice => invoice.driverId === filters.driverId);
        }

        if (filters.dateRange) {
          filteredInvoices = filteredInvoices.filter(invoice => {
            const invoiceDate = invoice.generatedDate;
            return invoiceDate >= filters.dateRange!.startDate && 
                   invoiceDate <= filters.dateRange!.endDate;
          });
        }

        // Sort by date (newest first)
        filteredInvoices.sort((a, b) => b.generatedDate.getTime() - a.generatedDate.getTime());

        const totalItems = filteredInvoices.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

        return {
          invoices: paginatedInvoices,
          totalItems,
          totalPages
        };
      })
    );
  }

  // Generate new invoice for driver
  generateDriverInvoice(driverId: string, startDate: Date, endDate: Date): Observable<Invoice> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const driverTransactions = this.mockTransactions.filter(
          t => t.driverId === driverId && 
               t.date >= startDate && 
               t.date <= endDate &&
               t.status === 'completed'
        );

        const totalEarnings = driverTransactions.reduce((sum, t) => sum + t.driverEarnings, 0);
        const totalCommission = driverTransactions.reduce((sum, t) => sum + t.companyCommission, 0);
        const taxAmount = totalEarnings * 0.1; // 10% tax

        const newInvoice: Invoice = {
          id: `inv-${Date.now()}`,
          type: 'driver',
          driverId,
          driverName: driverTransactions[0]?.driverName || 'Unknown Driver',
          period: { startDate, endDate },
          totalRides: driverTransactions.length,
          totalEarnings,
          totalCommission,
          netAmount: totalEarnings - taxAmount,
          transactions: driverTransactions,
          status: 'generated',
          generatedDate: new Date(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          invoiceNumber: `DRV-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
          taxAmount
        };

        this.mockInvoices.unshift(newInvoice);
        return newInvoice;
      })
    );
  }

  // Generate company summary invoice
  generateCompanyInvoice(startDate: Date, endDate: Date): Observable<Invoice> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const periodTransactions = this.mockTransactions.filter(
          t => t.date >= startDate && 
               t.date <= endDate &&
               t.status === 'completed'
        );

        const totalEarnings = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
        const totalCommission = periodTransactions.reduce((sum, t) => sum + t.companyCommission, 0);
        const taxAmount = totalCommission * 0.18; // 18% GST on commission

        const newInvoice: Invoice = {
          id: `inv-${Date.now()}`,
          type: 'company',
          period: { startDate, endDate },
          totalRides: periodTransactions.length,
          totalEarnings,
          totalCommission,
          netAmount: totalCommission - taxAmount,
          transactions: periodTransactions,
          status: 'generated',
          generatedDate: new Date(),
          invoiceNumber: `COMP-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
          taxAmount
        };

        this.mockInvoices.unshift(newInvoice);
        return newInvoice;
      })
    );
  }

  // Update invoice status
  updateInvoiceStatus(invoiceId: string, status: 'generated' | 'sent' | 'paid' | 'overdue'): Observable<Invoice> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const invoice = this.mockInvoices.find(inv => inv.id === invoiceId);
        if (invoice) {
          invoice.status = status;
          if (status === 'paid') {
            invoice.paidDate = new Date();
          }
        }
        return invoice!;
      })
    );
  }

  // Send invoice (mark as sent)
  sendInvoice(invoiceId: string): Observable<boolean> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const invoice = this.mockInvoices.find(inv => inv.id === invoiceId);
        if (invoice) {
          invoice.status = 'sent';
          return true;
        }
        return false;
      })
    );
  }

  // Download invoice PDF (simulation)
  downloadInvoice(invoiceId: string): Observable<Blob> {
    return of(null).pipe(
      delay(1500),
      map(() => {
        const invoice = this.mockInvoices.find(inv => inv.id === invoiceId);
        if (invoice) {
          const pdfContent = `Invoice ${invoice.invoiceNumber}\n\nType: ${invoice.type}\nAmount: ₹${invoice.netAmount}\nStatus: ${invoice.status}`;
          return new Blob([pdfContent], { type: 'application/pdf' });
        }
        return new Blob(['Invoice not found'], { type: 'text/plain' });
      })
    );
  }

  // Get invoice summary statistics
  getInvoiceSummary(): Observable<{
    totalInvoices: number;
    pendingInvoices: number;
    paidInvoices: number;
    totalAmount: number;
    totalPaid: number;
    totalPending: number;
  }> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const totalInvoices = this.mockInvoices.length;
        const pendingInvoices = this.mockInvoices.filter(inv => 
          inv.status === 'generated' || inv.status === 'sent'
        ).length;
        const paidInvoices = this.mockInvoices.filter(inv => inv.status === 'paid').length;
        const totalAmount = this.mockInvoices.reduce((sum, inv) => sum + inv.netAmount, 0);
        const totalPaid = this.mockInvoices
          .filter(inv => inv.status === 'paid')
          .reduce((sum, inv) => sum + inv.netAmount, 0);
        const totalPending = totalAmount - totalPaid;

        return {
          totalInvoices,
          pendingInvoices,
          paidInvoices,
          totalAmount,
          totalPaid,
          totalPending
        };
      })
    );
  }
}
