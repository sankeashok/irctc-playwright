export interface TripData {
  from: string;
  to: string;
  date: string;
  trainNumber: string;
  trainName: string;
  class: string;
  quota: string;
  dateLabel: string;
}

export interface TestConfig {
  trips: Record<string, TripData>;
}
