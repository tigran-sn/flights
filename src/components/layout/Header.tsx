import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  HeartIcon,
  Bars3Icon 
} from '@heroicons/react/24/outline';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-600">
                ✈️ FlightFinder
              </h1>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              Flights
            </a>
            <a href="#" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              Hotels
            </a>
            <a href="#" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              Car Rentals
            </a>
            <a href="#" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              Packages
            </a>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search icon */}
            <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* Favorites */}
            <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <HeartIcon className="h-5 w-5" />
            </button>

            {/* User menu */}
            <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <UserIcon className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-gray-500 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <a href="#" className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium">
                Flights
              </a>
              <a href="#" className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium">
                Hotels
              </a>
              <a href="#" className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium">
                Car Rentals
              </a>
              <a href="#" className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium">
                Packages
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 