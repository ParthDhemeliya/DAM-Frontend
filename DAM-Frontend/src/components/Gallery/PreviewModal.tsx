import React, { useState, useEffect } from 'react'
import {
  XCircleIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import type { Asset } from '../../interfaces'
import { streamAsset, deleteAsset } from '../../services/api'
import { toast } from 'react-toastify'

interface PreviewModalProps {
  previewOpen: boolean
  previewAsset: Asset | null
  onClose: () => void
  onDownload: (asset: Asset) => void
  onAssetDeleted?: (deletedAssetId: number) => void
  formatFileSize: (bytes: number) => string
  formatDate: (dateString: string) => string
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  previewOpen,
  previewAsset,
  onClose,
  onDownload,
  onAssetDeleted,
  formatFileSize,
  formatDate,
}) => {
  const [imageError, setImageError] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [streamUrl, setStreamUrl] = useState<string>('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (previewAsset) {
      const url = streamAsset(previewAsset.id)
      setStreamUrl(url)
      setImageError(false)
      setVideoError(false)
    }
  }, [previewAsset])

  if (!previewOpen || !previewAsset) {
    return null
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleVideoError = () => {
    setVideoError(true)
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
  }

  const handleDeleteConfirm = async () => {
    if (!previewAsset) {
      return
    }

    try {
      setIsDeleting(true)
      setShowDeleteConfirm(false)

      await deleteAsset(previewAsset.id)

      toast.success(
        `Asset "${previewAsset.original_name}" deleted successfully`
      )

      if (onAssetDeleted) {
        onAssetDeleted(previewAsset.id)
      }

      onClose()
    } catch (error) {
      toast.error('Failed to delete asset')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
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
                imageError ? (
                  <div className="text-center p-8 text-red-500">
                    <svg
                      className="mx-auto h-12 w-12 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <p className="text-sm">Failed to load image</p>
                  </div>
                ) : (
                  <img
                    src={streamUrl}
                    alt={previewAsset.original_name}
                    className="max-h-[70vh] object-contain"
                    onError={handleImageError}
                    crossOrigin="anonymous"
                  />
                )
              ) : previewAsset.mime_type.startsWith('video/') ? (
                videoError ? (
                  <div className="text-center p-8 text-red-500">
                    <svg
                      className="mx-auto h-12 w-12 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <p className="text-sm">Failed to load video</p>
                  </div>
                ) : (
                  <video
                    src={streamUrl}
                    controls
                    className="w-full h-full"
                    onError={handleVideoError}
                    crossOrigin="anonymous"
                  />
                )
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
              <span className="font-medium">Type:</span>{' '}
              {previewAsset.mime_type}
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
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Asset
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete "{previewAsset.original_name}
                  "? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      handleDeleteCancel()
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteConfirm()
                    }}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default PreviewModal
