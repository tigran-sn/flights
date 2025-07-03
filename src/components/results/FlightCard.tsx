import { 
  ClockIcon, 
  MapPinIcon, 
  PaperAirplaneIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import type { Flight } from '../../types/flight';

interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
}

const FlightCard = ({ flight, onSelect }: FlightCardProps) => {
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStopsText = (stops: number) => {
    if (stops === 0) return 'Direct';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <div className="p-6">
        {/* Header with Airline and Price */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <PaperAirplaneIcon className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
              <p className="text-sm text-gray-500">Flight {flight.flightNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">
              {formatPrice(flight.price, flight.currency)}
            </p>
            <p className="text-sm text-gray-500">per passenger</p>
          </div>
        </div>

        {/* Flight Route */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-900">{flight.origin}</span>
            </div>
            <p className="text-sm text-gray-500">{flight.departureAirport}</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-16 h-px bg-gray-300"></div>
              <PaperAirplaneIcon className="w-4 h-4 text-gray-400 transform rotate-90" />
              <div className="w-16 h-px bg-gray-300"></div>
            </div>
          </div>
          
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end space-x-2">
              <span className="font-medium text-gray-900">{flight.destination}</span>
              <MapPinIcon className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">{flight.arrivalAirport}</p>
          </div>
        </div>

        {/* Flight Times and Duration */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {formatTime(flight.departureTime)} - {formatTime(flight.arrivalTime)}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Duration: {flight.duration}
          </div>
        </div>

        {/* Flight Details */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              flight.stops === 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {getStopsText(flight.stops)}
            </span>
            <span className="text-sm text-gray-600 capitalize">
              {flight.cabinClass.replace('_', ' ')}
            </span>
          </div>
          
          <button
            onClick={() => onSelect?.(flight)}
            className="btn-primary text-sm px-4 py-2"
          >
            Select Flight
          </button>
        </div>

        {/* Additional Info */}
        {flight.aircraft && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Aircraft: {flight.aircraft}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightCard; 