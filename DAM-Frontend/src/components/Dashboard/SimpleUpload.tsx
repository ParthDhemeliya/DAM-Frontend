import { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  addFiles,
  addFileObjects,
  removeFile,
  uploadFiles,
  clearFiles,
} from '../../store/slices/uploadSlice'
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function SimpleUpload() {
  const dispatch = useAppDispatch()
  const { files, uploading, processing, error, success, progress } =
    useAppSelector((state) => state.upload)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.length > 0) {
      // Create file metadata for Redux state (serializable)
      const fileMetadata = selectedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
      }))

      // Create file object mappings for the Map (non-serializable)
      const fileObjects = selectedFiles.map((file, index) => ({
        id: fileMetadata[index].id,
        file: file,
      }))

      // Dispatch actions separately to avoid serialization issues
      dispatch(addFiles(fileMetadata))
      dispatch(addFileObjects(fileObjects))
    }
  }

  const handleUpload = async () => {
    if (files.length > 0) {
      try {
        const fileIds = files.map((file) => file.id)
        await dispatch(uploadFiles(fileIds))
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }
  }

  const handleRemoveFile = (fileId: string) => {
    dispatch(removeFile(fileId))
  }

  const handleClearFiles = () => {
    dispatch(clearFiles())
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getTotalSize = () => {
    return files.reduce((total, file) => total + file.size, 0)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-8 mb-6">
        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />

          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select files to upload
          </h3>
          <p className="text-gray-600 mb-4">
            or{' '}
            <button
              type="button"
              onClick={handleBrowseClick}
              className="text-blue-600 hover:text-blue-500 underline"
            >
              browse files
            </button>
          </p>
          <p className="text-sm text-gray-500">
            Supports: Images, Videos, PDFs, Documents, Spreadsheets, Text files
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Large files supported (no size limit)
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Selected Files ({files.length})
            </h3>
            <div className="text-sm text-gray-600">
              Total: {formatFileSize(getTotalSize())}
            </div>
          </div>

          {/* Progress Bar */}
          {(uploading || processing) && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{processing ? 'Processing...' : 'Uploading...'}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    processing ? 'bg-yellow-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              {processing && (
                <p className="text-xs text-yellow-600 mt-2">
                  Upload completed! Processing file on server...
                </p>
              )}
            </div>
          )}

          {/* Files */}
          <div className="space-y-3 mb-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-medium">
                        {file.type.split('/')[0].charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFile(file.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleClearFiles}
              className="text-gray-600 hover:text-gray-800 text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear All
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </button>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Upload Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                {progress === 100 && error.includes('timeout') && (
                  <p className="mt-2 text-xs">
                    <strong>Note:</strong> Your file was uploaded successfully
                    but the server response timed out. The file should be
                    available in your gallery.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Upload Successful!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your files have been uploaded successfully.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
