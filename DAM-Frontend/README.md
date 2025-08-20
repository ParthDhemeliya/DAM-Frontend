# DAM Frontend

A modern React-based frontend for the Digital Asset Management (DAM) platform.

## Features

- **File Upload**: Drag and drop interface with multiple file support
- **File Types**: Supports images, videos, PDFs, documents, spreadsheets, and text files
- **Redux State Management**: Built with Redux Toolkit and Redux Thunk
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `env.example` to `.env`
   - Update the backend URL:
     ```
     VITE_API_BASE_URL=http://localhost:5000/api
     VITE_BACKEND_URL=http://localhost:5000
     ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Backend Configuration

The frontend is configured to connect to the backend running on Docker port 5000. Make sure your backend is running and accessible at `http://localhost:5000`.

## File Upload

The upload feature supports:
- **Drag and Drop**: Simply drag files onto the upload area
- **File Browser**: Click "browse files" to select files manually
- **Multiple Files**: Select and upload multiple files at once
- **File Preview**: Image previews for supported file types
- **Progress Tracking**: Upload progress indicators
- **Error Handling**: Comprehensive error messages and validation

## Supported File Types

- **Images**: JPEG, PNG, GIF, BMP, WebP
- **Videos**: MP4, AVI, MOV, WMV, FLV, WebM
- **Documents**: PDF, DOC, DOCX
- **Spreadsheets**: XLS, XLSX
- **Text**: TXT

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   └── Upload.tsx      # File upload page
├── store/              # Redux store configuration
│   ├── store.ts        # Main store
│   ├── hooks.ts        # Typed Redux hooks
│   └── slices/         # Redux slices
│       └── uploadSlice.ts  # Upload state management
└── App.tsx             # Main application component
```

## Redux State Management

The application uses Redux Toolkit with the following state structure:

- **Upload State**: Manages file selection, upload progress, and status
- **Async Actions**: File upload operations using Redux Thunk
- **Type Safety**: Full TypeScript support for state and actions

## Development

- **Hot Reload**: Changes are reflected immediately in development
- **Type Checking**: TypeScript compilation with strict mode
- **Linting**: ESLint configuration for code quality
- **Formatting**: Prettier for consistent code style

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## API Endpoints

The frontend connects to the following backend endpoints:

- `POST /api/assets/upload` - File upload endpoint
- `GET /api/stats` - Dashboard statistics
- `GET /health` - Health check endpoint

## Troubleshooting

1. **Backend Connection Issues**
   - Ensure the backend is running on Docker port 5000
   - Check the `.env` file configuration
   - Verify CORS settings on the backend

2. **File Upload Issues**
   - Check file size limits
   - Verify supported file types
   - Check browser console for error messages

3. **Build Issues**
   - Clear `node_modules` and reinstall dependencies
   - Check TypeScript compilation errors
   - Verify all import paths are correct
