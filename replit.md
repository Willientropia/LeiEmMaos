# Political News Platform - Brazil

## Overview

This is a full-stack web application focused on Brazilian political news with a system to connect citizens and elected politicians. The platform provides news management, comment moderation, and a request system for citizens to contact their local representatives.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack TypeScript Application
- **Monorepo Structure**: Client, server, and shared code in a single repository
- **Frontend**: React.js with TypeScript and Vite for development
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (using Neon Database)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite for frontend, esbuild for backend production builds

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared types, schemas, and utilities
├── migrations/      # Database migrations (Drizzle)
└── attached_assets/ # Project requirements and documentation
```

## Key Components

### Frontend Architecture
- **React Router**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom political theme variables

### Backend Architecture
- **REST API**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL
- **Connection Pooling**: Neon Database serverless driver
- **Request Logging**: Custom middleware for API request tracking
- **Error Handling**: Centralized error handling middleware

### Database Schema Design
- **Users**: Multi-role system (admin, politician, visitor)
- **Geographic Structure**: Brazilian states and municipalities
- **News Management**: Articles with location-based filtering
- **Comment System**: Moderated comments with approval workflow
- **Request System**: Citizen requests categorized by type and location

## Data Flow

### News Management Flow
1. Admins create/edit news articles through dashboard
2. Articles can be marked as featured for homepage display
3. Location-based filtering allows state/municipality-specific content
4. Public users view news with geographic filters

### Comment Moderation Flow
1. Users submit comments on news articles (name + content only)
2. Comments enter pending state requiring admin approval
3. Approved comments display publicly on article pages
4. Admins can approve/reject through moderation dashboard

### Citizen Request Flow
1. Citizens submit requests through public form with location data
2. Requests categorized by type (infrastructure, health, education, etc.)
3. Politicians can view requests filtered by their jurisdiction
4. Status tracking from pending to resolved

## External Dependencies

### Core Technologies
- **Database**: Neon Database (PostgreSQL-compatible serverless)
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Validation**: Zod for runtime type checking and form validation
- **Date Handling**: date-fns for date manipulation and formatting

### Development Tools
- **Vite**: Frontend development server and build tool
- **Drizzle Kit**: Database migrations and schema management
- **TypeScript**: Type safety across the entire stack
- **Tailwind CSS**: Utility-first CSS framework

### Authentication Strategy
- Session-based authentication planned (connect-pg-simple for session storage)
- Role-based access control for admin, politician, and public users
- Geographic-based permissions for politicians (state/municipality scope)

## Deployment Strategy

### Production Build Process
1. **Frontend**: Vite builds optimized React application to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle manages migrations and schema updates
4. **Static Assets**: Served from build output directory

### Environment Configuration
- **Development**: Local development with hot reloading via Vite
- **Database**: Environment variable `DATABASE_URL` for connection
- **Build Optimization**: Separate development and production configurations

### Scalability Considerations
- Serverless-ready architecture with Neon Database
- Stateless backend design for horizontal scaling
- CDN-friendly static asset structure
- Database connection pooling for efficient resource usage

### Geographic Data Management
- Complete Brazilian state and municipality structure
- Politician-location association for request routing
- Location-based content filtering and permissions
- Scalable to handle all Brazilian municipalities (5,570+)