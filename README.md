# Auto Shop Management System

A modern web application for managing automotive businesses, built with Next.js and TypeScript. Features comprehensive user and car management with real-time search, pagination, and responsive design.

## Features

- **User Management**: Complete CRUD operations for users with car assignments
- **Car Management**: Complete CRUD operations for cars with company and model tracking
- **Smart Search**: Debounced real-time search with highlighting
- **Advanced Pagination**: Configurable page sizes with sticky controls
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Data Validation**: Form validation with comprehensive error handling

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **State Management**: SWR for data fetching and caching
- **Forms**: Formik with Yup validation
- **API Integration**: Auto-generated TypeScript clients from OpenAPI specs
- **Build Output**: Standalone Docker-ready deployment

## Installation & Setup

### Prerequisites

- Node.js 22+
- npm or yarn

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

3. **Configure API endpoints**
   
   The application uses environment variables to configure API endpoints. For development, it defaults to `http://localhost:5005`.

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

### Environment Configuration

The application requires two environment variables for production deployment at build time:

- `NEXT_PUBLIC_API_URL`: Client-side API endpoint
- `NEXT_PUBLIC_SSR_API_URL`: Server-side rendering API endpoint

### Docker Deployment

Build the Docker image with API URL configuration:

```bash
# Build with custom API URLs
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.yourdomain.com \
  --build-arg NEXT_PUBLIC_SSR_API_URL=https://api.yourdomain.com \
  -t auto-shop-frontend .

# Run the container
docker run -p 3000:3000 auto-shop-frontend
```

### Environment File

Create a `.env.local` file for local development:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5005
NEXT_PUBLIC_SSR_API_URL=http://localhost:5005
```

### Production Deployment

For production environments, set the environment variables:

```bash
# Linux/macOS
export NEXT_PUBLIC_API_URL=https://api.yourdomain.com
export NEXT_PUBLIC_SSR_API_URL=https://api.yourdomain.com

# Windows PowerShell
$env:NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
$env:NEXT_PUBLIC_SSR_API_URL="https://api.yourdomain.com"
```

### Build and Start

```bash
# Build for production
npm run build

# Start production server
npm start
```

## API Configuration

The application automatically configures API endpoints based on the environment:

- **Development**: Uses `http://localhost:5005` by default
- **Production**: Uses environment variables `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SSR_API_URL`

API configuration is handled in `src/API/ApiComposer.ts` and supports both client-side and server-side rendering contexts.