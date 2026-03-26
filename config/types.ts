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

export interface Passenger {
  name: string;
  age: string;
  gender: string;
}

export interface ContactInfo {
  mobile: string;
}

export interface PaymentInfo {
  mode: string;
}

export interface TestConfig {
  trips: Record<string, TripData>;
  passengers: Passenger[];
  contact: ContactInfo;
  payment: PaymentInfo;
}
