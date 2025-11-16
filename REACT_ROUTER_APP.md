# React Router Application

This project now includes a React Router-based analytics and authentication platform alongside the existing Next.js application.

## Overview

The React Router application provides:
- **Authentication System**: Mock authentication with local storage
- **Analytics Dashboard**: Financial performance metrics and KPI tracking
- **Company Management**: Multi-company support with detailed views
- **Financial Data**: P&L and Balance Sheet views
- **KPI Analysis**: Performance indicator tracking
- **Reports & Forecasting**: Management reporting and forecast modeling

## Running the React Router App

The React Router application runs on a separate port from the Next.js app:

```bash
# Start the React Router app with Vite (port 3002)
npm run dev:router

# Start the Next.js app (port 3001)
npm run dev
```

## Project Structure

```
/
├── App.tsx                      # Main React Router app with routes
├── main.tsx                     # Entry point with BrowserRouter
├── index.html                   # HTML entry point
├── vite.config.ts              # Vite configuration
├── hooks/
│   └── useAuth.tsx             # Authentication context and hook
├── components/
│   ├── RequireAuth.tsx         # Protected route wrapper
│   └── ui/                     # UI component library
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── tabs.tsx
│       └── toaster.tsx
└── pages/                      # All page components
    ├── Index.tsx               # Landing page
    ├── LoginPage.tsx           # Authentication page
    ├── AppDashboardPage.tsx    # Main analytics dashboard
    ├── CompanyHomePage.tsx     # Company hub
    ├── CompanyDataPage.tsx     # Financial data (P&L, Balance Sheet)
    ├── CompanyAnalysisPage.tsx # KPI analysis
    ├── CompanyReportsPage.tsx  # Management reports
    ├── CompanyForecastPage.tsx # Forecasting
    ├── Checkout.tsx            # Checkout flow
    ├── CheckEmail.tsx          # Email verification
    ├── WelcomeProgram.tsx      # Welcome page
    ├── Success.tsx             # Success page
    └── NotFound.tsx            # 404 page
```

## Routes

### Public Routes
- `/` - Landing page
- `/checkout` - Checkout page
- `/check-email` - Email verification
- `/welcome-program` - Welcome program
- `/success` - Success confirmation
- `/auth/login` - Login page

### Protected Routes (Require Authentication)
- `/app` - Main analytics dashboard
- `/company/:id` - Company hub
- `/company/:id/data` - Financial data (P&L, Balance Sheet)
- `/company/:id/analysis` - KPI analysis
- `/company/:id/reports` - Management reports
- `/company/:id/forecast` - Forecasting module

## Authentication

The application uses a mock authentication system that stores user data in localStorage. To log in:

1. Navigate to `/auth/login`
2. Enter any email (default: `demo@example.com`)
3. Click "Continue (mock login)"

The authentication can be replaced with Supabase auth in the future.

## Features

### Dashboard
- Real-time KPI cards (Revenue, Net Profit, Operating Margin, Cash Runway)
- Revenue vs Budget chart using Recharts
- Quick links to detailed tools
- Tabbed interface for different data views

### Company Pages
- **Home**: Central hub with links to all modules
- **Data**: P&L and Balance Sheet with import functionality
- **Analysis**: KPI Explorer with performance indicators
- **Reports**: Management and executive report templates
- **Forecast**: 3-way forecast modeling

### UI Components
All UI components are built with Tailwind CSS and are fully responsive:
- Button (default, outline, ghost variants)
- Card (with header, title, content)
- Input (text, email, file)
- Tabs (for organizing content)
- Toaster (for notifications)

## Technologies Used

- **React 18.2.0**: UI library
- **React Router DOM 7.9.6**: Client-side routing
- **Recharts 3.4.1**: Data visualization
- **Vite 7.2.2**: Build tool and dev server
- **TypeScript 5.9.3**: Type safety
- **Tailwind CSS 3.4.13**: Styling

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev:router

# Build for production
npm run build:router

# Preview production build
npm run preview:router
```

## Future Enhancements

- Replace mock auth with Supabase authentication
- Connect to real data sources via Supabase
- Implement actual data import functionality
- Add more interactive charts and visualizations
- Complete forecasting module implementation
- Add export functionality for reports
