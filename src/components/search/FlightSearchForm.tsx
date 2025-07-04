import { useState } from 'react';
import { 
  UserGroupIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import type { FlightSearchParams } from '../../types/flight';
import AirportAutocomplete from './AirportAutocomplete';
import DatePicker from './DatePicker';

interface FlightSearchFormProps {
  onSearch: (params: FlightSearchParams) => void;
  isLoading?: boolean;
}

const FlightSearchForm = ({ onSearch, isLoading = false }: FlightSearchFormProps) => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'economy',
    currency: 'USD',
  });

  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('roundtrip');

  const handleInputChange = (field: keyof FlightSearchParams, value: string | number) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchParams.origin && searchParams.destination && searchParams.departureDate) {
      onSearch(searchParams);
    }
  };

  const swapLocations = () => {
    setSearchParams(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  return (
    <div className="card p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type Selection */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setTripType('roundtrip')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tripType === 'roundtrip'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Round Trip
          </button>
          <button
            type="button"
            onClick={() => setTripType('oneway')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tripType === 'oneway'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            One Way
          </button>
        </div>

        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AirportAutocomplete
            value={searchParams.origin}
            onChange={(value) => handleInputChange('origin', value)}
            placeholder="City or airport"
            label="From"
          />

          <div className="relative">
            <AirportAutocomplete
              value={searchParams.destination}
              onChange={(value) => handleInputChange('destination', value)}
              placeholder="City or airport"
              label="To"
            />
            <button
              type="button"
              onClick={swapLocations}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 z-10"
            >
              <ArrowRightIcon className="h-4 w-4 rotate-90" />
            </button>
          </div>
        </div>

        {/* Dates */}
        <DatePicker
          departureDate={searchParams.departureDate}
          returnDate={searchParams.returnDate}
          onDepartureDateChange={(date) => handleInputChange('departureDate', date)}
          onReturnDateChange={(date) => handleInputChange('returnDate', date)}
          isRoundTrip={tripType === 'roundtrip'}
        />

        {/* Passengers and Cabin Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passengers
            </label>
            <div className="relative">
              <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={`${searchParams.adults + searchParams.children + searchParams.infants}`}
                onChange={(e) => {
                  const total = parseInt(e.target.value);
                  setSearchParams(prev => ({
                    ...prev,
                    adults: Math.max(1, total - prev.children - prev.infants),
                  }));
                }}
                className="input-field pl-10"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cabin Class
            </label>
            <select
              value={searchParams.cabinClass}
              onChange={(e) => handleInputChange('cabinClass', e.target.value)}
              className="input-field"
            >
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={isLoading || !searchParams.origin || !searchParams.destination || !searchParams.departureDate}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>
    </div>
  );
};

export default FlightSearchForm; 