import axios from 'axios';
import type { FlightSearchParams, SearchResult } from '../types/flight';

// Sky Scrapper API configuration
const API_BASE_URL = 'https://sky-scrapper.p.rapidapi.com/api/v1';
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
    'Content-Type': 'application/json',
  },
});

export class FlightAPI {
  // Search for flights
  static async searchFlights(params: FlightSearchParams): Promise<SearchResult> {
    try {
      const response = await apiClient.get('/flights/search', {
        params: {
          originAirportCode: params.origin,
          destinationAirportCode: params.destination,
          date: params.departureDate,
          returnDate: params.returnDate,
          adults: params.adults,
          children: params.children,
          infants: params.infants,
          cabinClass: params.cabinClass,
          currencyCode: params.currency,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Flight search error:', error);
      throw new Error('Failed to search flights');
    }
  }

  // Get airport suggestions
  static async getAirportSuggestions(query: string) {
    try {
      const response = await apiClient.get('/airports/search', {
        params: { query },
      });
      return response.data;
    } catch (error) {
      console.error('Airport search error:', error);
      throw new Error('Failed to search airports');
    }
  }

  // Get flight details
  static async getFlightDetails(flightId: string) {
    try {
      const response = await apiClient.get(`/flights/${flightId}`);
      return response.data;
    } catch (error) {
      console.error('Flight details error:', error);
      throw new Error('Failed to get flight details');
    }
  }
}

export default FlightAPI; 