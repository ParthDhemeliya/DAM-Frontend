import { useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  CloudArrowUpIcon,
  XMarkIcon,
  DocumentIcon,
  PhotoIcon,
  FilmIcon,
} from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  addFiles,
  removeFile,
  uploadFiles,
  clearFiles,
} from '../store/slices/uploadSlice'

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return PhotoIcon
  if (fileType.startsWith('video/')) return FilmIcon
  return DocumentIcon
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function Upload() {
  const dispatch = useAppDispatch()
  const { files, uploading, error, success } = useAppSelector(
    (state) => state.upload
  )

  const fileInputRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Check if user is trying to select more than 50 files
      if (acceptedFiles.length > 50) {
        // Since this component doesn't have direct access to toast, we'll use a simple alert
        // or you can add toast functionality here
        alert(
          `You can only select a maximum of 50 files at once. You selected ${acceptedFiles.length} files.`
        )
        return
      }

      const filesWithPreview = acceptedFiles.map((file) => ({
        ...file,
        id: `${file.name}-${Date.now()}`,
        preview: file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : undefined,
      }))
      dispatch(addFiles(filesWithPreview))
    },
    [dispatch]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'text/plain': ['.txt'],
    },
    multiple: true,
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.length > 0) {
      // Check if user is trying to select more than 50 files
      if (selectedFiles.length > 50) {
        alert(
          `You can only select a maximum of 50 files at once. You selected ${selectedFiles.length} files.`
        )
        return
      }
      onDrop(selectedFiles)
    }
  }

  const handleRemoveFile = (fileId: string) => {
    dispatch(removeFile(fileId))
  }

  const handleUpload = async () => {
    if (files.length > 0) {
      await dispatch(uploadFiles(files))
    }
  }

  const handleClearFiles = () => {
    dispatch(clearFiles())
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Assets
          </h1>
          <p className="text-gray-600">
            Upload your digital assets to the DAM platform
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-8 mb-8">
          <div
            {...getRootProps()}
            className={`text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
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
              {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
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
              Supports: Images, Videos, PDFs, Documents, Spreadsheets, Text
              files
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Maximum 50 files can be uploaded at once
            </p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Selected Files ({files.length})
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={handleClearFiles}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Clear All
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload Files'}
                </button>
              </div>
            </div>

            {/* File Limit Warning */}
            {files.length >= 40 && files.length < 50 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ You're approaching the limit. You can only upload a maximum
                  of 50 files at once.
                </p>
              </div>
            )}

            {files.length === 50 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-orange-800 text-sm">
                  🚫 You've reached the maximum limit of 50 files. Remove some
                  files before adding more.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {files.map((file) => {
                const IconComponent = getFileIcon(file.type)
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <IconComponent className="w-10 h-10 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • {file.type}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800">Files uploaded successfully!</p>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">Uploading files...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: '0%' }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
