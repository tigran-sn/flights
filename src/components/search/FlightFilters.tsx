import { useState, useEffect } from 'react';
import { 
  FunnelIcon, 
  XMarkIcon,
  CurrencyDollarIcon,
  ClockIcon,
  PaperAirplaneIcon 
} from '@heroicons/react/24/outline';
import type { FlightSearchFilters } from '../../types/flight';

interface FlightFiltersProps {
  filters: FlightSearchFilters;
  onFiltersChange: (filters: FlightSearchFilters) => void;
  availableAirlines: string[];
  maxPrice: number;
  isOpen: boolean;
  onToggle: () => void;
}

const FlightFilters = ({ 
  filters, 
  onFiltersChange, 
  availableAirlines, 
  maxPrice,
  isOpen,
  onToggle 
}: FlightFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<FlightSearchFilters>(filters);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof FlightSearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: FlightSearchFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && 
    (Array.isArray(value) ? value.length > 0 : value !== null)
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Filter Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAllFilters();
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          )}
          <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <XMarkIcon className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filter Content */}
      {isOpen && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          {/* Price Range */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <CurrencyDollarIcon className="h-4 w-4 text-gray-600" />
              <h4 className="font-medium text-gray-900">Price Range</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>$0</span>
                <span>${filters.maxPrice || maxPrice}</span>
              </div>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={filters.maxPrice || maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Budget</span>
                <span>Premium</span>
              </div>
            </div>
          </div>

          {/* Number of Stops */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <PaperAirplaneIcon className="h-4 w-4 text-gray-600" />
              <h4 className="font-medium text-gray-900">Stops</h4>
            </div>
            <div className="space-y-2">
              {[
                { value: 0, label: 'Direct flights only', color: 'bg-green-100 text-green-800' },
                { value: 1, label: '1 stop', color: 'bg-yellow-100 text-yellow-800' },
                { value: 2, label: '2+ stops', color: 'bg-red-100 text-red-800' }
              ].map((stop) => (
                <label key={stop.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.stops?.includes(stop.value) || false}
                    onChange={(e) => {
                      const currentStops = filters.stops || [];
                      const newStops = e.target.checked
                        ? [...currentStops, stop.value]
                        : currentStops.filter(s => s !== stop.value);
                      handleFilterChange('stops', newStops);
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{stop.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${stop.color}`}>
                    {stop.value === 0 ? 'Direct' : `${stop.value} stop${stop.value > 1 ? 's' : ''}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Airlines */}
          {availableAirlines.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <PaperAirplaneIcon className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">Airlines</h4>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {availableAirlines.map((airline) => (
                  <label key={airline} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.airlines?.includes(airline) || false}
                      onChange={(e) => {
                        const currentAirlines = filters.airlines || [];
                        const newAirlines = e.target.checked
                          ? [...currentAirlines, airline]
                          : currentAirlines.filter(a => a !== airline);
                        handleFilterChange('airlines', newAirlines);
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{airline}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Departure Time */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <ClockIcon className="h-4 w-4 text-gray-600" />
              <h4 className="font-medium text-gray-900">Departure Time</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'morning', label: 'Morning', time: '6AM - 12PM' },
                { value: 'afternoon', label: 'Afternoon', time: '12PM - 6PM' },
                { value: 'evening', label: 'Evening', time: '6PM - 12AM' },
                { value: 'night', label: 'Night', time: '12AM - 6AM' }
              ].map((timeSlot) => (
                <label key={timeSlot.value} className="flex items-center space-x-2 cursor-pointer p-2 rounded border border-gray-200 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={filters.departureTime?.includes(timeSlot.value) || false}
                    onChange={(e) => {
                      const currentTimes = filters.departureTime || [];
                      const newTimes = e.target.checked
                        ? [...currentTimes, timeSlot.value]
                        : currentTimes.filter(t => t !== timeSlot.value);
                      handleFilterChange('departureTime', newTimes);
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{timeSlot.label}</div>
                    <div className="text-xs text-gray-500">{timeSlot.time}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Cabin Class */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Cabin Class</h4>
            <div className="space-y-2">
              {[
                { value: 'economy', label: 'Economy' },
                { value: 'premium_economy', label: 'Premium Economy' },
                { value: 'business', label: 'Business' },
                { value: 'first', label: 'First Class' }
              ].map((cabin) => (
                <label key={cabin.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.cabinClass?.includes(cabin.value) || false}
                    onChange={(e) => {
                      const currentCabins = filters.cabinClass || [];
                      const newCabins = e.target.checked
                        ? [...currentCabins, cabin.value]
                        : currentCabins.filter(c => c !== cabin.value);
                      handleFilterChange('cabinClass', newCabins);
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{cabin.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightFilters; 