import React from 'react'

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
        <div className="mx-auto h-12 w-12 text-red-400 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-900 mb-2">
          Error loading assets
        </h3>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

export default ErrorState
