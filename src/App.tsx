import { useState } from 'react'
import Header from './components/layout/Header'
import FlightSearchForm from './components/search/FlightSearchForm'
import type { FlightSearchParams, SearchResult } from './types/flight'
import FlightAPI from './services/api'

function App() {
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (params: FlightSearchParams) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const results = await FlightAPI.searchFlights(params)
      setSearchResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Your Perfect Flight
            </h2>
            <p className="text-lg text-gray-600">
              Search and compare flights from hundreds of airlines
            </p>
          </div>

          {/* Search Form */}
          <FlightSearchForm onSearch={handleSearch} isLoading={isLoading} />

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Search Results Placeholder */}
          {searchResults && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Search Results ({searchResults.totalCount} flights found)
              </h3>
              <div className="space-y-4">
                {searchResults.flights.map((flight) => (
                  <div key={flight.id} className="card p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {flight.origin} → {flight.destination}
                        </p>
                        <p className="text-sm text-gray-600">
                          {flight.airline} • {flight.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary-600">
                          ${flight.price}
                        </p>
                        <p className="text-sm text-gray-600">
                          {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
