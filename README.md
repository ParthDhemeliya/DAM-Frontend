# DAM Platform - Digital Asset Management System

A comprehensive digital asset management platform with modern frontend and robust backend services.

## 🏗️ Project Structure

```
DAM/
├── DAM-Backend/          # Node.js/Express backend API
├── DAM-Frontend/         # React/TypeScript frontend
├── database/             # Database schemas and migrations
└── docker-compose.yml    # Docker orchestration
```

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI**: Built with Tailwind CSS and Heroicons
- **File Upload**: Drag & drop interface with real-time progress
- **Asset Management**: Organize, categorize, and manage digital files
- **Real-time Updates**: Live progress tracking and status updates
- **Responsive Design**: Mobile-first approach

### Backend (Node.js + Express)
- **RESTful API**: Comprehensive asset management endpoints
- **File Storage**: MinIO S3-compatible storage
- **Database**: PostgreSQL with Redis caching
- **Queue System**: Background job processing
- **Authentication**: JWT-based security

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- Vite for build tooling
- React Dropzone for file uploads
- React Toastify for notifications

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL database
- Redis for caching
- MinIO for file storage
- Bull queue for job processing

## 📦 Installation

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL
- Redis

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd DAM
   ```

2. **Start backend services**
   ```bash
   cd DAM-Backend
   docker-compose up -d
   npm install
   npm run dev
   ```

3. **Start frontend**
   ```bash
   cd DAM-Frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - MinIO Console: http://localhost:9001

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dam
REDIS_URL=redis://localhost:6379
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
```

## 📚 API Documentation

- **Assets**: `/api/assets` - File upload, retrieval, and management
- **Jobs**: `/api/jobs` - Background job status and management
- **Stats**: `/api/stats` - Analytics and usage statistics
- **Queues**: `/api/queues` - Queue management and monitoring

## 🚀 Development

### Frontend Development
```bash
cd DAM-Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd DAM-Backend
npm run dev          # Start with nodemon
npm run build        # Build TypeScript
npm start            # Start production server
```

## 🐳 Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions, please open an issue in the repository.
