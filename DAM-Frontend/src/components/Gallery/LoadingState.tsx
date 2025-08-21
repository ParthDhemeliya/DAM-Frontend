import React from 'react'

const LoadingState: React.FC = () => {
  return (
    <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="mx-auto h-12 w-12 text-blue-400 mb-4 animate-spin">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
      <p className="text-sm text-gray-600">Loading assets...</p>
    </div>
  )
}

export default LoadingState
