import React from 'react'
import { XCircleIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import type { Asset } from '../../interfaces'
import { streamAsset } from '../../services/api'

interface PreviewModalProps {
  previewOpen: boolean
  previewAsset: Asset | null
  onClose: () => void
  onDownload: (asset: Asset) => void
  formatFileSize: (bytes: number) => string
  formatDate: (dateString: string) => string
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  previewOpen,
  previewAsset,
  onClose,
  onDownload,
  formatFileSize,
  formatDate,
}) => {
  if (!previewOpen || !previewAsset) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-5xl mx-4 bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {previewAsset.original_name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Close preview"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 bg-gray-50">
          <div className="w-full aspect-video bg-black flex items-center justify-center">
            {previewAsset.mime_type.startsWith('image/') ? (
              <img
                src={streamAsset(previewAsset.id)}
                alt={previewAsset.original_name}
                className="max-h-[70vh] object-contain"
              />
            ) : previewAsset.mime_type.startsWith('video/') ? (
              <video
                src={streamAsset(previewAsset.id)}
                controls
                className="w-full h-full"
              />
            ) : (
              <div className="text-center p-8 text-gray-300">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-3 text-sm">
                  No inline preview for this file type.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Type:</span> {previewAsset.mime_type}
            <span className="mx-2">•</span>
            <span className="font-medium">Size:</span>{' '}
            {formatFileSize(previewAsset.file_size)}
            <span className="mx-2">•</span>
            <span className="font-medium">Created:</span>{' '}
            {formatDate(previewAsset.created_at)}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(previewAsset)}
              className="inline-flex items-center px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Download
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewModal
