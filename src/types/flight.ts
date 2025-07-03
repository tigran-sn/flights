export interface Flight {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  price: number;
  currency: string;
  stops: number;
  cabinClass: string;
  aircraft?: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTerminal?: string;
  arrivalTerminal?: string;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
  currency: string;
}

export interface FlightSearchFilters {
  maxPrice?: number;
  airlines?: string[];
  stops?: number[];
  departureTime?: string[];
  arrivalTime?: string[];
  cabinClass?: string[];
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
}

export interface Airline {
  code: string;
  name: string;
  logo?: string;
}

export interface SearchResult {
  flights: Flight[];
  totalCount: number;
  searchParams: FlightSearchParams;
  timestamp: string;
} 