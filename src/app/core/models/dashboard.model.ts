export interface DashboardStats {
  totalRides: {
    today: number;
    week: number;
    month: number;
  };
  activeDrivers: number;
  totalPassengers: number;
  revenue: {
    today: number;
    week: number;
    month: number;
  };
  liveRides: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}