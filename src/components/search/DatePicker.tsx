import { useState, useEffect, useRef } from 'react';
import { 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, isBefore, addDays, subDays } from 'date-fns';

interface DatePickerProps {
  departureDate: string;
  returnDate?: string;
  onDepartureDateChange: (date: string) => void;
  onReturnDateChange?: (date: string) => void;
  isRoundTrip: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const DatePicker = ({
  departureDate,
  returnDate,
  onDepartureDateChange,
  onReturnDateChange,
  isRoundTrip,
  minDate = new Date(),
  maxDate = addMonths(new Date(), 11), // 11 months from now
  className = ''
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeField, setActiveField] = useState<'departure' | 'return' | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    departureDate ? new Date(departureDate) : null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    returnDate ? new Date(returnDate) : null
  );
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  
  const departureCalendarRef = useRef<HTMLDivElement>(null);
  const returnCalendarRef = useRef<HTMLDivElement>(null);
  const oneWayCalendarRef = useRef<HTMLDivElement>(null);
  const departureFieldRef = useRef<HTMLDivElement>(null);
  const returnFieldRef = useRef<HTMLDivElement>(null);
  const oneWayFieldRef = useRef<HTMLDivElement>(null);

  // Update internal state when props change
  useEffect(() => {
    if (departureDate) {
      setSelectedStartDate(new Date(departureDate));
    }
    if (returnDate) {
      setSelectedEndDate(new Date(returnDate));
    }
  }, [departureDate, returnDate]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      let shouldClose = false;
      
      if (activeField === 'departure' && departureCalendarRef.current) {
        shouldClose = !departureCalendarRef.current.contains(target);
      } else if (activeField === 'return' && returnCalendarRef.current) {
        shouldClose = !returnCalendarRef.current.contains(target);
      } else if (!isRoundTrip && oneWayCalendarRef.current) {
        shouldClose = !oneWayCalendarRef.current.contains(target);
      }
      
      if (shouldClose) {
        setIsOpen(false);
        setActiveField(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, activeField, isRoundTrip]);

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });

    // Add padding days from previous month
    const firstDayOfWeek = start.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.unshift(subDays(start, i + 1));
    }

    // Add padding days from next month
    const lastDayOfWeek = end.getDay();
    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
      days.push(addDays(end, i));
    }

    return days;
  };

  const handleDateClick = (date: Date) => {
    if (isBefore(date, minDate) || isBefore(maxDate, date)) {
      return;
    }

    if (!isRoundTrip) {
      // One way trip - just set departure date
      setSelectedStartDate(date);
      onDepartureDateChange(format(date, 'yyyy-MM-dd'));
      setIsOpen(false);
      setActiveField(null);
    } else {
      // Round trip - handle based on active field
      if (activeField === 'departure') {
        // Selecting departure date
        setSelectedStartDate(date);
        setSelectedEndDate(null);
        onDepartureDateChange(format(date, 'yyyy-MM-dd'));
        if (onReturnDateChange) {
          onReturnDateChange('');
        }
        // Keep calendar open for return date selection
      } else if (activeField === 'return') {
        // Selecting return date
        if (isBefore(date, selectedStartDate!)) {
          // If return date is before departure, swap them
          setSelectedStartDate(date);
          setSelectedEndDate(selectedStartDate);
          onDepartureDateChange(format(date, 'yyyy-MM-dd'));
          if (onReturnDateChange) {
            onReturnDateChange(format(selectedStartDate!, 'yyyy-MM-dd'));
          }
        } else {
          setSelectedEndDate(date);
          if (onReturnDateChange) {
            onReturnDateChange(format(date, 'yyyy-MM-dd'));
          }
        }
        setIsOpen(false);
        setActiveField(null);
      }
    }
  };

  const isInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return !isBefore(date, selectedStartDate) && !isBefore(selectedEndDate, date);
  };

  const isRangeStart = (date: Date) => {
    return selectedStartDate && isSameDay(date, selectedStartDate);
  };

  const isRangeEnd = (date: Date) => {
    return selectedEndDate && isSameDay(date, selectedEndDate);
  };

  const getDateClasses = (date: Date) => {
    const baseClasses = 'w-10 h-10 flex items-center justify-center text-sm rounded-full cursor-pointer transition-colors';
    
    if (isBefore(date, minDate) || isBefore(maxDate, date)) {
      return `${baseClasses} text-gray-300 cursor-not-allowed`;
    }
    
    if (isToday(date)) {
      return `${baseClasses} bg-primary-100 text-primary-700 font-semibold`;
    }
    
    if (isRangeStart(date) || isRangeEnd(date)) {
      return `${baseClasses} bg-primary-600 text-white font-semibold`;
    }
    
    if (isInRange(date)) {
      return `${baseClasses} bg-primary-100 text-primary-700`;
    }
    
    if (hoveredDate && isInRange(hoveredDate) && !isBefore(date, selectedStartDate!) && !isBefore(selectedEndDate || hoveredDate, date)) {
      return `${baseClasses} bg-primary-50 text-primary-700`;
    }
    
    return `${baseClasses} hover:bg-gray-100`;
  };

  const clearDates = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setActiveField(null);
    onDepartureDateChange('');
    if (onReturnDateChange) {
      onReturnDateChange('');
    }
  };

  const formatDisplayDate = (date: string) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const getCalendarPosition = (fieldType: 'departure' | 'return' | 'oneway') => {
    let fieldRef: HTMLDivElement | null = null;
    let style: React.CSSProperties = {
      position: 'absolute',
      top: undefined,
      left: undefined,
      right: undefined,
      zIndex: 50,
    };

    if (fieldType === 'departure') {
      fieldRef = departureFieldRef.current;
      if (fieldRef) {
        style.top = `${fieldRef.offsetHeight + 4}px`;
        style.left = '0px';
      }
    } else if (fieldType === 'return') {
      fieldRef = returnFieldRef.current;
      if (fieldRef) {
        style.top = `${fieldRef.offsetHeight + 4}px`;
        style.right = '0px';
        style.left = 'auto';
      }
    } else if (fieldType === 'oneway') {
      fieldRef = oneWayFieldRef.current;
      if (fieldRef) {
        style.top = `${fieldRef.offsetHeight + 4}px`;
        style.left = '0px';
      }
    }
    return style;
  };

  return (
    <div className={`relative ${className}`}>
      {isRoundTrip ? (
        // Round trip - show two separate date fields
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Departure Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Date
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <div
                ref={departureFieldRef}
                onClick={() => {
                  setActiveField('departure');
                  setIsOpen(true);
                }}
                className="input-field pl-10 pr-10 cursor-pointer"
              >
                {departureDate ? (
                  <span>{formatDisplayDate(departureDate)}</span>
                ) : (
                  <span className="text-gray-500">Select departure date</span>
                )}
              </div>
              {departureDate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDepartureDateChange('');
                    setSelectedStartDate(null);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Return Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Return Date
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <div
                ref={returnFieldRef}
                onClick={() => {
                  setActiveField('return');
                  setIsOpen(true);
                }}
                className="input-field pl-10 pr-10 cursor-pointer"
              >
                {returnDate ? (
                  <span>{formatDisplayDate(returnDate)}</span>
                ) : (
                  <span className="text-gray-500">Select return date</span>
                )}
              </div>
              {returnDate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onReturnDateChange) {
                      onReturnDateChange('');
                    }
                    setSelectedEndDate(null);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        // One way - show single date field
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departure Date
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <div
              ref={oneWayFieldRef}
              onClick={() => {
                setActiveField('departure');
                setIsOpen(true);
              }}
              className="input-field pl-10 pr-10 cursor-pointer"
            >
              {departureDate ? (
                <span>{formatDisplayDate(departureDate)}</span>
              ) : (
                <span className="text-gray-500">Select departure date</span>
              )}
            </div>
            {departureDate && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearDates();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Calendar Dropdown for Departure */}
      {isOpen && activeField === 'departure' && (
        <div
          ref={departureCalendarRef}
          style={getCalendarPosition('departure')}
          className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[320px]"
        >
          {/* Selection Status */}
          <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
            <span className="text-gray-600">
              {selectedStartDate
                ? `Departure: ${format(selectedStartDate, 'MMM dd')}`
                : 'Select departure date'}
            </span>
          </div>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={isSameMonth(currentMonth, minDate)}
            >
              <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
            </button>
            
            <h3 className="font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={isSameMonth(currentMonth, maxDate)}
            >
              <ChevronRightIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="w-10 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <div
                key={index}
                className={getDateClasses(date)}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {format(date, 'd')}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {selectedStartDate && (
                  <>
                    Departure: {format(selectedStartDate, 'MMM dd')}
                    {selectedEndDate && (
                      <> • Return: {format(selectedEndDate, 'MMM dd')}</>
                    )}
                  </>
                )}
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveField(null);
                }}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Dropdown for Return */}
      {isOpen && activeField === 'return' && (
        <div
          ref={returnCalendarRef}
          style={getCalendarPosition('return')}
          className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[320px]"
        >
          {/* Selection Status */}
          <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
            <span className="text-gray-600">
              {selectedEndDate
                ? `Return: ${format(selectedEndDate, 'MMM dd')}`
                : 'Select return date'}
            </span>
          </div>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={isSameMonth(currentMonth, minDate)}
            >
              <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
            </button>
            
            <h3 className="font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={isSameMonth(currentMonth, maxDate)}
            >
              <ChevronRightIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="w-10 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <div
                key={index}
                className={getDateClasses(date)}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {format(date, 'd')}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {selectedStartDate && (
                  <>
                    Departure: {format(selectedStartDate, 'MMM dd')}
                    {selectedEndDate && (
                      <> • Return: {format(selectedEndDate, 'MMM dd')}</>
                    )}
                  </>
                )}
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveField(null);
                }}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Dropdown for One Way */}
      {isOpen && !isRoundTrip && (
        <div
          ref={oneWayCalendarRef}
          style={getCalendarPosition('oneway')}
          className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[320px]"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={isSameMonth(currentMonth, minDate)}
            >
              <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
            </button>
            
            <h3 className="font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={isSameMonth(currentMonth, maxDate)}
            >
              <ChevronRightIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="w-10 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <div
                key={index}
                className={getDateClasses(date)}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {format(date, 'd')}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {selectedStartDate && (
                  <>Departure: {format(selectedStartDate, 'MMM dd')}</>
                )}
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveField(null);
                }}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker; 