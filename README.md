# AutoFlow Parts - Inventory Management System

A comprehensive inventory management system built for automotive parts companies. This application provides complete SKU management, inventory tracking, production planning, and vendor management capabilities for auto parts, components, and accessories.

## Features

- **Auto Parts Management**: Create and manage individual parts and component kits
- **Inventory Tracking**: Real-time inventory levels with safety stock monitoring for automotive components
- **Multi-location Support**: Manage inventory across multiple warehouses and distribution centers
- **Production Management**: Track production orders and bill of materials for automotive parts
- **Vendor Management**: Maintain vendor relationships and parts sourcing
- **Order Management**: Handle customer orders with full lifecycle tracking
- **Analytics & Reporting**: Comprehensive reporting and business intelligence for auto parts business

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: SQLite (with future scalability to PostgreSQL)
- **State Management**: React Context and Local Storage
- **Build Tool**: Vite
- **Icons**: Lucide React

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open http://localhost:8080 in your browser

## Database Schema

The application uses a comprehensive SQLite database schema designed for automotive parts inventory management:

- **Core Tables**: SKUs, Brands, Categories, Part Types
- **Inventory**: Multi-location inventory tracking for auto parts
- **Production**: BOM management and production orders
- **Orders**: Customer order management
- **Vendors**: Supplier and parts sourcing management

## Automotive Parts Categories

The system supports various automotive parts categories:

- **Engine Components**: Pistons, gaskets, filters, belts
- **Transmission Parts**: Gears, clutches, transmission fluid
- **Brake System**: Brake pads, rotors, brake fluid, calipers
- **Electrical**: Batteries, alternators, starters, wiring
- **Suspension**: Shocks, struts, springs, bushings
- **Body Parts**: Bumpers, fenders, mirrors, lights
- **Interior**: Seats, dashboard components, trim

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── lib/                # Utilities and database layer
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions
```

## License

This project is licensed under the MIT License.