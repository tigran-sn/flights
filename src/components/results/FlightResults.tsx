import { useState } from 'react';
import { 
  FunnelIcon, 
  ArrowsUpDownIcon,
  NoSymbolIcon 
} from '@heroicons/react/24/outline';
import type { Flight, FlightSearchFilters } from '../../types/flight';
import FlightCard from './FlightCard';

interface FlightResultsProps {
  flights: Flight[];
  isLoading: boolean;
  searchParams: {
    origin: string;
    destination: string;
    departureDate: string;
  };
  onFlightSelect?: (flight: Flight) => void;
}

const FlightResults = ({ 
  flights, 
  isLoading, 
  searchParams, 
  onFlightSelect 
}: FlightResultsProps) => {
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [filters, setFilters] = useState<FlightSearchFilters>({});

  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'duration':
        return a.duration.localeCompare(b.duration);
      case 'departure':
        return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      default:
        return 0;
    }
  });

  const filteredFlights = sortedFlights.filter(flight => {
    if (filters.maxPrice && flight.price > filters.maxPrice) return false;
    if (filters.stops && filters.stops.length > 0 && !filters.stops.includes(flight.stops)) return false;
    if (filters.airlines && filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Searching for flights...</h2>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="text-center py-12">
        <NoSymbolIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No flights found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search criteria or dates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Results Count and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredFlights.length} flights found
          </h2>
          <p className="text-sm text-gray-600">
            {searchParams.origin} → {searchParams.destination} • {searchParams.departureDate}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'duration' | 'departure')}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="price">Sort by Price</option>
              <option value="duration">Sort by Duration</option>
              <option value="departure">Sort by Departure</option>
            </select>
            <ArrowsUpDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          
          {/* Filter Button */}
          <button className="btn-secondary text-sm px-3 py-2">
            <FunnelIcon className="h-4 w-4 mr-1" />
            Filters
          </button>
        </div>
      </div>

      {/* Flight Cards */}
      <div className="grid gap-4">
        {filteredFlights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onSelect={onFlightSelect}
          />
        ))}
      </div>

      {/* Load More Button (if needed) */}
      {filteredFlights.length >= 10 && (
        <div className="text-center">
          <button className="btn-secondary">
            Load More Flights
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightResults; 