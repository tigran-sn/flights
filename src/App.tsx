import { useState } from 'react'
import Header from './components/layout/Header'
import FlightSearchForm from './components/search/FlightSearchForm'
import FlightResults from './components/results/FlightResults'
import type { FlightSearchParams, SearchResult, Flight } from './types/flight'
import FlightAPI from './services/api'
import { mockFlights } from './utils/mockData'

function App() {
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSearchParams, setCurrentSearchParams] = useState<{
    origin: string;
    destination: string;
    departureDate: string;
  } | null>(null)

  const handleSearch = async (params: FlightSearchParams) => {
    setIsLoading(true)
    setError(null)
    setCurrentSearchParams({
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
    })
    
    try {
      // For now, use mock data instead of API call
      // const results = await FlightAPI.searchFlights(params)
      // setSearchResults(results)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Use mock data
      setSearchResults({
        flights: mockFlights,
        totalCount: mockFlights.length,
        searchParams: params,
        timestamp: new Date().toISOString(),
      })
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

          {/* Flight Results */}
          {(searchResults || isLoading) && currentSearchParams && (
            <div className="mt-8">
              <FlightResults
                flights={searchResults?.flights || []}
                isLoading={isLoading}
                searchParams={currentSearchParams}
                onFlightSelect={(flight: Flight) => {
                  console.log('Selected flight:', flight)
                  // TODO: Handle flight selection
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
