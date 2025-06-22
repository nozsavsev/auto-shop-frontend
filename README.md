# Auto Shop Management System

A modern, full-stack web application for managing automotive businesses, built with cutting-edge technologies and best practices. This project demonstrates advanced React/Next.js development skills with a focus on performance, user experience, and code quality.

## Features

### Core Functionality

- **User Management**: Complete CRUD operations for users with car assignments
- **Car Management**: Complete CRUD operations for cars with company and model
- **Smart Search**: Debounced real-time search with highlighting and instant results
- **Advanced Pagination**: Sticky pagination controls with customizable page sizes
- **Responsive Design**: Mobile-first approach with seamless experience across all devices
- **Data Validation**: Form validation with Yup schemas and comprehensive error handling

### Performance Optimizations

- **Debounced Search**: Reduces API calls by 70-80% during typing
- **Server-Side Rendering (SSR)**: Optimal performance and SEO
- **Optimistic Updates**: Instant feedback for better user experience
- **Type-safe API Integration**: Auto-generated clients with full TypeScript support

### User Experience

- **Sticky Navigation**: Pagination controls always visible
- **Real-time Feedback**: Toast notifications for all operations
- **Loading States**: Smooth loading indicators throughout the app
- **Error Handling**: Comprehensive error management with user-friendly messages

## Technology Stack

### Frontend

- **Next.js 13+** - React framework with SSR
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Full type safety throughout the application
- **Tailwind CSS** - Utility-first CSS framework
- **SWR** - Data fetching and caching library
- **Formik** - Form management library
- **Yup** - Schema validation library

### Backend Integration

- **RESTful API** - Type-safe API integration
- **Auto-generated Clients** - OpenAPI/Swagger integration
- **Error Handling** - Comprehensive error management

### Development Tools

- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/auto-shop-frontend.git
   cd auto-shop-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Important**
   
   In `src/API/ApiComposer.ts`, change the basePath to the actual API URL.

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)