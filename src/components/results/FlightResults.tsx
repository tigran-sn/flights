import { useState, useMemo } from 'react';
import { 
  FunnelIcon, 
  ArrowsUpDownIcon,
  NoSymbolIcon 
} from '@heroicons/react/24/outline';
import type { Flight, FlightSearchFilters } from '../../types/flight';
import FlightCard from './FlightCard';
import FlightFilters from '../search/FlightFilters';
import Modal from '../ui/Modal';

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
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  // Calculate available airlines from flights
  const availableAirlines = useMemo(() => {
    const airlines = new Set(flights.map(flight => flight.airline));
    return Array.from(airlines).sort();
  }, [flights]);

  // Calculate max price for price range slider
  const maxPrice = useMemo(() => {
    return flights.length > 0 ? Math.max(...flights.map(flight => flight.price)) : 1000;
  }, [flights]);

  // Helper function to get departure time category
  const getDepartureTimeCategory = (departureTime: string) => {
    const hour = new Date(departureTime).getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 24) return 'evening';
    return 'night';
  };

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
    // Price filter
    if (filters.maxPrice && flight.price > filters.maxPrice) return false;
    
    // Stops filter
    if (filters.stops && filters.stops.length > 0 && !filters.stops.includes(flight.stops)) return false;
    
    // Airlines filter
    if (filters.airlines && filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) return false;
    
    // Departure time filter
    if (filters.departureTime && filters.departureTime.length > 0) {
      const timeCategory = getDepartureTimeCategory(flight.departureTime);
      if (!filters.departureTime.includes(timeCategory)) return false;
    }
    
    // Cabin class filter
    if (filters.cabinClass && filters.cabinClass.length > 0 && !filters.cabinClass.includes(flight.cabinClass)) return false;
    
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
          <button 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="btn-secondary text-sm px-3 py-2"
          >
            <FunnelIcon className="h-4 w-4 mr-1" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters and Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FlightFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableAirlines={availableAirlines}
            maxPrice={maxPrice}
            isOpen={isFiltersOpen}
            onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
          />
        </div>

        {/* Flight Results */}
        <div className="lg:col-span-3">
          <div className="grid gap-4">
            {filteredFlights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onSelect={setSelectedFlight}
              />
            ))}
          </div>

          {/* No results message */}
          {filteredFlights.length === 0 && flights.length > 0 && (
            <div className="text-center py-12">
              <NoSymbolIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No flights match your filters</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filter criteria.
              </p>
            </div>
          )}

          {/* Load More Button (if needed) */}
          {filteredFlights.length >= 10 && (
            <div className="text-center mt-6">
              <button className="btn-secondary">
                Load More Flights
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Flight Details Modal */}
      <Modal isOpen={!!selectedFlight} onClose={() => setSelectedFlight(null)} title="Flight Details">
        {selectedFlight && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                {/* Airline logo placeholder */}
                <span className="text-lg font-bold text-primary-600">{selectedFlight.airline[0]}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedFlight.airline}</h3>
                <p className="text-sm text-gray-500">Flight {selectedFlight.flightNumber}</p>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <div className="font-medium text-gray-900">{selectedFlight.origin} → {selectedFlight.destination}</div>
                <div className="text-sm text-gray-500">{selectedFlight.departureAirport} → {selectedFlight.arrivalAirport}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary-600">{selectedFlight.price} {selectedFlight.currency}</div>
                <div className="text-xs text-gray-500">{selectedFlight.cabinClass.replace('_', ' ')}</div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <div>
                <div>Departure: {new Date(selectedFlight.departureTime).toLocaleString()}</div>
                <div>Arrival: {new Date(selectedFlight.arrivalTime).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div>Duration: {selectedFlight.duration}</div>
                <div>{selectedFlight.stops === 0 ? 'Direct' : `${selectedFlight.stops} stop(s)`}</div>
              </div>
            </div>
            {selectedFlight.layovers && selectedFlight.layovers.length > 0 && (
              <div className="bg-gray-50 rounded p-3">
                <div className="font-semibold text-gray-800 mb-1">Layovers:</div>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {selectedFlight.layovers.map((layover, idx) => (
                    <li key={idx}>{layover}</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedFlight.baggage && (
              <div className="text-sm text-gray-700">Baggage: {selectedFlight.baggage}</div>
            )}
            {selectedFlight.fareRules && (
              <div className="text-xs text-gray-500">Fare rules: {selectedFlight.fareRules}</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FlightResults; 