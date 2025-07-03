# ✈️ FlightFinder - Google Flights Clone

A modern flight booking application built with React 19, TypeScript, and Tailwind CSS. This project replicates the core functionality of Google Flights with a clean, responsive interface.

## 🚀 Features

- **Flight Search**: Search for flights between any airports
- **Real-time Results**: Get live flight data from the Sky Scrapper API
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **React 19** - Latest React with new features
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Axios** - HTTP client for API requests
- **Headless UI** - Accessible UI components
- **Heroicons** - Beautiful SVG icons

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd flights
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
```

4. Get your RapidAPI key:
- Visit [Sky Scrapper API](https://rapidapi.com/apiheya/api/sky-scrapper)
- Sign up for a free account
- Subscribe to the API
- Copy your API key to the `.env` file

5. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── search/         # Search-related components
│   ├── results/        # Results display components
│   └── ui/             # Reusable UI components
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
├── pages/              # Page components
└── contexts/           # React contexts
```

## 🎯 Development Phases

### Phase 1: Foundation ✅
- [x] Project setup with React 19 + TypeScript + Vite
- [x] Tailwind CSS configuration
- [x] Basic project structure
- [x] API service setup
- [x] Header component
- [x] Flight search form

### Phase 2: Core Features 🔄
- [ ] Flight results display
- [ ] Flight card component
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive design

### Phase 3: Advanced Features 📋
- [ ] Date picker with calendar
- [ ] Filters (stops, airlines, price, time)
- [ ] Sort options
- [ ] Price trends
- [ ] Airport autocomplete

### Phase 4: Enhanced UX 📋
- [ ] Search history
- [ ] Favorites/Wishlist
- [ ] Price alerts
- [ ] Advanced search options

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 API Integration

This project uses the [Sky Scrapper API](https://rapidapi.com/apiheya/api/sky-scrapper) from RapidAPI to fetch real flight data. The API provides:

- Flight search functionality
- Airport information
- Real-time pricing
- Multiple airlines support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational purposes. Please respect the terms of service of the APIs used.

## 🙏 Acknowledgments

- [Google Flights](https://flights.google.com) for inspiration
- [Sky Scrapper API](https://rapidapi.com/apiheya/api/sky-scrapper) for flight data
- [Tailwind CSS](https://tailwindcss.com) for the styling framework
