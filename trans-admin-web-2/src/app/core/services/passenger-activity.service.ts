import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import {
  TripLog,
  TripAnalytics,
  WalletTransaction,
  WalletSummary,
  PaymentHistory,
  DriverFeedback,
  FeedbackSummary,
  PassengerActivity,
  ActivityFilters,
  VehicleCategory,
  Location
} from '../models/ride.model';

@Injectable({
  providedIn: 'root'
})
export class PassengerActivityService {

  // Mock data for comprehensive testing
  private mockTripLogs: TripLog[] = [
    {
      id: 'trip-001',
      rideId: 'RID001',
      passengerId: 'pass-001',
      driverId: 'drv-001',
      status: 'completed',
      pickupLocation: {
        latitude: 12.9716,
        longitude: 77.5946,
        address: 'Koramangala 5th Block, Bangalore'
      },
      dropLocation: {
        latitude: 13.0827,
        longitude: 80.2707,
        address: 'Kempegowda International Airport, Bangalore'
      },
      scheduledTime: new Date('2024-10-25T08:00:00'),
      actualPickupTime: new Date('2024-10-25T08:05:00'),
      actualDropoffTime: new Date('2024-10-25T09:20:00'),
      fare: 850,
      paymentMethod: 'upi',
      paymentStatus: 'completed',
      distance: 32.5,
      duration: 75,
      vehicleType: VehicleCategory.CAB,
      driverName: 'Rajesh Kumar',
      driverRating: 4.8,
      passengerRating: 4.5,
      createdAt: new Date('2024-10-25T07:45:00'),
      updatedAt: new Date('2024-10-25T09:25:00')
    },
    {
      id: 'trip-002',
      rideId: 'RID002',
      passengerId: 'pass-001',
      driverId: 'drv-002',
      status: 'cancelled',
      pickupLocation: {
        latitude: 12.9352,
        longitude: 77.6245,
        address: 'Indiranagar, Bangalore'
      },
      dropLocation: {
        latitude: 12.9698,
        longitude: 77.7500,
        address: 'Whitefield, Bangalore'
      },
      scheduledTime: new Date('2024-10-24T18:30:00'),
      fare: 0,
      paymentMethod: 'wallet',
      paymentStatus: 'refunded',
      distance: 18.2,
      vehicleType: VehicleCategory.AUTO,
      driverName: 'Suresh Singh',
      driverRating: 4.2,
      cancellationReason: 'Driver not available',
      createdAt: new Date('2024-10-24T18:15:00'),
      updatedAt: new Date('2024-10-24T18:35:00')
    },
    {
      id: 'trip-003',
      rideId: 'RID003',
      passengerId: 'pass-001',
      driverId: 'drv-003',
      status: 'scheduled',
      pickupLocation: {
        latitude: 12.9279,
        longitude: 77.6271,
        address: 'HSR Layout, Bangalore'
      },
      dropLocation: {
        latitude: 12.9716,
        longitude: 77.5946,
        address: 'Koramangala, Bangalore'
      },
      scheduledTime: new Date('2024-10-30T09:00:00'),
      fare: 280,
      paymentMethod: 'card',
      paymentStatus: 'pending',
      distance: 8.5,
      vehicleType: VehicleCategory.CAB,
      driverName: 'Amit Sharma',
      driverRating: 4.6,
      createdAt: new Date('2024-10-29T20:30:00'),
      updatedAt: new Date('2024-10-29T20:30:00')
    },
    {
      id: 'trip-004',
      rideId: 'RID004',
      passengerId: 'pass-001',
      driverId: 'drv-004',
      status: 'no-show',
      pickupLocation: {
        latitude: 12.9141,
        longitude: 77.6211,
        address: 'BTM Layout, Bangalore'
      },
      dropLocation: {
        latitude: 13.0358,
        longitude: 77.5970,
        address: 'MG Road, Bangalore'
      },
      scheduledTime: new Date('2024-10-23T14:00:00'),
      fare: 0,
      paymentMethod: 'cash',
      paymentStatus: 'failed',
      distance: 12.8,
      vehicleType: VehicleCategory.AUTO,
      driverName: 'Prakash Reddy',
      driverRating: 4.1,
      noShowReason: 'Passenger did not arrive at pickup location',
      createdAt: new Date('2024-10-23T13:45:00'),
      updatedAt: new Date('2024-10-23T14:15:00')
    },
    {
      id: 'trip-005',
      rideId: 'RID005',
      passengerId: 'pass-001',
      driverId: 'drv-005',
      status: 'completed',
      pickupLocation: {
        latitude: 12.9698,
        longitude: 77.7500,
        address: 'Whitefield, Bangalore'
      },
      dropLocation: {
        latitude: 12.9352,
        longitude: 77.6245,
        address: 'Indiranagar, Bangalore'
      },
      scheduledTime: new Date('2024-10-22T19:30:00'),
      actualPickupTime: new Date('2024-10-22T19:33:00'),
      actualDropoffTime: new Date('2024-10-22T20:25:00'),
      fare: 420,
      paymentMethod: 'wallet',
      paymentStatus: 'completed',
      distance: 18.2,
      duration: 52,
      vehicleType: VehicleCategory.CAB,
      driverName: 'Ravi Patel',
      driverRating: 4.9,
      passengerRating: 4.8,
      createdAt: new Date('2024-10-22T19:15:00'),
      updatedAt: new Date('2024-10-22T20:30:00')
    }
  ];

  private mockWalletTransactions: WalletTransaction[] = [
    {
      id: 'txn-001',
      passengerId: 'pass-001',
      type: 'topup',
      amount: 1000,
      description: 'Wallet top-up via UPI',
      paymentMethod: 'upi',
      status: 'completed',
      balanceAfter: 1000,
      createdAt: new Date('2024-10-20T10:30:00'),
      processedAt: new Date('2024-10-20T10:31:00')
    },
    {
      id: 'txn-002',
      passengerId: 'pass-001',
      type: 'debit',
      amount: 850,
      description: 'Payment for ride RID001',
      referenceId: 'RID001',
      status: 'completed',
      balanceAfter: 150,
      createdAt: new Date('2024-10-25T09:20:00'),
      processedAt: new Date('2024-10-25T09:21:00')
    },
    {
      id: 'txn-003',
      passengerId: 'pass-001',
      type: 'refund',
      amount: 50,
      description: 'Refund for cancelled ride RID002',
      referenceId: 'RID002',
      status: 'completed',
      balanceAfter: 200,
      createdAt: new Date('2024-10-24T18:35:00'),
      processedAt: new Date('2024-10-24T18:36:00')
    },
    {
      id: 'txn-004',
      passengerId: 'pass-001',
      type: 'debit',
      amount: 420,
      description: 'Payment for ride RID005',
      referenceId: 'RID005',
      status: 'completed',
      balanceAfter: -220,
      createdAt: new Date('2024-10-22T20:25:00'),
      processedAt: new Date('2024-10-22T20:26:00')
    },
    {
      id: 'txn-005',
      passengerId: 'pass-001',
      type: 'topup',
      amount: 500,
      description: 'Wallet top-up via Card',
      paymentMethod: 'card',
      status: 'completed',
      balanceAfter: 280,
      createdAt: new Date('2024-10-26T15:20:00'),
      processedAt: new Date('2024-10-26T15:21:00')
    }
  ];

  private mockDriverFeedbacks: DriverFeedback[] = [
    {
      id: 'feedback-001',
      rideId: 'RID001',
      driverId: 'drv-001',
      passengerId: 'pass-001',
      driverName: 'Rajesh Kumar',
      passengerName: 'Priya Sharma',
      rating: 4,
      feedback: 'Passenger was punctual and polite. Good communication throughout the ride. Payment was smooth.',
      categories: [
        { category: 'punctuality', rating: 5, comments: 'On time at pickup' },
        { category: 'behavior', rating: 5, comments: 'Very respectful' },
        { category: 'communication', rating: 4, comments: 'Clear instructions' },
        { category: 'payment', rating: 4, comments: 'UPI payment completed' }
      ],
      isAnonymous: false,
      createdAt: new Date('2024-10-25T09:25:00'),
      rideDate: new Date('2024-10-25T08:00:00')
    },
    {
      id: 'feedback-002',
      rideId: 'RID005',
      driverId: 'drv-005',
      passengerId: 'pass-001',
      driverName: 'Ravi Patel',
      passengerName: 'Priya Sharma',
      rating: 5,
      feedback: 'Excellent passenger! Very courteous and understanding. Made the ride pleasant.',
      categories: [
        { category: 'punctuality', rating: 5, comments: 'Ready before time' },
        { category: 'behavior', rating: 5, comments: 'Extremely polite' },
        { category: 'cleanliness', rating: 5, comments: 'Well-maintained hygiene' },
        { category: 'communication', rating: 5, comments: 'Great conversation' },
        { category: 'payment', rating: 5, comments: 'Instant wallet payment' }
      ],
      isAnonymous: false,
      createdAt: new Date('2024-10-22T20:30:00'),
      rideDate: new Date('2024-10-22T19:30:00')
    },
    {
      id: 'feedback-003',
      rideId: 'RID006',
      driverId: 'drv-006',
      passengerId: 'pass-001',
      driverName: 'Mohan Das',
      passengerName: 'Priya Sharma',
      rating: 3,
      feedback: 'Passenger was late by 10 minutes. Otherwise decent ride.',
      categories: [
        { category: 'punctuality', rating: 2, comments: 'Late for pickup' },
        { category: 'behavior', rating: 4, comments: 'Apologetic about delay' },
        { category: 'communication', rating: 4, comments: 'Informed about delay' },
        { category: 'payment', rating: 4, comments: 'Cash payment done' }
      ],
      isAnonymous: false,
      createdAt: new Date('2024-10-18T16:45:00'),
      rideDate: new Date('2024-10-18T15:30:00')
    }
  ];

  constructor() { }

  // Trip Analysis Methods
  getPassengerTripLogs(passengerId: string, filters?: ActivityFilters): Observable<TripLog[]> {
    return of(null).pipe(
      delay(800),
      map(() => {
        let filteredTrips = this.mockTripLogs.filter(trip => trip.passengerId === passengerId);

        if (filters) {
          if (filters.dateRange) {
            filteredTrips = filteredTrips.filter(trip => 
              trip.createdAt >= filters.dateRange!.startDate && 
              trip.createdAt <= filters.dateRange!.endDate
            );
          }

          if (filters.status && filters.status.length > 0) {
            filteredTrips = filteredTrips.filter(trip => filters.status!.includes(trip.status));
          }

          if (filters.paymentMethod && filters.paymentMethod.length > 0) {
            filteredTrips = filteredTrips.filter(trip => filters.paymentMethod!.includes(trip.paymentMethod));
          }

          if (filters.vehicleType && filters.vehicleType.length > 0) {
            filteredTrips = filteredTrips.filter(trip => filters.vehicleType!.includes(trip.vehicleType));
          }

          if (filters.amountRange) {
            filteredTrips = filteredTrips.filter(trip => 
              trip.fare >= filters.amountRange!.min && 
              trip.fare <= filters.amountRange!.max
            );
          }
        }

        return filteredTrips.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      })
    );
  }

  getTripAnalytics(passengerId: string): Observable<TripAnalytics> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const trips = this.mockTripLogs.filter(trip => trip.passengerId === passengerId);
        
        const completed = trips.filter(t => t.status === 'completed');
        const cancelled = trips.filter(t => t.status === 'cancelled');
        const scheduled = trips.filter(t => t.status === 'scheduled');
        const noShow = trips.filter(t => t.status === 'no-show');

        const totalSpent = completed.reduce((sum, trip) => sum + trip.fare, 0);
        const avgFare = completed.length > 0 ? totalSpent / completed.length : 0;
        
        const ratingsSum = completed
          .filter(t => t.passengerRating)
          .reduce((sum, trip) => sum + (trip.passengerRating || 0), 0);
        const avgRating = ratingsSum > 0 ? ratingsSum / completed.filter(t => t.passengerRating).length : 0;

        // Vehicle type frequency
        const vehicleCount: { [key in VehicleCategory]: number } = {
          [VehicleCategory.BIKE]: 0,
          [VehicleCategory.CAB]: 0,
          [VehicleCategory.AUTO]: 0,
          [VehicleCategory.BUS]: 0,
          [VehicleCategory.TRACTOR]: 0,
          [VehicleCategory.TRUCK]: 0
        };

        trips.forEach(trip => {
          vehicleCount[trip.vehicleType]++;
        });

        const favoriteVehicleType = Object.keys(vehicleCount).reduce((a, b) => 
          vehicleCount[a as VehicleCategory] > vehicleCount[b as VehicleCategory] ? a : b
        ) as VehicleCategory;

        // Payment method frequency
        const paymentCount: { [key: string]: number } = {};
        trips.forEach(trip => {
          paymentCount[trip.paymentMethod] = (paymentCount[trip.paymentMethod] || 0) + 1;
        });

        const mostUsedPaymentMethod = Object.keys(paymentCount).reduce((a, b) => 
          paymentCount[a] > paymentCount[b] ? a : b
        );

        return {
          totalTrips: trips.length,
          completedTrips: completed.length,
          cancelledTrips: cancelled.length,
          scheduledTrips: scheduled.length,
          noShowTrips: noShow.length,
          totalSpent: totalSpent,
          averageFare: avgFare,
          averageRating: avgRating,
          favoriteVehicleType: favoriteVehicleType,
          mostUsedPaymentMethod: mostUsedPaymentMethod,
          completionRate: trips.length > 0 ? (completed.length / trips.length) * 100 : 0,
          cancellationRate: trips.length > 0 ? (cancelled.length / trips.length) * 100 : 0,
          noShowRate: trips.length > 0 ? (noShow.length / trips.length) * 100 : 0
        };
      })
    );
  }

  // Financial/Wallet History Methods
  getWalletTransactions(passengerId: string, filters?: ActivityFilters): Observable<WalletTransaction[]> {
    return of(null).pipe(
      delay(600),
      map(() => {
        let transactions = this.mockWalletTransactions.filter(txn => txn.passengerId === passengerId);

        if (filters) {
          if (filters.dateRange) {
            transactions = transactions.filter(txn => 
              txn.createdAt >= filters.dateRange!.startDate && 
              txn.createdAt <= filters.dateRange!.endDate
            );
          }

          if (filters.amountRange) {
            transactions = transactions.filter(txn => 
              txn.amount >= filters.amountRange!.min && 
              txn.amount <= filters.amountRange!.max
            );
          }
        }

        return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      })
    );
  }

  getWalletSummary(passengerId: string): Observable<WalletSummary> {
    return of(null).pipe(
      delay(400),
      map(() => {
        const transactions = this.mockWalletTransactions.filter(txn => txn.passengerId === passengerId);
        
        const credits = transactions.filter(t => t.type === 'credit' || t.type === 'topup').reduce((sum, t) => sum + t.amount, 0);
        const debits = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
        const refunds = transactions.filter(t => t.type === 'refund').reduce((sum, t) => sum + t.amount, 0);
        const topups = transactions.filter(t => t.type === 'topup').reduce((sum, t) => sum + t.amount, 0);
        
        const lastTransaction = transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

        return {
          currentBalance: 280,
          totalCredits: credits,
          totalDebits: debits,
          totalRefunds: refunds,
          totalTopups: topups,
          lastTransactionDate: lastTransaction ? lastTransaction.createdAt : new Date(),
          transactionCount: transactions.length
        };
      })
    );
  }

  // Driver Feedback Methods
  getDriverFeedbacks(passengerId: string, filters?: ActivityFilters): Observable<DriverFeedback[]> {
    return of(null).pipe(
      delay(500),
      map(() => {
        let feedbacks = this.mockDriverFeedbacks.filter(fb => fb.passengerId === passengerId);

        if (filters) {
          if (filters.dateRange) {
            feedbacks = feedbacks.filter(fb => 
              fb.createdAt >= filters.dateRange!.startDate && 
              fb.createdAt <= filters.dateRange!.endDate
            );
          }

          if (filters.ratingRange) {
            feedbacks = feedbacks.filter(fb => 
              fb.rating >= filters.ratingRange!.min && 
              fb.rating <= filters.ratingRange!.max
            );
          }
        }

        return feedbacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      })
    );
  }

  getFeedbackSummary(passengerId: string): Observable<FeedbackSummary> {
    return of(null).pipe(
      delay(400),
      map(() => {
        const feedbacks = this.mockDriverFeedbacks.filter(fb => fb.passengerId === passengerId);
        
        const avgRating = feedbacks.length > 0 ? 
          feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length : 0;

        const ratingDistribution = {
          1: feedbacks.filter(fb => fb.rating === 1).length,
          2: feedbacks.filter(fb => fb.rating === 2).length,
          3: feedbacks.filter(fb => fb.rating === 3).length,
          4: feedbacks.filter(fb => fb.rating === 4).length,
          5: feedbacks.filter(fb => fb.rating === 5).length
        };

        // Calculate category averages
        const categoryTotals = {
          punctuality: 0,
          behavior: 0,
          cleanliness: 0,
          communication: 0,
          payment: 0
        };

        const categoryCounts = {
          punctuality: 0,
          behavior: 0,
          cleanliness: 0,
          communication: 0,
          payment: 0
        };

        feedbacks.forEach(fb => {
          fb.categories.forEach(cat => {
            if (cat.category !== 'other' && cat.category in categoryTotals) {
              categoryTotals[cat.category as keyof typeof categoryTotals] += cat.rating;
              categoryCounts[cat.category as keyof typeof categoryCounts]++;
            }
          });
        });

        const categoryAverages = {
          punctuality: categoryCounts.punctuality > 0 ? categoryTotals.punctuality / categoryCounts.punctuality : 0,
          behavior: categoryCounts.behavior > 0 ? categoryTotals.behavior / categoryCounts.behavior : 0,
          cleanliness: categoryCounts.cleanliness > 0 ? categoryTotals.cleanliness / categoryCounts.cleanliness : 0,
          communication: categoryCounts.communication > 0 ? categoryTotals.communication / categoryCounts.communication : 0,
          payment: categoryCounts.payment > 0 ? categoryTotals.payment / categoryCounts.payment : 0
        };

        // Extract common issues and positive highlights
        const commonIssues = [
          'Occasionally late for pickup',
          'Sometimes needs clear directions'
        ];

        const positiveHighlights = [
          'Very polite and respectful',
          'Good communication skills',
          'Prompt payment processing',
          'Maintains good hygiene'
        ];

        return {
          averageRating: avgRating,
          totalFeedbacks: feedbacks.length,
          ratingDistribution: ratingDistribution,
          categoryAverages: categoryAverages,
          commonIssues: commonIssues,
          positiveHighlights: positiveHighlights
        };
      })
    );
  }

  // Combined Activity Analysis
  getCompletePassengerActivity(passengerId: string): Observable<PassengerActivity> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // This would typically make multiple API calls and combine results
        // For mock data, we'll simulate the combined response
        const recentTrips = this.mockTripLogs.filter(trip => trip.passengerId === passengerId).slice(0, 5);
        const recentTransactions = this.mockWalletTransactions.filter(txn => txn.passengerId === passengerId).slice(0, 5);
        const recentFeedbacks = this.mockDriverFeedbacks.filter(fb => fb.passengerId === passengerId).slice(0, 3);

        return {
          passengerId: passengerId,
          passengerName: 'Priya Sharma',
          tripAnalytics: {
            totalTrips: 5,
            completedTrips: 2,
            cancelledTrips: 1,
            scheduledTrips: 1,
            noShowTrips: 1,
            totalSpent: 1270,
            averageFare: 635,
            averageRating: 4.65,
            favoriteVehicleType: VehicleCategory.CAB,
            mostUsedPaymentMethod: 'wallet',
            completionRate: 40,
            cancellationRate: 20,
            noShowRate: 20
          },
          walletSummary: {
            currentBalance: 280,
            totalCredits: 1500,
            totalDebits: 1270,
            totalRefunds: 50,
            totalTopups: 1500,
            lastTransactionDate: new Date('2024-10-26T15:20:00'),
            transactionCount: 5
          },
          feedbackSummary: {
            averageRating: 4.0,
            totalFeedbacks: 3,
            ratingDistribution: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 1 },
            categoryAverages: {
              punctuality: 4.0,
              behavior: 4.7,
              cleanliness: 5.0,
              communication: 4.3,
              payment: 4.3
            },
            commonIssues: ['Occasionally late for pickup'],
            positiveHighlights: ['Very polite and respectful', 'Good communication skills']
          },
          recentTrips: recentTrips,
          recentTransactions: recentTransactions,
          recentFeedbacks: recentFeedbacks
        };
      })
    );
  }

  // Export functionality
  exportTripData(passengerId: string, filters?: ActivityFilters): Observable<Blob> {
    return this.getPassengerTripLogs(passengerId, filters).pipe(
      map(trips => {
        const csvContent = 'Ride ID,Status,Pickup Location,Drop Location,Scheduled Time,Actual Pickup,Actual Dropoff,Fare,Payment Method,Payment Status,Distance,Duration,Vehicle Type,Driver,Driver Rating,Passenger Rating,Created At\n' +
          trips.map(trip => 
            `${trip.rideId},${trip.status},"${trip.pickupLocation.address}","${trip.dropLocation.address}",${trip.scheduledTime?.toLocaleString() || ''},${trip.actualPickupTime?.toLocaleString() || ''},${trip.actualDropoffTime?.toLocaleString() || ''},₹${trip.fare},${trip.paymentMethod},${trip.paymentStatus},${trip.distance} km,${trip.duration || 0} min,${trip.vehicleType},${trip.driverName},${trip.driverRating}/5,${trip.passengerRating || 'N/A'}/5,${trip.createdAt.toLocaleString()}`
          ).join('\n');
        
        return new Blob([csvContent], { type: 'text/csv' });
      })
    );
  }

  exportWalletData(passengerId: string, filters?: ActivityFilters): Observable<Blob> {
    return this.getWalletTransactions(passengerId, filters).pipe(
      map(transactions => {
        const csvContent = 'Transaction ID,Type,Amount,Description,Reference ID,Payment Method,Status,Balance After,Created At,Processed At\n' +
          transactions.map(txn => 
            `${txn.id},${txn.type},₹${txn.amount},"${txn.description}",${txn.referenceId || ''},${txn.paymentMethod || ''},${txn.status},₹${txn.balanceAfter},${txn.createdAt.toLocaleString()},${txn.processedAt?.toLocaleString() || ''}`
          ).join('\n');
        
        return new Blob([csvContent], { type: 'text/csv' });
      })
    );
  }

  exportFeedbackData(passengerId: string, filters?: ActivityFilters): Observable<Blob> {
    return this.getDriverFeedbacks(passengerId, filters).pipe(
      map(feedbacks => {
        const csvContent = 'Feedback ID,Ride ID,Driver Name,Rating,Feedback,Categories,Created At,Ride Date\n' +
          feedbacks.map(fb => {
            const categories = fb.categories.map(cat => `${cat.category}: ${cat.rating}/5`).join('; ');
            return `${fb.id},${fb.rideId},${fb.driverName},${fb.rating}/5,"${fb.feedback}","${categories}",${fb.createdAt.toLocaleString()},${fb.rideDate.toLocaleString()}`;
          }).join('\n');
        
        return new Blob([csvContent], { type: 'text/csv' });
      })
    );
  }
}
